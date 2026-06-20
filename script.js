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

  // --- Serious UI Sound Engine ---
  class UISoundManager {
    constructor() {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.enabled = true;
    }

    resume() {
      if (this.ctx.state === 'suspended') this.ctx.resume();
    }

    playHover() {
      if (!this.enabled) return;
      this.resume();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      // Serious subtle tick
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.02);
      
      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.04, this.ctx.currentTime + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.02);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.02);
    }

    playClick() {
      if (!this.enabled) return;
      this.resume();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      // Deep mechanical thud/snap
      osc.type = 'sine';
      osc.frequency.setValueAtTime(200, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.05);
      
      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.2, this.ctx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    }
  }

  const soundEngine = new UISoundManager();
  
  // Bind sounds to interactable elements
  document.querySelectorAll('a, button, .social-btn, .btn, .nav-links a').forEach(el => {
    el.addEventListener('mouseenter', () => soundEngine.playHover());
    el.addEventListener('mousedown', () => soundEngine.playClick());
  });

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
      musicBtn.classList.add('playing');
    } else {
      // Eğer API biraz geç yüklendiyse 1 saniye bekleyip başlat
      setTimeout(() => {
        if (player && typeof player.playVideo === 'function') {
          player.playVideo();
          isPlaying = true;
          musicText.textContent = "Pause Vibe";
          musicBtn.classList.add('playing');
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
      musicBtn.classList.remove('playing');
    } else {
      // Müziği oynat (Kaldığı yerden devam eder)
      player.playVideo();
      musicText.textContent = "Pause Vibe";
      musicBtn.classList.add('playing');
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

  // --- Scroll Spy & Nav Link Active State ---
  const sections = document.querySelectorAll('section');
  const navLinksList = document.querySelectorAll('.nav-links a');

  function updateActiveNavLink() {
    let currentSectionId = '';
    const scrollPos = window.scrollY + 120; // Offset for header padding/height

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinksList.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink);
  updateActiveNavLink(); // Run initially

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
    threshold: 0.05,
    rootMargin: "0px 0px -40px 0px"
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- Interactive Spotlight & 3D Tilt Effect ---
  const cards = document.querySelectorAll('.bento-card, .skill-card, .contact-box');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Update spotlight position variables
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      // 3D Tilt calculation (exclude full contact box for cleaner physics)
      if (!card.classList.contains('contact-box')) {
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const maxTilt = 8; // degrees max rotation
        
        const tiltX = -((y - centerY) / centerY) * maxTilt;
        const tiltY = ((x - centerX) / centerX) * maxTilt;

        card.style.setProperty('--tilt-x', `${tiltX}deg`);
        card.style.setProperty('--tilt-y', `${tiltY}deg`);
      }
    });

    card.addEventListener('mouseleave', () => {
      // Smoothly reset tilt variables via CSS transitions
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
    });
  });

  // --- Antigravity Glow Effect ---
  const antiGlow = document.getElementById('antiGlow');
  
  if (antiGlow) {
    document.addEventListener('mousemove', (e) => {
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

  // --- Discord Presence Logger & Live Renderer (Lanyard API) ---
  const DISCORD_USER_ID = "1380218516677857291";
  let spotifyInterval = null;

  function initDiscordPresence(userId) {
    const ws = new WebSocket("wss://api.lanyard.rest/socket");
    let heartbeatInterval = null;

    ws.onopen = () => {
      console.log("Discord Lanyard socket opened");
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      // Hello (opcode 1) -> Start heartbeat and Subscribe
      if (msg.op === 1) {
        heartbeatInterval = setInterval(() => {
          ws.send(JSON.stringify({ op: 3 }));
        }, msg.d.heartbeat_interval);

        ws.send(JSON.stringify({
          op: 2,
          d: { subscribe_to_id: userId }
        }));
      }

      // Event updates (INIT_STATE or PRESENCE_UPDATE)
      if (msg.t === "INIT_STATE" || msg.t === "PRESENCE_UPDATE") {
        updatePresenceDOM(msg.d);
      }
    };

    ws.onclose = () => {
      if (heartbeatInterval) clearInterval(heartbeatInterval);
      console.log("Discord Lanyard socket closed. Reconnecting in 5s...");
      setTimeout(() => initDiscordPresence(userId), 5000);
    };

    ws.onerror = (err) => {
      console.error("Discord Lanyard socket error:", err);
      ws.close();
    };
  }

  function updatePresenceDOM(data) {
    if (!data) return;

    // Clear any active spotify progress runner
    if (spotifyInterval) {
      clearInterval(spotifyInterval);
      spotifyInterval = null;
    }

    const user = data.discord_user;
    const status = data.discord_status;
    const spotify = data.spotify;
    const activities = data.activities || [];

    // 1. Update Profile Avatar
    const avatarImg = document.getElementById("discordAvatar");
    if (avatarImg) {
      if (user.avatar) {
        avatarImg.src = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256`;
      } else {
        const fallbackId = parseInt(user.id.slice(-4)) % 6;
        avatarImg.src = `https://cdn.discordapp.com/embed/avatars/${fallbackId}.png`;
      }
    }

    // 2. Update Display Name and Username
    const dispNameEl = document.getElementById("discordDisplayName");
    if (dispNameEl) {
      dispNameEl.textContent = user.global_name || user.username || "Milky";
    }

    const usernameEl = document.getElementById("discordUsername");
    if (usernameEl) {
      usernameEl.textContent = `@${user.username}`;
    }

    // Update Contact redirect button text if available
    const contactText = document.getElementById("discordContactText");
    if (contactText) {
      contactText.textContent = `Discord @${user.username}`;
    }

    // 3. Update Status Dot
    const statusDot = document.getElementById("discordStatusDot");
    const statusTextEl = document.getElementById("discordStatusText");
    if (statusDot && statusTextEl) {
      statusDot.className = `dc-status-dot ${status}`;
      
      let statusLabel = "Offline";
      if (status === "online") statusLabel = "Online";
      else if (status === "idle") statusLabel = "Away";
      else if (status === "dnd") statusLabel = "Do Not Disturb";
      
      statusTextEl.textContent = statusLabel;
    }

    // 4. Update Custom Status (activity type 4 is Custom Status)
    const customStatusEl = document.getElementById("discordCustomStatus");
    const customStatus = activities.find(act => act.type === 4);
    if (customStatusEl) {
      if (customStatus && (customStatus.state || customStatus.emoji)) {
        customStatusEl.style.display = "inline-flex";
        const emojiEl = customStatusEl.querySelector(".status-emoji");
        const textEl = customStatusEl.querySelector(".status-text");

        if (emojiEl) {
          if (customStatus.emoji && customStatus.emoji.id) {
            const ext = customStatus.emoji.animated ? 'gif' : 'png';
            emojiEl.innerHTML = `<img src="https://cdn.discordapp.com/emojis/${customStatus.emoji.id}.${ext}?size=44" style="width: 20px; height: 20px; vertical-align: middle;" alt="" />`;
          } else if (customStatus.emoji && customStatus.emoji.name) {
            emojiEl.textContent = customStatus.emoji.name;
          } else {
            emojiEl.textContent = "";
          }
        }
        if (textEl) {
          textEl.textContent = customStatus.state || "";
        }
      } else {
        customStatusEl.style.display = "none";
      }
    }

    // 5. Update Spotify Info
    const spotifyEl = document.getElementById("discordSpotify");
    if (spotifyEl) {
      if (data.listening_to_spotify && spotify) {
        spotifyEl.style.display = "flex";
        
        const artEl = document.getElementById("spotifyAlbumArt");
        const trackEl = document.getElementById("spotifyTrack");
        const artistEl = document.getElementById("spotifyArtist");
        const albumEl = document.getElementById("spotifyAlbum");
        const progressEl = document.getElementById("spotifyProgress");

        if (artEl) artEl.src = spotify.album_art_url || "";
        if (trackEl) trackEl.textContent = spotify.song || "Unknown Track";
        if (artistEl) artistEl.textContent = `by ${spotify.artist || "Unknown Artist"}`;
        if (albumEl) albumEl.textContent = `on ${spotify.album || "Unknown Album"}`;

        if (progressEl && spotify.timestamps) {
          const start = spotify.timestamps.start;
          const end = spotify.timestamps.end;
          const duration = end - start;

          const updateProgress = () => {
            const now = Date.now();
            const elapsed = Math.max(0, Math.min(duration, now - start));
            const percent = (elapsed / duration) * 100;
            progressEl.style.width = `${percent}%`;
          };

          updateProgress();
          spotifyInterval = setInterval(updateProgress, 1000);
        }
      } else {
        spotifyEl.style.display = "none";
      }
    }

    // 6. Update Game Activity
    const activityEl = document.getElementById("discordActivity");
    const gameActivity = activities.find(act => act.type !== 4 && act.name !== "Spotify");

    if (activityEl) {
      if (gameActivity) {
        activityEl.style.display = "flex";
        
        const actHeader = activityEl.querySelector(".activity-header");
        const actName = document.getElementById("activityName");
        const actDetails = document.getElementById("activityDetails");
        const actState = document.getElementById("activityState");
        const actImage = document.getElementById("activityImage");
        const actSmallImage = document.getElementById("activitySmallImage");

        let typeLabel = "Playing";
        if (gameActivity.type === 1) typeLabel = "Streaming";
        else if (gameActivity.type === 2) typeLabel = "Listening to";
        else if (gameActivity.type === 3) typeLabel = "Watching";
        else if (gameActivity.type === 5) typeLabel = "Competing in";
        
        if (actHeader) actHeader.textContent = typeLabel;
        if (actName) actName.textContent = gameActivity.name || "Game";
        if (actDetails) actDetails.textContent = gameActivity.details || "";
        if (actState) actState.textContent = gameActivity.state || "";

        if (gameActivity.assets && (gameActivity.assets.large_image || gameActivity.assets.small_image)) {
          actImage.style.display = "block";
          
          const getAssetUrl = (appId, assetId) => {
            if (!assetId) return "";
            if (assetId.startsWith("mp:external/")) {
              return `https://media.discordapp.net/${assetId.replace("mp:external/", "")}`;
            }
            return `https://cdn.discordapp.com/app-assets/${appId}/${assetId}.png`;
          };

          if (gameActivity.assets.large_image) {
            actImage.src = getAssetUrl(gameActivity.application_id, gameActivity.assets.large_image);
          } else {
            actImage.src = "https://media.discordapp.net/attachments/1502743667574571118/1505193963278307368/luicid.png";
          }

          if (gameActivity.assets.small_image) {
            actSmallImage.style.display = "block";
            actSmallImage.src = getAssetUrl(gameActivity.application_id, gameActivity.assets.small_image);
          } else {
            actSmallImage.style.display = "none";
          }
        } else {
          actImage.style.display = "block";
          actImage.src = "https://media.discordapp.net/attachments/1502743667574571118/1505193963278307368/luicid.png";
          actSmallImage.style.display = "none";
        }
      } else {
        activityEl.style.display = "none";
      }
    }
  }

  // Initialize Discord presence monitoring
  initDiscordPresence(DISCORD_USER_ID);

});
