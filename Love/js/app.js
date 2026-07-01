(function () {
  'use strict';

  /* ===== Music & Ship assets ===== */
  const BG_AUDIO_SRC = 'J�sean Log - Beso (Audio Oficial).MP3';
  const MUSIC_FILES = [
    'Beso_JoseLog_music.jpg',
    'ExistForLove_Aurora_music.jpg',
    'InsideYourHeart_vivoMovie_music.jpg',
    'lovelikeyou-StevenUniverse_music.jpg',
    'PielCanela_Cuco_music.jpg',
    'Talia_rideTheCyclone_music.jpg'
  ];

  const SHIP_FILES = [
    'checkmate.ship.jpg',
    'ErrorInk.ship.jpg',
    'Ivantill.ship.jpg',
    'Princesa dulce y Marceline.ship.jpg',
    'Rogue and Gambit.ship.jpg',
    'slimeknight.ship.jpg',
    'SuperBat.ship.jpg',
    'TordTom.Ship.jpg'
  ];

  const PROGRESS_VALUES = [28, 45, 62, 18, 51, 37];

  /* ===== Modal content ===== */
  const MODALS = {
    carta: {
      title: 'Gracias por dejarme amarte',
      render: renderLetter
    },
    cosas: {
      title: 'Las cosas que amo de ti',
      render: renderAmoList
    },
    canciones: {
      title: 'Canciones que te dedico',
      render: renderPlaylist
    },
    recuerdos: {
      title: 'Lo que me recuerda a ti',
      render: renderMemoryGarden
    },
    momentos: {
      title: 'Los momentos que hemos vivido que amo',
      render: renderTimeline
    },
    ships: {
      title: 'Parejas/ships que me recuerdan a nosotros',
      render: renderShips
    }
  };

  /* ===== DOM refs ===== */
  const overlay = document.getElementById('modalOverlay');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const closeBtn = document.getElementById('modalClose');
  const bgAudio = document.getElementById('bgAudio');
  const audioToggle = document.getElementById('audioToggle');
  const heartBurstBtn = document.getElementById('heartBurst');
  let audioReady = false;

  /* ===== Particles ===== */
  function initParticles() {
    const container = document.getElementById('particles');
    const count = window.innerWidth < 768 ? 45 : 75;

    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      const isHeart = Math.random() < 0.45;
      p.className = isHeart ? 'particle particle--heart' : 'particle';
      if (isHeart) p.textContent = '♥';
      p.style.left = Math.random() * 100 + '%';
      p.style.animationDuration = (isHeart ? 10 : 8) + Math.random() * 14 + 's';
      p.style.animationDelay = Math.random() * 10 + 's';
      const size = 2 + Math.random() * 3;
      if (!isHeart) {
        p.style.width = size + 'px';
        p.style.height = size + 'px';
      } else {
        p.style.fontSize = 10 + Math.random() * 10 + 'px';
      }
      container.appendChild(p);
    }
  }

  /* ===== Modal logic ===== */
  function openModal(key) {
    const config = MODALS[key];
    if (!config) return;

    modalTitle.textContent = config.title;
    modalBody.innerHTML = '';
    modalBody.appendChild(config.render());

    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  /* ===== Background audio (starts on first interaction) ===== */
  function syncAudioButton() {
    const playing = bgAudio && !bgAudio.paused;
    if (!audioToggle) return;
    audioToggle.setAttribute('aria-pressed', playing ? 'true' : 'false');
    audioToggle.setAttribute('aria-label', playing ? 'Pausar música de fondo' : 'Activar música de fondo');
    audioToggle.classList.toggle('is-on', playing);
  }

  async function ensureAudioLoaded() {
    if (!bgAudio) return false;
    if (!audioReady) {
      bgAudio.src = BG_AUDIO_SRC;
      bgAudio.volume = 0.35;
      audioReady = true;
    }
    return true;
  }

  async function tryStartAudio() {
    if (!bgAudio) return;
    await ensureAudioLoaded();

    try {
      bgAudio.muted = false;
      await bgAudio.play();
    } catch (_) {
      // If autoplay-with-sound is blocked, fall back to muted autoplay.
      try {
        bgAudio.muted = true;
        await bgAudio.play();
      } catch (_) {
        // Still blocked; will retry on first user gesture.
      }
    } finally {
      syncAudioButton();
    }
  }

  // Try to start on load (may be blocked), and guarantee retry on first user gesture.
  window.addEventListener('load', function () {
    tryStartAudio();
  });

  document.addEventListener(
    'pointerdown',
    function () {
      tryStartAudio();
    },
    { once: true }
  );

  if (audioToggle && bgAudio) {
    audioToggle.addEventListener('click', async function () {
      await ensureAudioLoaded();

      if (!bgAudio.paused) {
        bgAudio.pause();
        syncAudioButton();
        return;
      }

      // If it was playing muted (autoplay fallback), clicking enables sound too.
      bgAudio.muted = false;
      await tryStartAudio();
    });

    bgAudio.addEventListener('play', syncAudioButton);
    bgAudio.addEventListener('pause', syncAudioButton);
  }

  document.querySelectorAll('.nav-menu__btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      tryStartAudio();
      openModal(btn.dataset.modal);
    });
  });

  closeBtn.addEventListener('click', closeModal);

  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeModal();
    }
  });

  /* ===== Romantic burst hearts ===== */
  function burstHearts(originEl) {
    const amount = 44;

    for (let i = 0; i < amount; i++) {
      const h = document.createElement('span');
      h.className = 'burst-heart';
      h.textContent = Math.random() < 0.15 ? '♡' : '♥';

      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      const dx = (Math.random() - 0.5) * 360;
      const dy = -40 - Math.random() * 520;
      const size = 12 + Math.random() * 22;
      const rot = (Math.random() - 0.5) * 30;
      const dur = 1.8 + Math.random() * 1.1;

      h.style.setProperty('--x', x + 'px');
      h.style.setProperty('--y', y + 'px');
      h.style.setProperty('--dx', dx.toFixed(1) + 'px');
      h.style.setProperty('--dy', dy.toFixed(1) + 'px');
      h.style.setProperty('--size', size.toFixed(0) + 'px');
      h.style.setProperty('--rot', rot.toFixed(1) + 'deg');
      h.style.setProperty('--dur', dur.toFixed(2) + 's');

      document.body.appendChild(h);
      window.setTimeout(function () {
        h.remove();
      }, Math.ceil(dur * 1000) + 200);
    }
  }

  if (heartBurstBtn) {
    heartBurstBtn.addEventListener('click', function () {
      burstHearts(heartBurstBtn);
    });
  }

  function highlightTeAmoHTML(html) {
    return html.replace(/te amo/gi, function (match) {
      return '<span class="te-amo">' + match + '</span>';
    });
  }

  /* ===== Render: Letter ===== */
  function renderLetter() {
    const wrap = document.createElement('div');
    wrap.className = 'letter';

    const decor1 = document.createElement('span');
    decor1.className = 'letter__decor letter__decor--tl';
    decor1.textContent = '✿';
    wrap.appendChild(decor1);

    const decor2 = document.createElement('span');
    decor2.className = 'letter__decor letter__decor--br';
    decor2.textContent = '❀';
    wrap.appendChild(decor2);

    const text = document.createElement('div');
    text.className = 'letter__text';
    text.innerHTML = highlightTeAmoHTML(`
<p>Mi querido amor, a veces suelo ser alguien que no demuestra tanto cariño pero en esta pagina creada exclusivamente para ti quiero poner mi alma, mi pensamiento, mi amor y toda mi pasión solo para demostrarte lo que a mi parecer todo este tiempo no te he dado.</p>

<p>Aquí y ahora decido darte mi corazón, darte de él lo que alguna vez pudiste desear en tu soledad, mi corazon por ti late como si mi vida fuera a terminar si te vas. el corazon late la vida del cuerpo, la sangre, por ende al entregarte mi corazón te entrego mi vida, mi esperanza, mi pasión y mi confianza pues solo tu eres capaz de detener este latido por ti incluso si yo deseo quedarme contigo hasta el final de los tiempos.</p>

<p>Mi querida novia, el amor que tanto anhele y desee, la luz que ilumina mis días de oscuridad y aburrimiento, la persona por la cual daría todo para volverla a ver incluso si pasaran siglos. tu, mi amor, quiero hacerte el amor que te tengo, incluso con todos los errores que alguna vez cometistes que te hacen sentir que tui alma ya no tiene salvación, tu mi hermosa flor, la persona mas hermosa que que alguna vez conoceré…te amo, me enamoraría de ti una, y otra y otra vez, no me importa cuando y donde pues amarte es una de las alegrías que la vida pudo darme, tu sola luz en mi alma me hace querer amarte hasta el final de mis días.</p>

<p>pongo mis sentimientos, lágrimas y amor en esta carta, se que realmente no expresa lo que realmente quiero decirte pero quiero que sepas todo el amor que te tengo.</p>

<p>existo por ti, por tu amor..eres la persona más importante en mi vida, a quien mas amo, con quien quiero pasar el resto de mis días, mi orgullo mas grande. No importa si eres exagerado, depresivo,ansioso o si tienes heridas del pasado que aún duelen, yo te amo a ti y esos defectos pues son parte de ti, parte de tu ser y sabes que yo amo todo de ti. amo tu risa, tus ojos, tu forma con la que expresas conmigo, tu forma de demostrar amor, tu humor y el hecho de que me aguantas JAJSJ, eres el tesoro más grande que tengo en mi vida.</p>`);

    const sign = document.createElement('p');
    sign.className = 'letter__sign';
    sign.innerHTML = '<span class="te-amo">te amo</span>.';
    text.appendChild(sign);

    wrap.appendChild(text);
    return wrap;
  }

  /* ===== Render: Amo list ===== */
  function renderAmoList() {
    const items = [
      'Tu risa',
      'tus ojos',
      'tu cabello',
      'tu humor',
      'como te expresas',
      'tu estilo',
      'como cuentas tus historias',
      'tu voz (incluso estando enferma)',
      'tu personalidad',
      'tu empatía',
      'lo bella que eres',
      'el bullying cariñoso q me haces',
      'tu forma de decirme amor,cariño, etc',
      'que sigas adelante',
      'tus metas y sueños',
      'tu coraje',
      'tu gusto por la música',
      'el amor que tienes por los videojuegos',
      'las reacciones que tienes',
      'tu sonambulismo',
      'la forma en la que te expresas cuando algo te gusta',
      'la confianza que tienes',
      'lo orgulloso que eres a veces',
      'que me cuentes tu dia con emociones fuertes',
      'cuando me mandas fotos de tu cara',
      'cuando me mandas foto de albóndiga (me la voy a robar)'
    ];

    const card = document.createElement('div');
    card.className = 'amo-list';

    const ul = document.createElement('ul');
    items.forEach(function (item) {
      const li = document.createElement('li');
      li.textContent = item;
      ul.appendChild(li);
    });

    card.appendChild(ul);
    return card;
  }

  /* ===== Render: Playlist ===== */
  function parseMusicFilename(filename) {
    const base = filename.replace(/_music\.jpg$/i, '').replace(/\.jpg$/i, '');
    const parts = base.split('_');
    return {
      title: parts[0] || 'Canción',
      artist: parts[1] || 'Artista'
    };
  }

  function parseShipName(filename) {
    return filename
      .replace(/\.ship/i, '')
      .replace(/\.Ship/i, '')
      .replace(/\.(jpg|jpeg|png|webp)$/i, '');
  }

  function renderPlaylist() {
    const playlist = document.createElement('div');
    playlist.className = 'playlist';

    MUSIC_FILES.forEach(function (file, i) {
      const meta = parseMusicFilename(file);
      const progress = PROGRESS_VALUES[i % PROGRESS_VALUES.length];

      const card = document.createElement('div');
      card.className = 'song-card';
      card.innerHTML = `
        <img class="song-card__cover" src="${encodeURI(file)}" alt="Portada de ${meta.title}" loading="lazy">
        <div class="song-card__info">
          <div class="song-card__title">${meta.title}</div>
          <div class="song-card__artist">${meta.artist}</div>
          <div class="song-card__note">* no se pueden reproducir</div>
        </div>
        <div class="song-card__controls">
          <button class="song-card__play" type="button" aria-label="Reproducir ${meta.title}" disabled>
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          </button>
          <div class="song-card__progress">
            <div class="song-card__progress-bar" style="--progress: ${progress}%"></div>
          </div>
        </div>
      `;

      playlist.appendChild(card);
    });

    return playlist;
  }

  /* ===== Render: Memory garden (Ventana 4) ===== */
  function renderMemoryGarden() {
    const wrap = document.createElement('div');
    wrap.className = 'memory-garden';

    const note = document.createElement('div');
    note.className = 'memory-note';
    note.innerHTML = highlightTeAmoHTML(`
      <p class="memory-note__title">lo que me recuerda a ti;</p>
      <p class="memory-note__text">Los videojuegos, milo j, Undertale, Deltarun, el color verde, daredevil, jon eggbert, batman, the riddler, el niño sin genero, princesa dulce, el mar, el picante, Rouge y gabito, la grasa,zaboobo3, ivan, jax, derek,itrapp,tord, amongus, etc..</p>
      <p class="memory-note__text memory-note__text--spaced">hay mas cosas que me recuerdan a ti, pero quiero conocer aun mas de ti para que no salgas de mi cabeza nunca pues te amo</p>
    `);
    wrap.appendChild(note);

    const icons = ['🌿', '🎵', '☁️', '🌙', '✨', '📖', '🍃', '💫'];
    const grid = document.createElement('div');
    grid.className = 'memory-grid';

    icons.forEach(function (icon) {
      const card = document.createElement('div');
      card.className = 'memory-card';
      const span = document.createElement('span');
      span.className = 'memory-card__icon';
      span.textContent = icon;
      card.appendChild(span);
      grid.appendChild(card);
    });

    wrap.appendChild(grid);
    return wrap;
  }

  /* ===== Render: Timeline ===== */
  function renderTimeline() {
    const moments = [
      {
        date: '30 de abril',
        title: 'La primera vez que hablamos solos',
        text: 'Es especial pues es la primera vez que pude convivir contigo aunque fuera muy poco fue un impulso a conocernos y pensar en que por unos mensajes estamos donde estamos ahora me hace sentir feliz'
      },
      {
        date: '20-30 mayo',
        title: 'Cuando pasamos tiempo a solas en las noches mientras jugábamos',
        text: 'Honestamente siempre disfrutaba esos momentos, cada vez que te contaba mi historia, hacíamos locuras o simplemente te veía construir era divertido y realmente me encantaba tener tiempo a solas solo contigo'
      },
      {
        date: '1 de junio',
        title: 'Cuando confesaste tu amor y me que tomaras de sorpresa',
        text: 'Me da risa por que yo estaba en llamada, pero honestamente fue una de las noches más lindas, simplemente estaba temblando y riéndome de felicidad al saber que tu también sentías lo mismo que aunque había sido pronto, realmente sentíamos algo por el otro'
      },
      {
        date: '1 de junio',
        title: 'Nuestra primera llamada siendo pareja',
        text: 'Tenía nervios, siempre los he tenido puedo no soy alguien que se puede expresar tanto más cuando se trata de la persona que más ama en este mundo pero te juro que haber hecho esa llamada y haber dormido juntos, fue lo mejor que me pudo suceder.'
      },
      {
        date: '9 de junio',
        title: 'Cuando casi rompemos XD',
        text: 'Aunque es un recuerdo un poco amargo lo tengo en mi corazón pues en ese momento fue donde comprendí lo que tu corazón siente, como actúas cuando no puedes con algo y como a veces simplemente no soportas un dolor inmenso. Fue el momento donde realmente entendí que te seguiría amando incluso si terminabas en un hospital psiquiátrico por que yo quiero estar ahí en esos momentos, no para resolver tus problemas pero si para acompañarte en tu dolor, besar tus lágrimas y no soltarte hasta que te sientas más segura.'
      },
      {
        date: 'Siempre',
        title: 'Los momentos que hemos hablado de lo que sentimos sin juzgarnos',
        text: 'Cada vez que contamos cómo nos sentimos (con los celos o inseguridades) me da a entender que tenemos confianza en el otro, además de contarnos anécdotas que nos hacen ser quienes somos, amo que podamos hacer eso sin sentir que el otro nos juzga'
      },
      {
        date: '29-30 de junio',
        title: 'Nuestra llamada más larga de 7 horas',
        text: 'Nunca había tenido una llamada tan larga JAKSJSJQKA, realmente ame estar contigo todo el rato ahí, dormí super bien aunque desperté con dolor de cuerpo pero eso ya es normal JAJAJJA. Pero en serio ame la plática que tuvimos contándonos chismes y lo que opinabamos de ellos, compartir parte de nuestra vida realmente lo sentí como si realmente hubiera Estado contigo a tu lado esa noche y solo pensarlo otra vez me dan ganas de llorar'
      }
    ];

    const timeline = document.createElement('div');
    timeline.className = 'timeline';

    moments.forEach(function (m) {
      const item = document.createElement('div');
      item.className = 'timeline__item';
      item.innerHTML = `
        <div class="timeline__card">
          <div class="timeline__date">${m.date} — ${m.title}</div>
          <p class="timeline__text">${m.text}</p>
        </div>
      `;
      timeline.appendChild(item);
    });

    return timeline;
  }

  /* ===== Render: Ships ===== */
  function renderShips() {
    const grid = document.createElement('div');
    grid.className = 'ships-grid';

    SHIP_FILES.forEach(function (file) {
      const name = parseShipName(file);
      const card = document.createElement('article');
      card.className = 'ship-card';
      card.innerHTML = `
        <div class="ship-card__image-wrap">
          <img class="ship-card__image" src="${encodeURI(file)}" alt="${name}" loading="lazy">
        </div>
        <p class="ship-card__name">${name}</p>
      `;
      grid.appendChild(card);
    });

    return grid;
  }

  /* ===== Init ===== */
  initParticles();
})();
