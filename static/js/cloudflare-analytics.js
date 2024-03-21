/*
  xlog :: static/js/cloudflare-analytics.js
*/

document.addEventListener('DOMContentLoaded', function () {
  var script = document.createElement('script');
  script.defer = true;
  script.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  script.setAttribute('data-cf-beacon', '{"token": "7d41e2bf4b29401d9c46d2b5ad807a2b"}');
  document.body.appendChild(script);
});
/* 

*/