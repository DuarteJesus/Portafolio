(function () {
  var config = window.SUPABASE_CONFIG;
  var form = document.getElementById('mensaje-form');
  var status = document.getElementById('mensaje-estado');
  var button = document.getElementById('mensaje-boton');

  function text(message) {
    return window.SitePreferences ? window.SitePreferences.text(message) : message;
  }

  function setStatus(message) {
    status.dataset.message = message;
    status.textContent = text(message);
  }

  document.addEventListener('site-language-change', function () {
    if (status && status.dataset.message) status.textContent = text(status.dataset.message);
  });

  if (!config || !config.url || !config.anonKey || !window.supabase) {
    if (button) button.disabled = true;
    if (status) {
      setStatus(config && config.url && config.anonKey
        ? 'No se pudo cargar el servicio de mensajes. Inténtalo más tarde.'
        : 'El formulario estará disponible pronto.');
      status.dataset.error = 'true';
    }
    if (config && config.url && config.anonKey && !window.supabase) {
      console.error('No se pudo cargar la biblioteca de Supabase.');
    }
    return;
  }

  var client = window.supabase.createClient(config.url, config.anonKey);
  var sessionKey = 'duarte-site-session-v1';

  function getSessionId() {
    var sessionId = sessionStorage.getItem(sessionKey);
    if (!sessionId) {
      if (crypto.randomUUID) {
        sessionId = crypto.randomUUID();
      } else {
        var bytes = crypto.getRandomValues(new Uint8Array(16));
        bytes[6] = (bytes[6] & 0x0f) | 0x40;
        bytes[8] = (bytes[8] & 0x3f) | 0x80;
        var hex = Array.from(bytes, function (value) {
          return value.toString(16).padStart(2, '0');
        });
        sessionId = hex.slice(0, 4).join('') + '-' + hex.slice(4, 6).join('') + '-' +
          hex.slice(6, 8).join('') + '-' + hex.slice(8, 10).join('') + '-' + hex.slice(10).join('');
      }
      sessionStorage.setItem(sessionKey, sessionId);
    }
    return sessionId;
  }

  var sessionId = getSessionId();

  client.rpc('record_page_view', {
    p_session_id: sessionId,
    p_path: window.location.pathname
  }).then(function (result) {
    if (result.error) console.error('No se pudo registrar la visita:', result.error.message);
  }).catch(function (error) {
    console.error('Falló el registro de la visita:', error);
  });

  var presenceChannel = client.channel('website-live', {
    config: { presence: { key: sessionId } }
  }).subscribe(function (state) {
    if (state === 'SUBSCRIBED') {
      presenceChannel.track({ active: true }).then(function (result) {
        if (result !== 'ok') console.error('No se pudo anunciar la sesión activa:', result);
      }).catch(function (error) {
        console.error('Falló el contador de visitantes en vivo:', error);
      });
    } else if (state === 'CHANNEL_ERROR' || state === 'TIMED_OUT') {
      console.error('No se pudo conectar el contador de visitantes en vivo:', state);
    }
  });

  if (!form || !status || !button) return;

  function messageErrorText(error) {
    var message = error && error.message ? error.message : '';
    var code = error && error.code ? error.code : '';

    if (message.indexOf('RATE_LIMITED') !== -1) {
      return text('Espera un minuto antes de enviar otro mensaje.');
    }
    if (message.indexOf('INVALID_MESSAGE') !== -1) {
      return text('Escribe un mensaje de hasta 2000 caracteres.');
    }
    if (code === 'PGRST202' || code === '42883') {
      return text('El servicio de mensajes necesita configuración. Avísame por correo para revisarlo.');
    }
    if (code === '42501' || code === '401' || code === '403') {
      return text('El servicio rechazó el mensaje. Avísame por correo para revisarlo.');
    }
    return text('No se pudo enviar. Inténtalo de nuevo o escríbeme por correo.');
  }

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    setStatus('Enviando…');
    delete status.dataset.error;
    delete status.dataset.success;
    button.disabled = true;

    try {
      var values = new FormData(form);
      var result = await client.rpc('submit_message', {
        p_session_id: sessionId,
        p_name: values.get('name') || null,
        p_message: values.get('message'),
        p_website: document.getElementById('mensaje-web').value
      });

      if (result.error) {
        console.error('No se pudo enviar el mensaje:', result.error.message);
        status.textContent = messageErrorText(result.error);
        status.dataset.error = 'true';
        return;
      }

      form.reset();
      setStatus('¡Mensaje enviado! Gracias por escribirme.');
      status.dataset.success = 'true';
    } catch (error) {
      console.error('Falló el envío del mensaje:', error);
      setStatus('No se pudo enviar. Comprueba tu conexión e inténtalo de nuevo.');
      status.dataset.error = 'true';
    } finally {
      button.disabled = false;
    }
  });
})();
