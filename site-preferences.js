(function () {
  var translations = {
    'Saltar al contenido': 'Skip to content',
    'Duarte Jesús, inicio': 'Duarte Jesús, home',
    'Navegación principal': 'Main navigation',
    'Desplazarse al contenido': 'Scroll to content',
    'Datos sobre mí': 'Quick facts about me',
    'Tecnologías utilizadas': 'Technologies used',
    'Principal': 'Main',
    'Información del perfil': 'Profile information',
    'Preferencias de visualización': 'Display preferences',
    'Proyectos': 'Projects',
    'Sobre mí': 'About me',
    'Contacto': 'Contact',
    'Portafolio personal': 'Personal portfolio',
    'Portafolio': 'Portfolio',
    'APRENDIENDO · CONSTRUYENDO · ITERANDO': 'LEARNING · BUILDING · ITERATING',
    'Hola, soy': "Hi, I'm",
    'Estoy aprendiendo a crear tecnología útil, un proyecto a la vez.': "I'm learning to build useful technology, one project at a time.",
    'Explorar proyectos': 'Explore projects',
    'Un poco sobre mí': 'A little about me',
    'ESTUDIANTE & DESARROLLADOR JUNIOR': 'STUDENT & JUNIOR DEVELOPER',
    'DESLIZA PARA EXPLORAR': 'SCROLL TO EXPLORE',
    'QUIÉN SOY': 'WHO I AM',
    'Curiosidad primero.': 'Curiosity comes first.',
    'El código viene después.': 'The code comes next.',
    'Soy Duarte Jesús Alzamora Castro, estudiante de Colombia, desarrollador web en formación y moderador del staff de SuperCraft.': 'I am Duarte Jesús Alzamora Castro, a student from Colombia, an aspiring web developer, and a SuperCraft staff moderator.',
    'Aprendo creando cosas que puedo usar: desde una calculadora sencilla hasta una aplicación de finanzas con cuentas, usuarios y sincronización. Cada proyecto me deja nuevas preguntas y una razón para seguir mejorando.': 'I learn by building things I can use: from a simple calculator to a finance app with accounts, users, and data sync. Every project leaves me with new questions and a reason to keep improving.',
    'Conoce más de mi recorrido': 'Learn more about my journey',
    'País': 'Country',
    'Enfoque': 'Focus',
    'Comunidad': 'Community',
    'HECHO APRENDIENDO': 'BUILT WHILE LEARNING',
    'Ideas que pasaron de la cabeza': 'Ideas that moved from my mind',
    'a una pantalla.': 'onto a screen.',
    'PROYECTO PRINCIPAL': 'FEATURED PROJECT',
    'Aplicación de escritorio + API': 'Desktop app + API',
    'Una app para organizar cuentas, monedas y movimientos. La API permite sincronizar datos entre dispositivos e incluye inicio de sesión.': 'An app to organize accounts, currencies, and transactions. Its API syncs data across devices and includes sign-in.',
    'Ver código en GitHub': 'View source on GitHub',
    'PYTHON · PRIMEROS PASOS': 'PYTHON · FIRST STEPS',
    'Calculadora': 'Calculator',
    'básica': 'basics',
    'Un programa en Python para practicar las operaciones matemáticas esenciales.': 'A Python program for practicing essential math operations.',
    'Ejercicio de práctica en Python': 'Python practice exercise',
    'WEB · DISEÑO Y CÓDIGO': 'WEB · DESIGN & CODE',
    'Este': 'This',
    'portafolio': 'portfolio',
    'Una web personal hecha con HTML y CSS para compartir lo que voy creando.': 'A personal website built with HTML and CSS to share what I create.',
    'HERRAMIENTAS EN MI MOCHILA': 'TOOLS IN MY TOOLKIT',
    'Todavía aprendiendo.': 'Still learning.',
    'Siempre construyendo.': 'Always building.',
    'No pretendo saberlo todo. Estas son las herramientas que estoy usando y practicando en mis proyectos.': "I don't claim to know it all. These are the tools I'm using and practicing in my projects.",
    'Aplicaciones, lógica y automatización': 'Apps, logic, and automation',
    'EN PRÁCTICA': 'PRACTICING',
    'Estructura y diseño web': 'Web structure and design',
    'Herramientas que uso en mi gestor de finanzas': 'Tools used in my finance app',
    'PROYECTOS': 'PROJECTS',
    'Versionado y entorno de desarrollo': 'Version control and development environment',
    'FUERA DEL EDITOR': 'BEYOND THE EDITOR',
    'Lo que me': 'What',
    'mueve': 'drives me',
    'La programación es parte del camino, no el destino entero.': "Programming is part of the journey, not the whole destination.",
    'A / FORMACIÓN': 'A / EDUCATION',
    'Ingeniería de Sistemas': 'Systems Engineering',
    'Próximo ingreso a La Americana de Barranquilla. Por ahora sigo aprendiendo por mi cuenta, también con cursos en YouTube.': "I'm planning to study at La Americana in Barranquilla. For now, I keep learning on my own, including through YouTube courses.",
    'B / COMUNIDAD': 'B / COMMUNITY',
    'Moderador desde el 11 de abril de 2026. Me gusta aportar a las comunidades de las que formo parte.': 'A moderator since April 11, 2026. I enjoy contributing to the communities I am part of.',
    'Ver mi perfil de staff': 'View my staff profile',
    'C / CURIOSIDADES': 'C / A FEW MORE THINGS',
    'Minecraft, música y más': 'Minecraft, music, and more',
    'También disfruto las películas y series, y de vez en cuando, el fútbol.': 'I also enjoy movies and TV shows, and sometimes, football.',
    'EN EL HORIZONTE': 'ON THE HORIZON',
    'Seguir aprendiendo lenguajes': 'Keep learning languages',
    'mejorar mi inglés': 'Improve my English',
    'mucho por descubrir': 'Plenty left to discover',
    'HABLEMOS': "LET'S TALK",
    '¿Tienes una idea, una pregunta o solo quieres saludar?': 'Have an idea, a question, or just want to say hello?',
    'El siguiente': 'The next',
    'mensaje puede': 'message could',
    'ser tuyo': 'be yours',
    'Tu nombre': 'Your name',
    '(opcional)': '(optional)',
    '¿Cómo te llamas?': 'What should I call you?',
    'Escribe aquí lo que quieras contarme…': "Write whatever you'd like to tell me…",
    'Tu mensaje': 'Your message',
    'Deja este campo vacío': 'Leave this field empty',
    'Enviar mensaje': 'Send message',
    'No necesitas correo ni cuenta.': 'No email or account needed.',
    '¿Necesitas soporte en Discord?': 'Need support on Discord?',
    'Resume el motivo del ticket': 'Briefly describe what you need help with',
    'Abrir ticket privado': 'Open a private ticket',
    'Inicia sesión con Discord. Debes ser miembro del servidor para acceder a tu canal privado.': 'Sign in with Discord. You must be a member of the server to access your private channel.',
    '¿Prefieres el correo?': 'Prefer email?',
    'ENCUÉNTRAME TAMBIÉN EN': 'FIND ME ALSO ON',
    'Hecho con curiosidad en Colombia': 'Made with curiosity in Colombia',
    'Privacidad': 'Privacy',
    'Volver arriba ↑': 'Back to top ↑',
    'Experiencia': 'Experience',
    'Enlaces': 'Links',
    'Ver mi portafolio': 'View my portfolio',
    'COMUNIDAD · SUPERCRAFT': 'COMMUNITY · SUPERCRAFT',
    'Moderador de SuperCraft.': 'SuperCraft moderator.',
    'STAFF DE SUPERCRAFT': 'SUPERCRAFT STAFF',
    'MODERADOR · COLOMBIA': 'MODERATOR · COLOMBIA',
    'Rol': 'Role',
    'Moderador': 'Moderator',
    'Moderador desde': 'Moderator since',
    'En el staff desde': 'Staff member since',
    'Ubicación': 'Location',
    'Sobre mí en SuperCraft': 'About me at SuperCraft',
    'Soy Duarte, moderador del staff de SuperCraft.': 'I am Duarte, a moderator on the SuperCraft staff team.',
    'Entré al staff por primera vez el 10 de diciembre de 2023. Desde el 11 de abril de 2026 estoy de nuevo en el equipo como moderador. Fuera de la comunidad estudio programación y construyo proyectos con Python, HTML y CSS; los puedes ver en mi portafolio.': 'I first joined the staff team on December 10, 2023. Since April 11, 2026, I have been back on the team as a moderator. Outside the community, I study programming and build projects with Python, HTML, and CSS; you can see them in my portfolio.',
    'Experiencia en la comunidad': 'Community experience',
    'Staff de SuperCraft': 'SuperCraft staff',
    'Desde el 11 de abril de 2026': 'Since April 11, 2026',
    'Primer ingreso al staff': 'First joined the staff team',
    'Encuéntrame en': 'Find me on',
    'Comunidad y redes': 'Community and social media',
    'Página de SuperCraft': 'SuperCraft website',
    'Discord de SuperCraft': 'SuperCraft Discord',
    'Perfil en NameMC': 'NameMC profile',
    'Portafolio de programador': 'Developer portfolio',
    'Mi usuario de Discord:': 'My Discord username:',
    'Copiar usuario': 'Copy username',
    'Perfil de staff de Duarte · SuperCraft · 2026': 'Duarte’s SuperCraft staff profile · 2026',
    'Volver arriba': 'Back to top',
    'Página personal. No es el sitio oficial de SuperCraft.': 'Personal page. This is not the official SuperCraft website.',
    'TRANSPARENCIA · DATOS Y PRIVACIDAD': 'TRANSPARENCY · DATA & PRIVACY',
    'Aviso de privacidad': 'Privacy notice',
    'Última actualización: octubre de 2026.': 'Last updated: October 2026.',
    'Quién es el responsable': 'Who is responsible',
    'Este sitio es personal y lo administra Duarte, desde Colombia. Para cualquier consulta sobre tus datos, escríbeme desde la sección de contacto de mi portafolio:': 'This personal website is managed by Duarte from Colombia. For questions about your data, contact me through the contact section of my portfolio:',
    'Qué datos recojo': 'What data I collect',
    'El formulario permite enviar un mensaje sin correo ni cuenta. El nombre es opcional; no se solicita ni se almacena el correo de quien escribe. Los mensajes se guardan en Supabase hasta que Duarte los elimine desde la dashboard privada.': 'The form lets you send a message without an email address or account. A name is optional; the sender’s email is neither requested nor stored. Messages are stored in Supabase until Duarte deletes them from the private dashboard.',
    'El formulario permite enviar un mensaje sin correo ni cuenta. El nombre es opcional; no se solicita ni se almacena el correo de quien escribe. Los mensajes se guardan en Supabase hasta que Duarte los elimine desde la dashboard privada. La preferencia de idioma y tema se guarda solo en el almacenamiento local de tu navegador y no se envía al servidor.': 'The form lets you send a message without an email address or account. A name is optional; the sender’s email is neither requested nor stored. Messages are stored in Supabase until Duarte deletes them from the private dashboard. Your language and theme preferences are saved only in your browser’s local storage and are not sent to the server.',
    'Dónde está alojado': 'Where the site is hosted',
    'El sitio se publica con GitHub Pages y usa Supabase para el formulario, la autenticación de la dashboard y las métricas agregadas. La biblioteca de Supabase se carga desde jsDelivr. GitHub, Supabase y jsDelivr pueden procesar datos técnicos de conexión según sus propias políticas; la aplicación no guarda direcciones IP, user agents ni referentes de visita.': 'The site is hosted on GitHub Pages and uses Supabase for the contact form, dashboard authentication, and aggregated metrics. The Supabase library is loaded from jsDelivr. GitHub, Supabase, and jsDelivr may process technical connection data under their own policies; this application does not store IP addresses, user agents, or visit referrers.',
    'Métricas de visitas': 'Visit metrics',
    'Para contar vistas y sesiones activas se crea un identificador aleatorio temporal en el almacenamiento de sesión del navegador. No se usa para conocer tu identidad. Los identificadores de sesiones inactivas se eliminan cuando llega una nueva visita después de 30 días; los totales diarios agregados se conservan para mostrar el historial. El contador no recopila nombres, IP, user agents ni las páginas de referencia.': 'A temporary random identifier is stored in the browser session to count page views and active sessions. It is not used to identify you. Inactive session identifiers are deleted when a new visit arrives after 30 days; aggregated daily totals are kept to show history. The counter does not collect names, IP addresses, user agents, or referring pages.',
    'Mensajes': 'Messages',
    'Los mensajes y, si decides proporcionarlo, tu nombre se muestran únicamente en una dashboard protegida para Duarte. No incluyas información sensible en el formulario. Puedes solicitar la eliminación de un mensaje desde el contacto del portafolio.': 'Messages and, if you choose to provide it, your name are only shown in a dashboard protected for Duarte. Do not include sensitive information in the form. You can request that a message be deleted through the portfolio contact form.',
    'Enlaces a otros sitios': 'Links to other sites',
    'Este sitio enlaza a redes y servicios externos, como GitHub, Instagram, TikTok, YouTube, Discord, NameMC y SuperCraft. Supabase también presta servicios de base de datos y autenticación. Cada proveedor tiene sus propias políticas de privacidad, que se aplican al usar sus servicios.': 'This site links to external networks and services such as GitHub, Instagram, TikTok, YouTube, Discord, NameMC, and SuperCraft. Supabase also provides database and authentication services. Each provider has its own privacy policies, which apply when you use its services.',
    'Tus derechos': 'Your rights',
    'Según la Ley 1581 de 2012 de Colombia, puedes conocer, actualizar y rectificar tus datos personales, y pedir que se eliminen. Si me escribiste y quieres ejercer alguno de estos derechos, contáctame por el enlace de arriba.': 'Under Colombia’s Law 1581 of 2012, you may access, update, and correct your personal data, and request its deletion. If you wrote to me and want to exercise any of these rights, contact me using the link above.',
    'Cambios': 'Changes',
    'Si cambia el tipo de información recogida o la forma de usarla, actualizaré este aviso.': 'If the type of information collected or how it is used changes, I will update this notice.',
    'Ninguno de forma directa. Este sitio no tiene formularios, cuentas de usuario, comentarios, publicidad ni herramientas de analítica, y no instala cookies. Tampoco carga fuentes, scripts ni imágenes de terceros.': 'None directly. This site has no forms, user accounts, comments, advertising, or analytics tools, and it does not set cookies. It also does not load third-party fonts, scripts, or images.',
    'Ninguno de forma directa. Este sitio no tiene formularios, cuentas de usuario, comentarios, publicidad ni herramientas de analítica, y no instala cookies. Guarda tu preferencia de idioma y tema solo en el almacenamiento local de tu navegador; esa preferencia no se envía al servidor. Tampoco carga fuentes, scripts ni imágenes de terceros.': 'None directly. This site has no forms, user accounts, comments, advertising, or analytics tools, and it does not set cookies. Your language and theme preferences are saved only in your browser’s local storage and are not sent to the server. The site also does not load third-party fonts, scripts, or images.',
    'El sitio se publica con GitHub Pages. GitHub puede registrar datos técnicos de las visitas, como la dirección IP, según su propia política de privacidad. Yo no tengo acceso a esos registros.': 'The site is hosted on GitHub Pages. GitHub may record technical visit data, such as IP addresses, under its own privacy policy. I do not have access to those records.',
    'Si me escribes': 'If you contact me',
    'Si me envías un correo o un mensaje, usaré tus datos solo para responderte. No los comparto ni los vendo.': 'If you email or message me, I will use your information only to reply. I do not share or sell it.',
    'Este sitio enlaza a redes y servicios externos, como GitHub, Instagram, TikTok, YouTube, Discord, NameMC y SuperCraft. Cada uno tiene sus propias políticas de privacidad y de cookies, que se aplican cuando entras en ellos.': 'This site links to external networks and services such as GitHub, Instagram, TikTok, YouTube, Discord, NameMC, and SuperCraft. Each has its own privacy and cookie policies, which apply when you visit them.',
    'Sobre este sitio': 'About this site',
    'Esta es una página personal. No es el sitio oficial de SuperCraft ni habla en su nombre. La comunidad oficial está en': 'This is a personal page. It is not the official SuperCraft website and does not speak on its behalf. The official community is at',
    'Si algún día añado herramientas que usen cookies o recojan datos, actualizaré este aviso antes de usarlas.': 'If I ever add tools that use cookies or collect data, I will update this notice before using them.',
    'TRANSPARENCIA · DATOS Y PRIVACIDAD': 'TRANSPARENCY · DATA & PRIVACY',
    'Volver al inicio': 'Back to home',
    'Cerrar sesión': 'Sign out',
    'Desde el': 'Since',
    'Aviso de privacidad · 2026': 'Privacy notice · 2026',
    'RUTA FUERA DE MAPA': 'OFF THE MAP',
    'No encontramos esa página.': "We couldn't find that page.",
    'La dirección que buscas no existe o cambió de lugar. Puedes volver al portafolio o seguir explorando.': 'The address you are looking for does not exist or has moved. You can return to the portfolio or keep exploring.',
    'Opciones de navegación': 'Navigation options',
    'Perfil de staff': 'Staff profile',
    'PANEL PRIVADO': 'PRIVATE DASHBOARD',
    'Hola, Duarte.': 'Hi, Duarte.',
    'Inicia sesión con el correo autorizado. Te enviaré un enlace de acceso; no necesitas contraseña.': "Sign in with the authorized email address. I'll send you a sign-in link; no password is needed.",
    'Tu correo': 'Your email',
    'Enviar enlace de acceso': 'Send sign-in link',
    'RESUMEN DEL SITIO': 'SITE OVERVIEW',
    'Actividad': 'Activity',
    'Actualizar': 'Refresh',
    'VISITANTES AHORA': 'VISITORS NOW',
    'Sesiones activas en tiempo real': 'Active sessions in real time',
    'VISTAS TOTALES': 'TOTAL VIEWS',
    'Desde que se active el contador': 'Since the counter was enabled',
    'SESIONES ANÓNIMAS': 'ANONYMOUS SESSIONS',
    'Estimación por pestaña y día': 'Estimate per tab and day',
    'Buzón': 'Inbox',
    'Los nombres son opcionales. No se pide ni se almacena el correo de quien escribe.': 'Names are optional. The sender’s email is neither requested nor stored.',
    'Cargando mensajes…': 'Loading messages…',
    'Las métricas no incluyen nombres ni direcciones IP. Las sesiones se cuentan de forma aproximada; no representan personas identificadas.': 'Metrics do not include names or IP addresses. Sessions are approximate and do not represent identified people.',
    'No se pudo cargar el servicio de mensajes. Inténtalo más tarde.': 'The messaging service could not be loaded. Please try again later.',
    'El formulario estará disponible pronto.': 'The form will be available soon.',
    'El servicio de mensajes necesita configuración. Avísame por correo para revisarlo.': 'The messaging service needs configuration. Email me so I can look into it.',
    'El servicio rechazó el mensaje. Avísame por correo para revisarlo.': 'The service rejected the message. Email me so I can look into it.',
    'No se pudo enviar. Inténtalo de nuevo o escríbeme por correo.': "Couldn't send your message. Try again or email me.",
    'Espera un minuto antes de enviar otro mensaje.': 'Please wait a minute before sending another message.',
    'Escribe un mensaje de hasta 2000 caracteres.': 'Please write a message of up to 2,000 characters.',
    'Enviando…': 'Sending…',
    '¡Mensaje enviado! Gracias por escribirme.': 'Message sent! Thanks for reaching out.',
    'No se pudo enviar. Comprueba tu conexión e inténtalo de nuevo.': "Couldn't send your message. Check your connection and try again.",
    'No se pudo cargar el servicio de acceso. Inténtalo más tarde.': 'The sign-in service could not be loaded. Please try again later.',
    'La dashboard estará disponible cuando se conecte Supabase.': 'The dashboard will be available once Supabase is connected.',
    'Todavía no hay mensajes.': 'There are no messages yet.',
    'Sin nombre': 'No name',
    'Marcar como leído': 'Mark as read',
    'Eliminar': 'Delete',
    '¿Eliminar este mensaje? Esta acción no se puede deshacer.': 'Delete this message? This action cannot be undone.',
    'No se pudo actualizar el mensaje.': "Couldn't update the message.",
    'Mensaje actualizado.': 'Message updated.',
    'No se pudo eliminar el mensaje.': "Couldn't delete the message.",
    'Mensaje eliminado.': 'Message deleted.',
    'Actualizando…': 'Updating…',
    'Datos actualizados.': 'Data updated.',
    'No se pudieron cargar los datos. Revisa la conexión y la configuración de Supabase.': "Couldn't load the data. Check your connection and Supabase configuration.",
    'No se pudieron actualizar los mensajes en vivo.': "Couldn't update live messages.",
    'Enviando enlace…': 'Sending sign-in link…',
    'No se pudo enviar el enlace. Comprueba el correo autorizado y la configuración.': "Couldn't send the link. Check the authorized email address and configuration.",
    'Si el correo está autorizado, recibirás un enlace de acceso.': 'If the email address is authorized, you will receive a sign-in link.',
    'No se pudo enviar el enlace. Comprueba tu conexión e inténtalo de nuevo.': "Couldn't send the link. Check your connection and try again.",
    'No se pudo cerrar la sesión.': "Couldn't sign out.",
    'No se pudo cerrar la sesión. Inténtalo de nuevo.': "Couldn't sign out. Please try again.",
    'No se pudo comprobar la sesión. Recarga e inténtalo de nuevo.': "Couldn't check your session. Reload and try again.",
    'Usuario copiado.': 'Username copied.',
    'Mi usuario es Duaartee_': 'My username is Duaartee_',
    '10 de diciembre de 2023': 'December 10, 2023',
    '11 de abril de 2026': 'April 11, 2026'
  };

  var titles = {
    '/': ['Duarte Jesús Alzamora Castro | Desarrollador web junior', 'Duarte Jesús Alzamora Castro | Junior Web Developer'],
    '/index.html': ['Duarte Jesús Alzamora Castro | Desarrollador web junior', 'Duarte Jesús Alzamora Castro | Junior Web Developer'],
    '/staff/': ['Duarte Jesús Alzamora Castro | Moderador de SuperCraft', 'Duarte Jesús Alzamora Castro | SuperCraft Moderator'],
    '/staff/index.html': ['Duarte Jesús Alzamora Castro | Moderador de SuperCraft', 'Duarte Jesús Alzamora Castro | SuperCraft Moderator'],
    '/privacidad.html': ['Aviso de privacidad | Duarte', 'Privacy notice | Duarte'],
    '/staff/privacidad.html': ['Aviso de privacidad | Duarte · Staff de SuperCraft', 'Privacy notice | Duarte · SuperCraft Staff'],
    '/404.html': ['Página no encontrada | Duarte', 'Page not found | Duarte'],
    '/dashboard/': ['Dashboard privada | Duarte', 'Private dashboard | Duarte'],
    '/dashboard/index.html': ['Dashboard privada | Duarte', 'Private dashboard | Duarte']
  };

  var descriptions = {
    '/': [
      'Portafolio de Duarte Jesús Alzamora Castro, estudiante y desarrollador web junior en Colombia. Proyectos con Python y tecnologías web.',
      'Portfolio of Duarte Jesús Alzamora Castro, a student and junior web developer in Colombia. Projects with Python and web technologies.'
    ],
    '/index.html': [
      'Portafolio de Duarte Jesús Alzamora Castro, estudiante y desarrollador web junior en Colombia. Proyectos con Python y tecnologías web.',
      'Portfolio of Duarte Jesús Alzamora Castro, a student and junior web developer in Colombia. Projects with Python and web technologies.'
    ],
    '/staff/': [
      'Perfil de Duarte Jesús Alzamora Castro, moderador del staff de SuperCraft desde abril de 2026.',
      'Profile of Duarte Jesús Alzamora Castro, a SuperCraft staff moderator since April 2026.'
    ],
    '/staff/index.html': [
      'Perfil de Duarte Jesús Alzamora Castro, moderador del staff de SuperCraft desde abril de 2026.',
      'Profile of Duarte Jesús Alzamora Castro, a SuperCraft staff moderator since April 2026.'
    ],
    '/privacidad.html': [
      'Aviso de privacidad del portafolio de Duarte: datos que se recogen y cómo ejercer tus derechos.',
      'Privacy notice for Duarte’s portfolio: data collected and how to exercise your rights.'
    ],
    '/staff/privacidad.html': [
      'Aviso de privacidad del perfil personal de Duarte: información recogida y derechos de privacidad.',
      'Privacy notice for Duarte’s personal profile: information collected and your privacy rights.'
    ],
    '/404.html': [
      'La página que buscas no está disponible. Vuelve al portafolio de Duarte o explora sus proyectos.',
      'The page you are looking for is unavailable. Return to Duarte’s portfolio or explore his projects.'
    ]
  };

  function readPreference(key) {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn('No se pudo leer la preferencia local:', error);
      return null;
    }
  }

  function savePreference(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn('No se pudo guardar la preferencia local:', error);
      return;
    }
  }

  var savedLanguage = readPreference('duarte-language');
  var language = savedLanguage === 'en' || savedLanguage === 'es'
    ? savedLanguage
    : (navigator.language && navigator.language.toLowerCase().indexOf('en') === 0 ? 'en' : 'es');
  var savedTheme = readPreference('duarte-theme');
  var theme = savedTheme === 'light' || savedTheme === 'dark'
    ? savedTheme
    : (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  var originalText = new WeakMap();
  var englishToSpanish = {};
  Object.keys(translations).forEach(function (spanish) {
    englishToSpanish[translations[spanish]] = spanish;
  });
  document.documentElement.dataset.theme = theme;
  document.documentElement.lang = language;

  function sourceText(node) {
    if (originalText.has(node)) return originalText.get(node);
    var current = node.nodeValue.trim();
    if (language === 'en' && englishToSpanish[current]) current = englishToSpanish[current];
    originalText.set(node, current);
    return current;
  }

  function applyLanguage(nextLanguage) {
    language = nextLanguage;
    document.documentElement.lang = language;
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        return node.parentElement && !node.parentElement.closest('script, style, noscript, .site-controls')
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      }
    });
    var node;
    while ((node = walker.nextNode())) {
      var original = sourceText(node);
      var translated = language === 'en' ? translations[original] : original;
      if (translated) node.nodeValue = node.nodeValue.replace(node.nodeValue.trim(), translated);
    }

    document.querySelectorAll('[placeholder]').forEach(function (element) {
      var value = element.getAttribute('placeholder');
      if (language === 'en' && translations[value]) element.setAttribute('placeholder', translations[value]);
      else if (language === 'es' && englishToSpanish[value]) element.setAttribute('placeholder', englishToSpanish[value]);
    });
    document.querySelectorAll('[aria-label], [title]').forEach(function (element) {
      ['aria-label', 'title'].forEach(function (attribute) {
        var value = element.getAttribute(attribute);
        if (language === 'en' && translations[value]) element.setAttribute(attribute, translations[value]);
        else if (language === 'es' && englishToSpanish[value]) element.setAttribute(attribute, englishToSpanish[value]);
      });
    });

    var pagePath = window.location.pathname;
    var titleEntry = titles[pagePath];
    var descriptionEntry = descriptions[pagePath];
    if (!titleEntry && pagePath.endsWith('/staff/index.html')) {
      titleEntry = titles['/staff/'];
      descriptionEntry = descriptions['/staff/'];
    } else if (!titleEntry && pagePath.endsWith('/staff/privacidad.html')) {
      titleEntry = titles['/staff/privacidad.html'];
      descriptionEntry = descriptions['/staff/privacidad.html'];
    } else if (!titleEntry && pagePath.endsWith('/dashboard/index.html')) {
      titleEntry = titles['/dashboard/index.html'];
    } else if (!titleEntry && pagePath.endsWith('/privacidad.html')) {
      titleEntry = titles['/privacidad.html'];
      descriptionEntry = descriptions['/privacidad.html'];
    } else if (!titleEntry && pagePath.endsWith('/404.html')) {
      titleEntry = titles['/404.html'];
      descriptionEntry = descriptions['/404.html'];
    }
    titleEntry = titleEntry || titles['/'];
    if (!descriptionEntry && (pagePath === '/' || pagePath.endsWith('/index.html'))) {
      descriptionEntry = descriptions['/'];
    }
    document.title = titleEntry[language === 'en' ? 1 : 0];
    var description = document.querySelector('meta[name="description"]');
    if (description && descriptionEntry) description.setAttribute('content', descriptionEntry[language === 'en' ? 1 : 0]);
    var ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', document.title);
    var ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription && description) ogDescription.setAttribute('content', description.content);
    var twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute('content', document.title);
    var twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription && description) twitterDescription.setAttribute('content', description.content);
    var ogLocale = document.querySelector('meta[property="og:locale"]');
    if (ogLocale) ogLocale.setAttribute('content', language === 'en' ? 'en_US' : 'es_CO');

    var languageButton = document.querySelector('.site-language');
    var controls = document.querySelector('.site-controls');
    if (controls) controls.setAttribute('aria-label', language === 'es' ? 'Preferencias de visualización' : 'Display preferences');
    if (languageButton) {
      languageButton.textContent = language === 'es' ? 'EN' : 'ES';
      languageButton.setAttribute('aria-label', language === 'es' ? 'Cambiar idioma a inglés' : 'Switch language to Spanish');
      languageButton.title = languageButton.getAttribute('aria-label');
    }
    var themeButton = document.querySelector('.site-theme');
    if (themeButton) {
      var themeLabel = theme === 'dark'
        ? (language === 'es' ? 'Cambiar a modo claro' : 'Switch to light mode')
        : (language === 'es' ? 'Cambiar a modo oscuro' : 'Switch to dark mode');
      themeButton.setAttribute('aria-label', themeLabel);
      themeButton.title = themeLabel;
    }
    document.dispatchEvent(new CustomEvent('site-language-change', { detail: { language: language } }));
  }

  function applyTheme(nextTheme) {
    theme = nextTheme;
    document.documentElement.dataset.theme = theme;
    var themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.setAttribute('content', theme === 'dark' ? '#050a12' : '#f4f8ff');
    var button = document.querySelector('.site-theme');
    if (button) {
      button.textContent = theme === 'dark' ? '☼' : '☾';
      var themeLabel = theme === 'dark'
        ? (language === 'es' ? 'Cambiar a modo claro' : 'Switch to light mode')
        : (language === 'es' ? 'Cambiar a modo oscuro' : 'Switch to dark mode');
      button.setAttribute('aria-label', themeLabel);
      button.title = button.getAttribute('aria-label');
      button.setAttribute('aria-pressed', String(theme === 'light'));
    }
    document.dispatchEvent(new CustomEvent('site-theme-change', { detail: { theme: theme } }));
  }

  function addControls() {
    var host = document.querySelector('.nav, .panel-cabecera');
    if (!host) return;
    var controls = document.createElement('div');
    controls.className = 'site-controls';
    controls.setAttribute('aria-label', 'Display preferences');

    var languageButton = document.createElement('button');
    languageButton.type = 'button';
    languageButton.className = 'site-control site-language';
    languageButton.addEventListener('click', function () {
      var nextLanguage = language === 'es' ? 'en' : 'es';
      savePreference('duarte-language', nextLanguage);
      applyLanguage(nextLanguage);
    });

    var themeButton = document.createElement('button');
    themeButton.type = 'button';
    themeButton.className = 'site-control site-theme';
    themeButton.addEventListener('click', function () {
      var nextTheme = theme === 'dark' ? 'light' : 'dark';
      savePreference('duarte-theme', nextTheme);
      applyTheme(nextTheme);
    });

    controls.append(languageButton, themeButton);
    host.appendChild(controls);
    applyTheme(theme);
    applyLanguage(language);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', addControls, { once: true });
  else addControls();

  window.SitePreferences = {
    getLanguage: function () { return language; },
    text: function (spanish) { return language === 'en' ? (translations[spanish] || spanish) : spanish; }
  };
})();
