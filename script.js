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

  // =========================================
  // ADMIN & MOD PROFILE ONBOARDING SYSTEM
  // =========================================
  const STORAGE_KEY = 'milky_admin_profile';

  const modalOverlay = document.getElementById('profileSetupModal');
  const profileForm = document.getElementById('profileForm');
  const setupUsernameInput = document.getElementById('setupUsername');
  const setupPasswordInput = document.getElementById('setupPassword');
  const setupAvatarUrlInput = document.getElementById('setupAvatarUrl');
  const avatarPills = document.querySelectorAll('.avatar-pill');

  const headerUserAvatar = document.getElementById('headerUserAvatar');
  const headerUsername = document.getElementById('headerUsername');
  const activeUserAvatar = document.getElementById('activeUserAvatar');
  const activeUsername = document.getElementById('activeUsername');

  const openProfileBtn = document.getElementById('openProfileBtn');
  const editProfileQuickBtn = document.getElementById('editProfileQuickBtn');

  // Utility Toast Notifications
  function showToast(text, type = 'success') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span style="font-size: 1.2rem;">${type === 'success' ? '✅' : '❌'}</span>
      <div>${text}</div>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(50px)';
      toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // Get Saved Profile
  function getProfile() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error("Storage error:", e);
      return null;
    }
  }

  // Update UI Elements with Profile Info
  function applyProfileToDOM(profile) {
    if (!profile) return;

    const name = profile.username || 'Admin';
    const avatar = profile.avatarUrl || 'https://cdn.discordapp.net/embed/avatars/0.png';

    if (headerUserAvatar) headerUserAvatar.src = avatar;
    if (headerUsername) headerUsername.textContent = name;
    if (activeUserAvatar) activeUserAvatar.src = avatar;
    if (activeUsername) activeUsername.textContent = name;
  }

  // Avatar Pill Quick Selector
  avatarPills.forEach(pill => {
    pill.addEventListener('click', () => {
      avatarPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const url = pill.getAttribute('data-url');
      if (setupAvatarUrlInput && url) {
        setupAvatarUrlInput.value = url;
      }
    });
  });

  // Open Modal Helper
  function openSetupModal() {
    const currentProfile = getProfile();
    if (currentProfile) {
      if (setupUsernameInput) setupUsernameInput.value = currentProfile.username || '';
      if (setupPasswordInput) setupPasswordInput.value = currentProfile.password || '';
      if (setupAvatarUrlInput) setupAvatarUrlInput.value = currentProfile.avatarUrl || '';
    }

    if (modalOverlay) {
      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  // Close Modal Helper
  function closeSetupModal() {
    if (modalOverlay) {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // Mandatory Initial Onboarding Check
  const savedProfile = getProfile();
  if (!savedProfile) {
    openSetupModal();
  } else {
    applyProfileToDOM(savedProfile);
  }

  // Manual Edit Profile Triggers
  if (openProfileBtn) openProfileBtn.addEventListener('click', openSetupModal);
  if (editProfileQuickBtn) editProfileQuickBtn.addEventListener('click', openSetupModal);

  // Handle Profile Form Submission (Save Profile)
  if (profileForm) {
    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const username = setupUsernameInput.value.trim();
      const password = setupPasswordInput.value.trim();
      let avatarUrl = setupAvatarUrlInput.value.trim();

      if (!avatarUrl) {
        avatarUrl = 'https://cdn.discordapp.net/embed/avatars/0.png';
      }

      if (!username || !password) {
        showToast('Lütfen kullanıcı adı ve şifrenizi girin.', 'error');
        return;
      }

      const profileData = { username, password, avatarUrl };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profileData));

      applyProfileToDOM(profileData);
      closeSetupModal();
      showToast(`Profiliniz başarıyla kaydedildi! Hoş geldiniz, ${username}.`, 'success');
    });
  }

  // =========================================
  // DISCORD ANNOUNCEMENT WEBHOOK SYSTEM (V2)
  // =========================================
  const announcementForm = document.getElementById('announcementForm');

  if (announcementForm) {
    announcementForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const profile = getProfile();
      if (!profile) {
        showToast('Duyuru atmadan önce profil oluşturmanız gerekmektedir.', 'error');
        openSetupModal();
        return;
      }

      const annTitle = document.getElementById('annTitle').value.trim();
      const annMessage = document.getElementById('annMessage').value.trim();
      const isEveryone = document.getElementById('everyoneToggle').checked;
      const webhookUrl = document.getElementById('webhookUrlInput').value.trim();
      const selectedColorHex = document.querySelector('input[name="embedColor"]:checked')?.value || '#5865F2';

      if (!annMessage) {
        showToast('Lütfen duyuru metnini doldurun.', 'error');
        return;
      }

      if (!webhookUrl) {
        showToast('Geçerli bir Discord Webhook URL girin.', 'error');
        return;
      }

      const sendBtn = document.getElementById('sendAnnBtn');
      const originalBtnHTML = sendBtn ? sendBtn.innerHTML : '';

      if (sendBtn) {
        sendBtn.disabled = true;
        sendBtn.style.opacity = '0.7';
        sendBtn.innerHTML = '⏳ Discord\'a Gönderiliyor...';
      }

      // Convert Hex Color to Decimal Integer for Discord API Embed
      const colorInt = parseInt(selectedColorHex.replace('#', ''), 16);

      // Build V2 Payload with User's custom Profile Name & Avatar
      const payload = {
        username: profile.username || "Milky Admin",
        avatar_url: profile.avatarUrl || "https://cdn.discordapp.net/embed/avatars/0.png",
        content: isEveryone ? "@everyone" : null,
        embeds: [
          {
            title: annTitle || "📢 Yönetici Duyurusu",
            description: annMessage,
            color: colorInt,
            timestamp: new Date().toISOString(),
            footer: {
              text: `Milky Admin Panel • Yetkili: ${profile.username}`,
              icon_url: profile.avatarUrl
            }
          }
        ]
      };

      try {
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (response.ok || response.status === 204) {
          showToast('🎉 Duyuru Discord kanalına başarıyla gönderildi!', 'success');
          document.getElementById('annMessage').value = '';
          document.getElementById('annTitle').value = '';
        } else {
          const errData = await response.text();
          console.error("Webhook Response Error:", errData);
          showToast('Webhook gönderimi başarısız oldu. Webhook URL\'yi kontrol edin.', 'error');
        }
      } catch (err) {
        console.error("Webhook Fetch Error:", err);
        showToast('Baglantı hatası: Duyuru iletilemedi.', 'error');
      } finally {
        if (sendBtn) {
          sendBtn.disabled = false;
          sendBtn.style.opacity = '1';
          sendBtn.innerHTML = originalBtnHTML;
        }
      }
    });
  }
});

