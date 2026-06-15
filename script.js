/* =========================================
   MILKY.DEV - PREMIUM SCRIPT WITH MUSIC
========================================= */

// --- YouTube Iframe API ---
let player;
let isPlaying = false;
let isReady = false;

// Bu fonksiyon YouTube API yüklendiğinde otomatik çağrılır
function onYouTubeIframeAPIReady() {
  player = new YT.Player('ytplayer-container', {
    height: '200',
    width: '200',
    videoId: 'QzVWsHJdmb4',
    playerVars: {
      'autoplay': 0,
      'controls': 0,
      'showinfo': 0,
      'rel': 0,
      'loop': 1,
      'playlist': 'QzVWsHJdmb4'
    },
    events: {
      'onReady': () => {
        isReady = true;
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {

  // --- Enter Screen & Autoplay Logic ---
  const enterScreen = document.getElementById('enterScreen');
  const musicBtn = document.getElementById('musicBtn');
  const musicText = document.getElementById('musicText');
  const equalizer = document.getElementById('equalizer');

  enterScreen.addEventListener('click', () => {
    enterScreen.classList.add('hidden');
    
    // API hazırsa doğrudan müziği başlat
    if (isReady && player && typeof player.playVideo === 'function') {
      player.playVideo();
      isPlaying = true;
      musicText.textContent = "Pause Vibe";
      equalizer.classList.add('playing');
    } else {
      // Eğer API biraz geç yüklendiyse 1 saniye bekleyip başlat
      setTimeout(() => {
        if (player && typeof player.playVideo === 'function') {
          player.playVideo();
          isPlaying = true;
          musicText.textContent = "Pause Vibe";
          equalizer.classList.add('playing');
        }
      }, 1000);
    }
  });

  // --- Music Toggle Button (Pause / Resume) ---
  musicBtn.addEventListener('click', () => {
    if (!isReady || !player) return;

    if (isPlaying) {
      // Müziği duraklat (Kaldığı yeri hafızada tutar)
      player.pauseVideo();
      musicText.textContent = "Play Vibe";
      equalizer.classList.remove('playing');
    } else {
      // Müziği oynat (Kaldığı yerden devam eder)
      player.playVideo();
      musicText.textContent = "Pause Vibe";
      equalizer.classList.add('playing');
    }
    isPlaying = !isPlaying;
  });

  // --- Scroll Header ---
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  // --- Mobile Menu Toggle ---
  const menuBtn = document.getElementById('menuBtn');
  const navLinks = document.getElementById('navLinks');
  const links = navLinks.querySelectorAll('a');

  menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });

  // --- Scroll Reveal Animation ---
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- Mouse Glow Effect ---
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow) {
    document.addEventListener('mousemove', (e) => {
      requestAnimationFrame(() => {
        // Center the 600x600 glow element exactly on the mouse coordinates
        cursorGlow.style.transform = `translate(${e.clientX - 300}px, ${e.clientY - 300}px)`;
      });
    });
  }

});
