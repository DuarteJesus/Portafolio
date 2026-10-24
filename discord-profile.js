(function () {
  function initDiscordProfile() {
    var profile = document.querySelector('[data-discord-profile]');
    if (!profile) return;

    var config = window.SITE || {};
    var status = profile.querySelector('[data-discord-status]');
    var bio = profile.querySelector('[data-discord-bio]');
    var activity = profile.querySelector('[data-discord-activity]');
    var customStatus = profile.querySelector('[data-discord-custom-status]');
    var devices = profile.querySelector('[data-discord-devices]');
    var liveLabel = profile.querySelector('[data-discord-live]');
    var name = profile.querySelector('[data-discord-name]');
    var username = profile.querySelector('[data-discord-username]');
    var avatar = profile.querySelector('[data-discord-avatar]');
    var fallback = profile.querySelector('[data-discord-fallback]');
    var indicator = profile.querySelector('[data-discord-indicator]');
    var link = profile.querySelector('[data-discord-link]');
    var discordId = String(config.discordId || '');
    var socket;
    var heartbeatTimer;
    var reconnectTimer;
    var reconnectDelay = 1000;
    var stopped = false;
    var receivedLiveUpdate = false;

    if (!/^\d+$/.test(discordId)) {
      if (status) status.textContent = discordId ? 'El ID de Discord no es válido.' : 'Sin Discord configurado.';
      if (link) link.hidden = true;
      if (discordId) console.error('El ID configurado para Discord no es válido.');
      return;
    }

    if (link) link.href = 'https://discord.com/users/' + encodeURIComponent(discordId);

    function renderBio(value) {
      if (!bio || !value) return;
      var fragment = document.createDocumentFragment();
      var urlPattern = /https?:\/\/[^\s]+/g;
      var previousEnd = 0;
      var match;

      while ((match = urlPattern.exec(value))) {
        fragment.appendChild(document.createTextNode(value.slice(previousEnd, match.index)));
        try {
          var url = new URL(match[0]);
          if (url.protocol !== 'http:' && url.protocol !== 'https:') throw new Error('Unsupported URL protocol.');
          var anchor = document.createElement('a');
          anchor.href = url.href;
          anchor.target = '_blank';
          anchor.rel = 'noopener noreferrer';
          anchor.textContent = match[0];
          fragment.appendChild(anchor);
        } catch (error) {
          fragment.appendChild(document.createTextNode(match[0]));
        }
        previousEnd = urlPattern.lastIndex;
      }

      fragment.appendChild(document.createTextNode(value.slice(previousEnd)));
      bio.replaceChildren(fragment);
    }

    renderBio(config.discordBio);

    function showFallback() {
      if (avatar) avatar.hidden = true;
      if (fallback) fallback.hidden = false;
    }

    function statusText(value) {
      return {
        online: 'En línea',
        idle: 'Ausente',
        dnd: 'No molestar',
        offline: 'Desconectado'
      }[value] || 'Desconectado';
    }

    function addActivity(title, lines) {
      var item = document.createElement('div');
      item.className = 'discord-activity-item';

      var heading = document.createElement('strong');
      heading.textContent = title;
      item.appendChild(heading);

      lines.filter(Boolean).forEach(function (line) {
        var detail = document.createElement('span');
        detail.textContent = line;
        item.appendChild(detail);
      });
      activity.appendChild(item);
    }

    function renderPresence(data) {
      var user = data && data.discord_user;
      if (!user || !user.id || !user.username) {
        throw new Error('La presencia no contiene los datos esperados del usuario.');
      }

      var presence = data.discord_status;
      var allowedStatuses = ['online', 'idle', 'dnd', 'offline'];
      var safeStatus = allowedStatuses.indexOf(presence) === -1 ? 'offline' : presence;
      if (status) status.textContent = statusText(safeStatus);
      if (indicator) indicator.className = 'discord-indicator ' + safeStatus;
      if (name) name.textContent = user.global_name || user.username;
      if (username) username.textContent = '@' + user.username;

      if (avatar && user.avatar) {
        var extension = user.avatar.indexOf('a_') === 0 ? 'gif' : 'png';
        avatar.src = 'https://cdn.discordapp.com/avatars/' +
          encodeURIComponent(user.id) + '/' + encodeURIComponent(user.avatar) +
          '.' + extension + '?size=128';
        avatar.alt = 'Avatar de Discord de ' + (user.global_name || user.username);
        avatar.hidden = false;
        if (fallback) fallback.hidden = true;
      } else {
        showFallback();
      }

      if (customStatus) {
        var customActivity = Array.isArray(data.activities) && data.activities.find(function (item) {
          return item.type === 4;
        });
        customStatus.replaceChildren();
        if (customActivity) {
          var emoji = customActivity.emoji;
          if (emoji && emoji.id) {
            var emojiImage = document.createElement('img');
            var emojiExtension = emoji.is_animated ? 'gif' : 'png';
            emojiImage.src = 'https://cdn.discordapp.com/emojis/' +
              encodeURIComponent(emoji.id) + '.' + emojiExtension + '?size=24';
            emojiImage.alt = emoji.name || '';
            emojiImage.width = 20;
            emojiImage.height = 20;
            customStatus.appendChild(emojiImage);
          } else if (emoji && emoji.name) {
            customStatus.appendChild(document.createTextNode(emoji.name + ' '));
          }
          if (customActivity.state) {
            customStatus.appendChild(document.createTextNode(customActivity.state));
          }
        }
      }

      if (activity) {
        activity.replaceChildren();
        var spotify = data.listening_to_spotify && data.spotify;
        if (spotify) {
          addActivity('Spotify', [
            spotify.song,
            spotify.artist && 'Artista: ' + spotify.artist,
            spotify.album && 'Álbum: ' + spotify.album
          ]);
        }

        (Array.isArray(data.activities) ? data.activities : []).forEach(function (item) {
          if (item.type === 4) return;
          if (spotify && item.name === 'Spotify') return;
          addActivity(item.name || 'Actividad', [item.details, item.state]);
        });

        if (!activity.childElementCount) {
          activity.textContent = 'Sin actividad ahora mismo.';
        }
      }

      if (devices) {
        var connectedDevices = [];
        if (data.active_on_discord_desktop) connectedDevices.push('Escritorio');
        if (data.active_on_discord_mobile) connectedDevices.push('Móvil');
        if (data.active_on_discord_web) connectedDevices.push('Web');
        if (data.active_on_discord_embedded) connectedDevices.push('Integrado');
        devices.textContent = connectedDevices.length
          ? 'Conectado desde: ' + connectedDevices.join(' · ')
          : '';
      }

      if (liveLabel) liveLabel.hidden = false;
      if (link) link.hidden = false;
    }

    function stopHeartbeat() {
      if (heartbeatTimer) {
        clearInterval(heartbeatTimer);
        heartbeatTimer = null;
      }
    }

    function scheduleReconnect() {
      if (stopped || reconnectTimer) return;
      if (status) status.textContent = 'Reconectando a Discord…';
      reconnectTimer = setTimeout(function () {
        reconnectTimer = null;
        connect();
      }, reconnectDelay);
      reconnectDelay = Math.min(reconnectDelay * 2, 30000);
    }

    function connect() {
      if (stopped) return;
      try {
        socket = new WebSocket('wss://api.lanyard.rest/socket');
      } catch (error) {
        console.error('No se pudo abrir la conexión en tiempo real de Discord:', error);
        scheduleReconnect();
        return;
      }

      socket.addEventListener('open', function () {
        if (status) status.textContent = 'Esperando presencia de Discord…';
      });

      socket.addEventListener('message', function (event) {
        var message;
        try {
          message = JSON.parse(event.data);
        } catch (error) {
          console.error('Lanyard envió un mensaje que no es JSON válido:', error);
          return;
        }

        if (message.op === 1) {
          var heartbeatInterval = message.d && message.d.heartbeat_interval;
          if (!Number.isFinite(heartbeatInterval) || heartbeatInterval <= 0) {
            console.error('Lanyard envió un intervalo de latido no válido.');
            socket.close();
            return;
          }
          socket.send(JSON.stringify({ op: 2, d: { subscribe_to_id: discordId } }));
          stopHeartbeat();
          heartbeatTimer = setInterval(function () {
            if (socket.readyState === WebSocket.OPEN) {
              socket.send(JSON.stringify({ op: 3 }));
            }
          }, heartbeatInterval);
          return;
        }

        if (message.op === 0 && message.d) {
          var presenceData = message.d;
          if (message.t === 'INIT_STATE' && !presenceData.discord_user) {
            presenceData = presenceData[discordId];
          }
          try {
            renderPresence(presenceData);
            receivedLiveUpdate = true;
            reconnectDelay = 1000;
          } catch (error) {
            console.error('No se pudo mostrar la presencia de Discord:', error);
            if (status) status.textContent = 'No se pudo leer la información de Discord.';
          }
        }
      });

      socket.addEventListener('error', function (error) {
        console.error('Falló la conexión en tiempo real con Lanyard:', error);
      });

      socket.addEventListener('close', function () {
        stopHeartbeat();
        scheduleReconnect();
      });
    }

    if (avatar) avatar.addEventListener('error', showFallback);
    fetch('https://api.lanyard.rest/v1/users/' + encodeURIComponent(discordId))
      .then(function (response) {
        if (!response.ok) throw new Error('Lanyard respondió con HTTP ' + response.status);
        return response.json();
      })
      .then(function (result) {
        if (!receivedLiveUpdate) renderPresence(result && result.data);
      })
      .catch(function (error) {
        console.error('No se pudo obtener el estado inicial de Discord:', error);
      });
    window.addEventListener('pagehide', function () {
      stopped = true;
      stopHeartbeat();
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (socket && socket.readyState < WebSocket.CLOSING) socket.close();
    }, { once: true });
    connect();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDiscordProfile, { once: true });
  } else {
    initDiscordProfile();
  }
})();
