/*
  xlog :: static/js/discuss_button.js
*/

document.addEventListener('DOMContentLoaded', () => {
  const script = document.createElement('script');
  script.defer = true;
  script.src = 'https://buttons.github.io/buttons.js';
  script.setAttribute(
    'data-cf-beacon',
    '{"token": "7d41e2bf4b29401d9c46d2b5ad807a2b"}'
  );
  document.body.appendChild(script);
});
