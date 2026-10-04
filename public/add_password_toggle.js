const fs = require('fs');

function injectToggle(file) {
  let content = fs.readFileSync(file, 'utf8');

  // If already injected, skip
  if (content.includes('togglePassword')) {
    console.log(`Already injected in ${file}`);
    return;
  }

  // 1. Replace <input type="password" id="password"... with wrapped version
  // Login has: <input type="password" id="password" placeholder="••••••••" required>
  // or similar.
  const inputRegex = /<input type="password" id="([^"]+)"([^>]*)>/g;
  content = content.replace(inputRegex, (match, id, rest) => {
    // Add style="padding-right: 40px;" to the rest if not present
    let newRest = rest;
    if (!newRest.includes('style=')) {
      newRest += ' style="width:100%; padding-right:40px;"';
    } else {
      newRest = newRest.replace(/style="([^"]*)"/, 'style="$1 width:100%; padding-right:40px;"');
    }
    
    return `<div style="position: relative;">
              <input type="password" id="${id}"${newRest}>
              <button type="button" onclick="togglePassword('${id}', this)" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #666; padding: 0; display: flex; align-items: center; justify-content: center;">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              </button>
            </div>`;
  });

  // 2. Add the JS function before </body>
  const js = `
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
</body>`;
  
  content = content.replace('</body>', js);
  fs.writeFileSync(file, content);
  console.log(`Updated ${file}`);
}

injectToggle('login.html');
injectToggle('register.html');
