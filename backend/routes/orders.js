const express=require('express');
const db=require('../db');
const {authMiddleware,adminMiddleware}=require('./auth');
const router=express.Router();
const DELIVERY_FEE=Number(process.env.DELIVERY_FEE||2000);

function validItem(i){ return Number.isInteger(Number(i.product_id)) && Number.isInteger(Number(i.quantity)) && Number(i.quantity)>0 && Number(i.quantity)<=99; }
router.post('/', async (req,res)=>{
  const token = req.header('Authorization')?.replace(/^Bearer\s+/i,'');
  if (token) {
    try {
      const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET);
      const [users] = await db.query('SELECT role FROM users WHERE id = ?', [decoded.id]);
      if (users.length && users[0].role === 'admin') {
        return res.status(403).json({ error: "Les administrateurs ne peuvent pas passer de commandes. Cette fonction est réservée aux clients." });
      }
    } catch(e) {}
  }
  const name=String(req.body.customer_name||'').trim(), email=String(req.body.email||'').trim().toLowerCase(), phone=String(req.body.phone||'').trim(), address=String(req.body.address||'').trim(), items=req.body.items;
  if(name.length<2||name.length>150||!/^\S+@\S+\.\S+$/.test(email)||phone.length<5||phone.length>30||address.length<5||address.length>255||!Array.isArray(items)||items.length===0||items.length>50||items.some(i=>!validItem(i))) return res.status(400).json({error:'Informations de commande invalides.'});
  try{
    const merged=new Map(); for(const i of items){ const id=Number(i.product_id); merged.set(id,(merged.get(id)||0)+Number(i.quantity)); }
    if([...merged.values()].some(q=>q>99)) return res.status(400).json({error:'Quantité maximale dépassée.'});
    const ids=[...merged.keys()], placeholders=ids.map(()=>'?').join(',');
    const result=await db.transaction(async dbi=>{
      const products=await dbi.all(`SELECT id,name,price,stock FROM products WHERE id IN (${placeholders})`,ids);
      if(products.length!==ids.length) throw new Error('Un produit du panier est introuvable.');
      let total=DELIVERY_FEE;
      for(const p of products){const q=merged.get(p.id); if(p.stock<q) throw new Error(`Stock insuffisant pour ${p.name}.`); total+=p.price*q;}
      const order=await dbi.run('INSERT INTO orders (customer_name,email,phone,address,total) VALUES (?,?,?,?,?)',[name,email,phone,address,total]);
      for(const p of products){const q=merged.get(p.id); const original=await dbi.run('UPDATE products SET stock=stock-? WHERE id=? AND stock>=?',[q,p.id,q]); if(original.changes!==1) throw new Error(`Stock insuffisant pour ${p.name}.`); const item=items.find(i=>Number(i.product_id)===p.id); await dbi.run('INSERT INTO order_items (order_id,product_id,quantity,unit_price,size) VALUES (?,?,?,?,?)',[order.lastID,p.id,q,p.price,item?.size?String(item.size).slice(0,30):null]);}
      return {id:order.lastID,total};
    });
    res.status(201).json({order_id:result.id,total:result.total});
  }catch(err){console.error(err);res.status(400).json({error:err.message||'Commande impossible.'});}
});

router.get('/',authMiddleware,adminMiddleware,async(req,res)=>{try{
 const isSuper=process.env.SUPER_ADMIN_EMAIL && req.user.email.toLowerCase()===process.env.SUPER_ADMIN_EMAIL.toLowerCase();
 let orders,items;
 if(isSuper){[orders]=await db.query('SELECT * FROM orders ORDER BY created_at DESC');[items]=await db.query('SELECT oi.*,p.name,p.image_url,p.category FROM order_items oi JOIN products p ON p.id=oi.product_id');}
 else { [items]=await db.query('SELECT oi.*,p.name,p.image_url,p.category FROM order_items oi JOIN products p ON p.id=oi.product_id WHERE p.admin_id=?',[req.user.id]); if(!items.length)return res.json([]); const ids=[...new Set(items.map(i=>i.order_id))],ph=ids.map(()=>'?').join(','); [orders]=await db.query(`SELECT * FROM orders WHERE id IN (${ph}) ORDER BY created_at DESC`,ids); }
 res.json(orders.map(o=>({...o,items:items.filter(i=>i.order_id===o.id)})));
}catch(err){console.error(err);res.status(500).json({error:'Erreur serveur'});}});

router.get('/:id',authMiddleware,async(req,res)=>{const id=Number(req.params.id);if(!Number.isInteger(id))return res.status(400).json({error:'Identifiant invalide.'});try{const [orders]=await db.query('SELECT * FROM orders WHERE id=?',[id]);if(!orders.length)return res.status(404).json({error:'Commande introuvable.'});const order=orders[0];if(req.user.role!=='admin' && order.email.toLowerCase()!==req.user.email.toLowerCase())return res.status(403).json({error:'Accès refusé.'});const [items]=await db.query('SELECT oi.*,p.name FROM order_items oi JOIN products p ON p.id=oi.product_id WHERE oi.order_id=?',[id]);res.json({...order,items});}catch(err){console.error(err);res.status(500).json({error:'Erreur serveur'});}});
router.put('/:id/status',authMiddleware,adminMiddleware,async(req,res)=>{const id=Number(req.params.id),{status,delivery_date}=req.body;if(!Number.isInteger(id)||!['en_attente','confirmee','livree','annulee'].includes(status))return res.status(400).json({error:'Données invalides.'});try{await db.query('UPDATE orders SET status=?,delivery_date=? WHERE id=?',[status,delivery_date?String(delivery_date).slice(0,30):null,id]);res.json({success:true,status});}catch(err){console.error(err);res.status(500).json({error:'Erreur serveur'});}});
router.delete('/:id',authMiddleware,adminMiddleware,async(req,res)=>{const id=Number(req.params.id);if(!Number.isInteger(id))return res.status(400).json({error:'Identifiant invalide.'});try{const [r]=await db.query('DELETE FROM orders WHERE id=?',[id]);if(!r.affectedRows)return res.status(404).json({error:'Commande introuvable.'});res.json({success:true});}catch(err){console.error(err);res.status(500).json({error:'Erreur serveur'});}});
module.exports=router;
