const express=require('express'); const db=require('../db'); const {authMiddleware}=require('./auth'); const router=express.Router();
router.get('/orders',authMiddleware,async(req,res)=>{try{const [orders]=await db.query('SELECT * FROM orders WHERE email=? ORDER BY created_at DESC',[req.user.email]);for(const o of orders){const [items]=await db.query('SELECT oi.*,p.name FROM order_items oi JOIN products p ON p.id=oi.product_id WHERE oi.order_id=?',[o.id]);o.items=items;}res.json(orders);}catch(e){console.error(e);res.status(500).json({error:'Erreur serveur'});}});
module.exports=router;
