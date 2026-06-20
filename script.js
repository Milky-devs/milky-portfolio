/* =========================================
   MILKY.DEV - SENIOR ARCHITECT (MINIMALIST)
========================================= */

// --- Scroll Reveal Animation ---
document.addEventListener('DOMContentLoaded', () => {
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
});

// --- YouTube Background Music ---
let player;
let isPlaying = false;
let isReady = false;

// Dynamically load YT API
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

window.onYouTubeIframeAPIReady = function() {
  player = new YT.Player('ytplayer-container', {
    height: '20', width: '20', videoId: 'QzVWsHJdmb4',
    playerVars: { 
      'autoplay': 1, 
      'controls': 0, 
      'showinfo': 0, 
      'rel': 0, 
      'loop': 1, 
      'playlist': 'QzVWsHJdmb4',
      'origin': window.location.origin 
    },
    events: {
      'onReady': (event) => { 
        isReady = true;
        // Try to play immediately (browser might block)
        event.target.playVideo();
      },
      'onStateChange': (event) => {
        // 1 = PLAYING
        if (event.data === 1) {
          isPlaying = true;
          const musicBtn = document.getElementById('musicBtn');
          const musicText = document.getElementById('musicText');
          if (musicBtn) musicBtn.classList.add('playing');
          if (musicText) musicText.textContent = "Audio: On";
        }
      },
      'onError': (e) => console.error("YT Error:", e.data)
    }
  });
};

document.addEventListener('DOMContentLoaded', () => {
  const musicBtn = document.getElementById('musicBtn');
  const musicText = document.getElementById('musicText');

  if (musicBtn) {
    musicBtn.addEventListener('click', () => {
      if (!isReady || !player) return;

      if (isPlaying) {
        player.pauseVideo();
        isPlaying = false;
        musicText.textContent = "Audio: Off";
        musicBtn.classList.remove('playing');
      } else {
        player.playVideo();
        isPlaying = true;
        musicText.textContent = "Audio: On";
        musicBtn.classList.add('playing');
      }
    });
  }

  // --- Header Scroll Effect ---
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.style.background = 'rgba(10, 10, 10, 0.95)';
      header.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
    } else {
      header.style.background = 'rgba(10, 10, 10, 0.8)';
      header.style.borderBottom = '1px solid var(--border)';
    }
  });

  // --- Discord Lanyard API Integration ---
  const DISCORD_USER_ID = "1380218516677857291";
  let spotifyInterval = null;

  function initDiscordPresence(userId) {
    const ws = new WebSocket("wss://api.lanyard.rest/socket");
    let heartbeatInterval = null;

    ws.onopen = () => {
      // Socket opened
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.op === 1) {
        heartbeatInterval = setInterval(() => {
          ws.send(JSON.stringify({ op: 3 }));
        }, msg.d.heartbeat_interval);

        ws.send(JSON.stringify({ op: 2, d: { subscribe_to_id: userId } }));
      }
      if (msg.t === "INIT_STATE" || msg.t === "PRESENCE_UPDATE") {
        updatePresenceDOM(msg.d);
      }
    };

    ws.onclose = () => {
      if (heartbeatInterval) clearInterval(heartbeatInterval);
      setTimeout(() => initDiscordPresence(userId), 5000); // Reconnect
    };
  }

  function updatePresenceDOM(data) {
    if (!data) return;

    if (spotifyInterval) {
      clearInterval(spotifyInterval);
      spotifyInterval = null;
    }

    const user = data.discord_user;
    const status = data.discord_status;
    const spotify = data.spotify;
    const activities = data.activities || [];

    // Profile updates
    const avatarImg = document.getElementById("discordAvatar");
    if (avatarImg) {
      avatarImg.src = user.avatar ? 
        `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256` : 
        `https://cdn.discordapp.com/embed/avatars/${parseInt(user.id.slice(-4)) % 6}.png`;
    }

    const dispNameEl = document.getElementById("discordDisplayName");
    if (dispNameEl) dispNameEl.textContent = user.global_name || user.username || "Milky";

    const usernameEl = document.getElementById("discordUsername");
    if (usernameEl) usernameEl.textContent = `@${user.username}`;

    const statusDot = document.getElementById("discordStatusDot");
    if (statusDot) {
      statusDot.className = `pc-status-dot ${status}`;
    }

    // Custom Status
    const customStatusEl = document.getElementById("discordCustomStatus");
    const customStatus = activities.find(act => act.type === 4);
    if (customStatusEl) {
      if (customStatus && (customStatus.state || customStatus.emoji)) {
        customStatusEl.style.display = "flex";
        const emojiEl = customStatusEl.querySelector(".status-emoji");
        const textEl = customStatusEl.querySelector(".status-text");

        if (emojiEl) {
          if (customStatus.emoji && customStatus.emoji.id) {
            emojiEl.innerHTML = `<img src="https://cdn.discordapp.com/emojis/${customStatus.emoji.id}.${customStatus.emoji.animated ? 'gif' : 'png'}?size=44" style="width: 20px; height: 20px; vertical-align: middle;" />`;
          } else if (customStatus.emoji && customStatus.emoji.name) {
            emojiEl.textContent = customStatus.emoji.name;
          } else {
            emojiEl.textContent = "";
          }
        }
        if (textEl) textEl.textContent = customStatus.state || "";
      } else {
        customStatusEl.style.display = "none";
      }
    }

    // Spotify
    const spotifyEl = document.getElementById("discordSpotify");
    if (spotifyEl) {
      if (data.listening_to_spotify && spotify) {
        spotifyEl.style.display = "flex";
        const artEl = document.getElementById("spotifyAlbumArt");
        const trackEl = document.getElementById("spotifyTrack");
        const artistEl = document.getElementById("spotifyArtist");
        const progressEl = document.getElementById("spotifyProgress");

        if (artEl) artEl.src = spotify.album_art_url || "";
        if (trackEl) trackEl.textContent = spotify.song || "Unknown Track";
        if (artistEl) artistEl.textContent = spotify.artist || "Unknown Artist";

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

    // Game Activity
    const activityEl = document.getElementById("discordActivity");
    const gameActivity = activities.find(act => act.type !== 4 && act.name !== "Spotify");

    if (activityEl) {
      if (gameActivity) {
        activityEl.style.display = "flex";
        const actName = document.getElementById("activityName");
        const actDetails = document.getElementById("activityDetails");
        const actState = document.getElementById("activityState");
        const actImage = document.getElementById("activityImage");
        const actSmallImage = document.getElementById("activitySmallImage");

        if (actName) actName.textContent = gameActivity.name || "Game";
        if (actDetails) actDetails.textContent = gameActivity.details || "";
        if (actState) actState.textContent = gameActivity.state || "";

        // Use large image if available, else try to use the application icon, else fallback
        let imageUrl = "https://media.discordapp.net/attachments/1502743667574571118/1505193963278307368/luicid.png";
        
        if (gameActivity.assets && gameActivity.assets.large_image) {
          const assetId = gameActivity.assets.large_image;
          imageUrl = assetId.startsWith("mp:external/") ? `https://media.discordapp.net/${assetId.replace("mp:external/", "")}` : `https://cdn.discordapp.com/app-assets/${gameActivity.application_id}/${assetId}.png`;
        } else if (gameActivity.application_id) {
          // If no large image but we have an app ID, use the app's icon
          imageUrl = `https://dcdn.dstn.to/app-icons/${gameActivity.application_id}`;
        }
        
        actImage.style.display = "block";
        actImage.src = imageUrl;

        if (gameActivity.assets && gameActivity.assets.small_image) {
          actSmallImage.style.display = "block";
          const smallAssetId = gameActivity.assets.small_image;
          actSmallImage.src = smallAssetId.startsWith("mp:external/") ? `https://media.discordapp.net/${smallAssetId.replace("mp:external/", "")}` : `https://cdn.discordapp.com/app-assets/${gameActivity.application_id}/${smallAssetId}.png`;
        } else {
          actSmallImage.style.display = "none";
        }
      } else {
        activityEl.style.display = "none";
      }
    }
  }

  initDiscordPresence(DISCORD_USER_ID);
});
