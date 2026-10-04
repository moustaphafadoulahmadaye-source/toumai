const fs = require('fs');
let content = fs.readFileSync('manager.html', 'utf8');

// Inject the Supprimer button in loadOrders
content = content.replace(/<a href=\"tel:\$\{o\.phone\}\" class=\"btn-secondary\">([^<]+)<\/a>\s*` : ''}\s*<\/div>/g, 
'<a href="tel:${o.phone}" class="btn-secondary">$1</a>\n                ` : \'\'}\n                <button class="btn-primary" style="background:transparent; color:#ef4444; border: 1px solid #ef4444; margin-left:auto;" onclick="deleteOrder(${o.id})">Supprimer</button>\n              </div>');

// Inject deleteOrder function
if (!content.includes('async function deleteOrder')) {
  content = content.replace(/\/\/ UTILISATEURS/g,
`
    async function deleteOrder(id) {
      if(!(await koloConfirm("Voulez-vous vraiment supprimer cette commande ? (Cette action est irréversible)"))) return;
      try {
        await apiFetch(\`/api/orders/\${id}\`, { method: 'DELETE' });
        loadOrders();
      } catch(err) { await koloAlert(err.message); }
    }

    // UTILISATEURS`
  );
}

fs.writeFileSync('manager.html', content);
console.log('Fixed manager.html');
