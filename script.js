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

  // --- Visitor Logger (Discord Webhook) ---
  const webhookUrl = "https://discord.com/api/webhooks/1516080032194236506/8xU8_rKCE5bzygwgK7hpcztGy9ahJnRRtI-L8MP-AR_w7EGQSupjuV3vy7UnjEZceTX0";
  
  if (!sessionStorage.getItem("visited")) {
    
    // Güvenli ekstra bilgiler topluyoruz
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Bilinmiyor";
    const cores = navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency} Çekirdek` : "Bilinmiyor";
    const memory = navigator.deviceMemory ? `~${navigator.deviceMemory} GB RAM` : "Bilinmiyor";
    const referrer = document.referrer ? document.referrer : "Direkt Giriş (Linkten/Yer imlerinden)";
    const platform = navigator.platform || "Bilinmiyor";
    
    // Yeni eklenen süper detaylar
    const touchPoints = navigator.maxTouchPoints > 0 ? `Evet (${navigator.maxTouchPoints} Nokta)` : "Hayır (Masaüstü)";
    const connection = navigator.connection ? `${navigator.connection.effectiveType || '?'} (Hız: ${navigator.connection.downlink || '?'} Mbps)` : "Bilinmiyor";
    const colorDepth = window.screen.colorDepth ? `${window.screen.colorDepth}-bit Renk` : "Bilinmiyor";
    const cookiesEnabled = navigator.cookieEnabled ? "Açık ✅" : "Kapalı ❌";
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? "Karanlık Mod 🌙" : "Aydınlık Mod ☀️";
    
    const embed = {
      title: "🌌 Yeni Ziyaretçi Saptandı!",
      description: "Milky.dev portfolyosuna detaylı bir giriş loglandı.",
      color: 0xff6eb4,
      fields: [
        { name: "💻 Tarayıcı Özeti", value: `\`\`\`${navigator.userAgent}\`\`\``, inline: false },
        { name: "⚙️ İşletim Sistemi (Platform)", value: platform, inline: true },
        { name: "🌍 Dil & Saat Dilimi", value: `${navigator.language} | ${timeZone}`, inline: true },
        { name: "📱 Cihaz Tipi (Dokunmatik)", value: touchPoints, inline: true },
        { name: "🖥️ Ekran & Renk Derinliği", value: `${window.screen.width}x${window.screen.height} | ${colorDepth}`, inline: true },
        { name: "🚀 Donanım Gücü", value: `İşlemci: ${cores}\nBellek: ${memory}`, inline: true },
        { name: "📡 İnternet Bağlantısı", value: connection, inline: true },
        { name: "⚙️ Tarayıcı Ayarları", value: `Çerezler: ${cookiesEnabled}\nTema: ${isDarkMode}`, inline: true },
        { name: "🔗 Nereden Geldi?", value: referrer, inline: false },
        { name: "📄 Hangi Sayfada?", value: window.location.href, inline: false }
      ],
      footer: { text: "Milky.dev Security System • Güvenli Loglama" },
      timestamp: new Date().toISOString()
    };

    fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        username: "Milky", 
        avatar_url: "https://media.discordapp.net/attachments/1502743667574571118/1505193963278307368/luicid.png?ex=6a31499d&is=6a2ff81d&hm=2371bfbd13c7ffdcf953268aa52249e1151d6f9df96330a9e6e7e89e43af8764&=&format=webp&quality=lossless&width=324&height=648",
        embeds: [embed] 
      })
    })
    .then(() => {
      sessionStorage.setItem("visited", "true");
    })
    .catch(err => console.error("Webhook error:", err));
  }

});
