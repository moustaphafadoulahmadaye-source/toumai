
      document.addEventListener('DOMContentLoaded', () => {
        const lang = localStorage.getItem('kolo_lang') || 'fr';
        document.querySelectorAll('.nav-lang-select').forEach(s => s.value = lang);
      });
    