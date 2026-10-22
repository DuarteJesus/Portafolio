(function () {
  var config = window.SUPABASE_CONFIG;
  var access = document.getElementById('acceso');
  var dashboard = document.getElementById('dashboard');
  var loginForm = document.getElementById('login-form');
  var loginStatus = document.getElementById('login-estado');
  var dashboardStatus = document.getElementById('dashboard-estado');
  var loginButton = loginForm.querySelector('button');
  var signOutButton = document.getElementById('cerrar-sesion');
  var refreshButton = document.getElementById('actualizar');
  var messagesNode = document.getElementById('mensajes');
  var latestMessages = [];

  function text(message) {
    return window.SitePreferences ? window.SitePreferences.text(message) : message;
  }

  if (!config || !config.url || !config.anonKey || !window.supabase) {
    loginStatus.textContent = config && config.url && config.anonKey
      ? text('No se pudo cargar el servicio de acceso. Inténtalo más tarde.')
      : text('La dashboard estará disponible cuando se conecte Supabase.');
    loginStatus.dataset.error = 'true';
    loginButton.disabled = true;
    if (config && config.url && config.anonKey && !window.supabase) {
      console.error('No se pudo cargar la biblioteca de Supabase.');
    }
    return;
  }

  var client = window.supabase.createClient(config.url, config.anonKey);
  var messageChannel;
  var presenceChannel;

  function showStatus(node, message, isError) {
    node.dataset.message = message;
    node.textContent = text(message);
    if (isError) node.dataset.error = 'true';
    else delete node.dataset.error;
  }

  function showDashboard(session) {
    access.classList.toggle('oculto', !!session);
    dashboard.classList.toggle('oculto', !session);
    signOutButton.classList.toggle('oculto', !session);
    if (session) {
      refresh();
      connectRealtime();
    } else {
      disconnectRealtime();
    }
  }

  function formatNumber(value) {
    return Number(value || 0).toLocaleString(window.SitePreferences && window.SitePreferences.getLanguage() === 'en' ? 'en-US' : 'es-CO');
  }

  async function refreshStats() {
    var result = await client
      .from('site_daily_stats')
      .select('page_views,visitor_sessions')
      .order('day', { ascending: false })
      .limit(3650);

    if (result.error) throw result.error;

    var totals = result.data.reduce(function (summary, day) {
      summary.views += Number(day.page_views || 0);
      summary.sessions += Number(day.visitor_sessions || 0);
      return summary;
    }, { views: 0, sessions: 0 });

    document.getElementById('vistas-totales').textContent = formatNumber(totals.views);
    document.getElementById('sesiones-totales').textContent = formatNumber(totals.sessions);
  }

  async function refreshMessages() {
    var result = await client
      .from('messages')
      .select('id,name,message,created_at,is_read')
      .order('created_at', { ascending: false })
      .limit(100);

    if (result.error) throw result.error;
    renderMessages(result.data);
  }

  function renderMessages(messages) {
    latestMessages = messages;
    messagesNode.replaceChildren();
    document.getElementById('mensajes-contador').textContent = formatNumber(messages.filter(function (message) {
      return !message.is_read;
    }).length);

    if (messages.length === 0) {
      var empty = document.createElement('p');
      empty.className = 'vacio';
      empty.textContent = text('Todavía no hay mensajes.');
      messagesNode.appendChild(empty);
      return;
    }

    messages.forEach(function (message) {
      var card = document.createElement('article');
      card.className = 'mensaje';
      card.dataset.leido = String(message.is_read);

      var header = document.createElement('div');
      header.className = 'mensaje-cabecera';
      var name = document.createElement('span');
      name.className = 'mensaje-nombre';
      name.textContent = message.name || text('Sin nombre');
      var date = document.createElement('time');
      date.className = 'mensaje-fecha';
      date.dateTime = message.created_at;
      date.textContent = new Date(message.created_at).toLocaleString(window.SitePreferences && window.SitePreferences.getLanguage() === 'en' ? 'en-US' : 'es-CO');
      header.append(name, date);

      var body = document.createElement('p');
      body.className = 'mensaje-cuerpo';
      body.textContent = message.message;
      card.append(header, body);

      var actions = document.createElement('div');
      actions.className = 'mensaje-acciones';
      if (!message.is_read) {
        var markRead = document.createElement('button');
        markRead.className = 'boton-secundario';
        markRead.type = 'button';
        markRead.textContent = text('Marcar como leído');
        markRead.addEventListener('click', function () {
          updateMessage(message.id, { is_read: true });
        });
        actions.appendChild(markRead);
      }

      var remove = document.createElement('button');
      remove.className = 'boton-secundario';
      remove.type = 'button';
      remove.textContent = text('Eliminar');
      remove.addEventListener('click', function () {
        if (window.confirm(text('¿Eliminar este mensaje? Esta acción no se puede deshacer.'))) {
          deleteMessage(message.id);
        }
      });
      actions.appendChild(remove);
      card.appendChild(actions);
      messagesNode.appendChild(card);
    });
  }

  async function updateMessage(id, changes) {
    var result = await client.from('messages').update(changes).eq('id', id);
    if (result.error) {
      console.error('No se pudo actualizar el mensaje:', result.error.message);
      showStatus(dashboardStatus, 'No se pudo actualizar el mensaje.', true);
      return;
    }
    showStatus(dashboardStatus, 'Mensaje actualizado.', false);
    await refreshMessages();
  }

  async function deleteMessage(id) {
    var result = await client.from('messages').delete().eq('id', id);
    if (result.error) {
      console.error('No se pudo eliminar el mensaje:', result.error.message);
      showStatus(dashboardStatus, 'No se pudo eliminar el mensaje.', true);
      return;
    }
    showStatus(dashboardStatus, 'Mensaje eliminado.', false);
    await refreshMessages();
  }

  async function refresh() {
    refreshButton.disabled = true;
    showStatus(dashboardStatus, 'Actualizando…', false);
    try {
      await Promise.all([refreshStats(), refreshMessages()]);
      showStatus(dashboardStatus, 'Datos actualizados.', false);
    } catch (error) {
      console.error('No se pudo actualizar la dashboard:', error.message);
      showStatus(dashboardStatus, 'No se pudieron cargar los datos. Revisa la conexión y la configuración de Supabase.', true);
    } finally {
      refreshButton.disabled = false;
    }
  }

  function connectRealtime() {
    disconnectRealtime();
    presenceChannel = client.channel('website-live');
    presenceChannel
      .on('presence', { event: 'sync' }, function () {
        var active = Object.keys(presenceChannel.presenceState()).length;
        document.getElementById('visitas-ahora').textContent = formatNumber(active);
      })
      .subscribe(function (state) {
        if (state === 'CHANNEL_ERROR' || state === 'TIMED_OUT') {
          console.error('No se pudo recibir el estado en vivo:', state);
          document.getElementById('visitas-ahora').textContent = '—';
        }
      });

    messageChannel = client
      .channel('dashboard-messages')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, function () {
        refreshMessages().catch(function (error) {
          console.error('No se pudieron actualizar los mensajes en vivo:', error.message);
          showStatus(dashboardStatus, 'No se pudieron actualizar los mensajes en vivo.', true);
        });
      })
      .subscribe();
  }

  function disconnectRealtime() {
    if (presenceChannel) client.removeChannel(presenceChannel);
    if (messageChannel) client.removeChannel(messageChannel);
    presenceChannel = null;
    messageChannel = null;
  }

  document.addEventListener('site-language-change', function () {
    renderMessages(latestMessages);
    [loginStatus, dashboardStatus].forEach(function (node) {
      if (node.dataset.message) node.textContent = text(node.dataset.message);
    });
  });

  loginForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    loginButton.disabled = true;
    showStatus(loginStatus, 'Enviando enlace…', false);
    var email = new FormData(loginForm).get('email');
    try {
      var result = await client.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: window.location.origin + '/dashboard/',
          shouldCreateUser: false
        }
      });
      if (result.error) {
        console.error('No se pudo iniciar sesión en la dashboard:', result.error.message);
        showStatus(loginStatus, 'No se pudo enviar el enlace. Comprueba el correo autorizado y la configuración.', true);
        return;
      }
      showStatus(loginStatus, 'Si el correo está autorizado, recibirás un enlace de acceso.', false);
    } catch (error) {
      console.error('Falló el inicio de sesión en la dashboard:', error);
      showStatus(loginStatus, 'No se pudo enviar el enlace. Comprueba tu conexión e inténtalo de nuevo.', true);
    } finally {
      loginButton.disabled = false;
    }
  });

  signOutButton.addEventListener('click', async function () {
    signOutButton.disabled = true;
    try {
      var result = await client.auth.signOut();
      if (result.error) {
        console.error('No se pudo cerrar la sesión:', result.error.message);
        showStatus(dashboardStatus, 'No se pudo cerrar la sesión.', true);
      }
    } catch (error) {
      console.error('Falló el cierre de sesión:', error);
      showStatus(dashboardStatus, 'No se pudo cerrar la sesión. Inténtalo de nuevo.', true);
    } finally {
      signOutButton.disabled = false;
    }
  });

  refreshButton.addEventListener('click', refresh);
  client.auth.onAuthStateChange(function (event, session) {
    showDashboard(session);
  });
  client.auth.getSession().then(function (result) {
    if (result.error) {
      console.error('No se pudo comprobar la sesión:', result.error.message);
      showStatus(loginStatus, 'No se pudo comprobar la sesión. Recarga e inténtalo de nuevo.', true);
      return;
    }
    showDashboard(result.data.session);
  });
})();
