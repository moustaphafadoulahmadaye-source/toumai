const fs = require('fs');

function addPasswordChange(file, logoutSelector) {
  let html = fs.readFileSync(file, 'utf8');

  // Add the change password modal
  const modalHTML = `
  <div id="passwordModal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.5); align-items:center; justify-content:center; z-index:100; padding:24px;">
    <div style="background:#fff; padding:32px; border-radius:16px; max-width:400px; width:100%; box-shadow:0 10px 40px rgba(0,0,0,0.1);">
      <h3 style="font-family:'Outfit', sans-serif; font-size:1.5rem; margin-bottom:8px;">Changer le mot de passe</h3>
      <form id="passwordForm">
        <div style="position:relative; margin-bottom:16px;">
          <input type="password" id="currPass" placeholder="Mot de passe actuel" required style="width:100%; padding:14px 40px 14px 14px; border:1px solid #ddd; border-radius:8px; font-family:'Inter', sans-serif;">
          <button type="button" onclick="togglePassword('currPass', this)" style="position:absolute; right:12px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; color:#666; padding:0; display:flex; align-items:center; justify-content:center;">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
          </button>
        </div>
        <div style="position:relative; margin-bottom:16px;">
          <input type="password" id="newPass" placeholder="Nouveau mot de passe" required style="width:100%; padding:14px 40px 14px 14px; border:1px solid #ddd; border-radius:8px; font-family:'Inter', sans-serif;">
          <button type="button" onclick="togglePassword('newPass', this)" style="position:absolute; right:12px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; color:#666; padding:0; display:flex; align-items:center; justify-content:center;">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
          </button>
        </div>
        <button type="submit" class="submit-btn" style="width:100%; margin-top:0;">Changer</button>
        <button type="button" class="btn-secondary" style="width:100%; margin-top:8px; text-align:center;" onclick="document.getElementById('passwordModal').style.display='none'">Annuler</button>
      </form>
    </div>
  </div>
  `;
  
  if (!html.includes('passwordModal')) {
    html = html.replace('</body>', modalHTML + '\n</body>');
  }

  // Add the logic
  const jsHTML = `
  <script>
    if (!window.passwordFormListenerAdded) {
      document.getElementById('passwordForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
          const res = await fetch('/api/auth/change-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('kolo_token') },
            body: JSON.stringify({
              currentPassword: document.getElementById('currPass').value,
              newPassword: document.getElementById('newPass').value
            })
          });
          const data = await res.json();
          if(!res.ok) throw new Error(data.error);
          
          if(typeof koloAlert !== 'undefined') await koloAlert(data.message || 'Mot de passe modifié avec succès !');
          else alert(data.message || 'Mot de passe modifié avec succès !');
          
          document.getElementById('passwordModal').style.display='none';
          document.getElementById('passwordForm').reset();
        } catch(err) {
          if(typeof koloAlert !== 'undefined') await koloAlert(err.message);
          else alert(err.message);
        }
      });
      window.passwordFormListenerAdded = true;
    }
  </script>
  `;
  if (!html.includes('passwordFormListenerAdded')) {
    html = html.replace('</body>', jsHTML + '\n</body>');
  }
  
  const jsToggle = `
  <script>
  function togglePassword(id, btn) {
    const input = document.getElementById(id);
    if (input.type === 'password') {
      input.type = 'text';
      btn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>';
    } else {
      input.type = 'password';
      btn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
    }
  }
  </script>
  `;
  if (!html.includes('function togglePassword')) {
      html = html.replace('</body>', jsToggle + '\n</body>');
  }

  // Add button
  if (!html.includes("getElementById('passwordModal').style.display='flex'")) {
    const btnHTML = `\n<button class="btn-secondary" style="width: 100%; margin-top: 12px; justify-content:center;" onclick="document.getElementById('passwordModal').style.display='flex'">Changer Mot de Passe</button>`;
    html = html.replace(logoutSelector, logoutSelector + btnHTML);
  }

  fs.writeFileSync(file, html);
  console.log('Fixed ' + file);
}

addPasswordChange('manager.html', 'onclick="logout()">DÉCONNEXION</button>');
addPasswordChange('compte.html', 'onclick="logout()" class="btn-logout">Déconnexion</button>');
