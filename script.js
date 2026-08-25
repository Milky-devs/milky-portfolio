/* =========================================
   MILKY.DEV — DISCORD V2 WEBHOOK HUB ENGINE
========================================= */

const ComponentType = {
  ActionRow: 1,
  Button: 2,
  Section: 9,
  TextDisplay: 10,
  Thumbnail: 11,
  Media: 12,
  Separator: 14,
  Container: 17,
};

const V2Flags = {
  IsComponentsV2: 32768,
};

document.addEventListener('DOMContentLoaded', () => {

  // --- Utility: Toast Notifications ---
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

  // --- LocalStorage Keys ---
  const PROFILE_STORAGE_KEY = 'milky_admin_profile';
  const HISTORY_STORAGE_KEY = 'milky_ann_history';

  // --- DOM Elements ---
  const modalOverlay = document.getElementById('profileSetupModal');
  const profileForm = document.getElementById('profileForm');
  const setupUsernameInput = document.getElementById('setupUsername');
  const setupPasswordInput = document.getElementById('setupPassword');
  const togglePasswordBtn = document.getElementById('togglePasswordBtn');
  
  const setupAvatarFileInput = document.getElementById('setupAvatarFile');
  const setupAvatarUrlInput = document.getElementById('setupAvatarUrl');
  const setupAvatarPreview = document.getElementById('setupAvatarPreview');
  const avatarPills = document.querySelectorAll('.avatar-pill');

  const headerUserAvatar = document.getElementById('headerUserAvatar');
  const headerUsername = document.getElementById('headerUsername');
  const activeUserAvatar = document.getElementById('activeUserAvatar');
  const activeUsername = document.getElementById('activeUsername');

  const openProfileBtn = document.getElementById('openProfileBtn');
  const editProfileQuickBtn = document.getElementById('editProfileQuickBtn');

  // --- Password Eye Icon Toggle ---
  if (togglePasswordBtn && setupPasswordInput) {
    togglePasswordBtn.addEventListener('click', () => {
      const type = setupPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      setupPasswordInput.setAttribute('type', type);
      togglePasswordBtn.textContent = type === 'password' ? '👁️' : '🙈';
    });
  }

  // --- Local File Reader for Avatar Upload ---
  if (setupAvatarFileInput) {
    setupAvatarFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        if (!file.type.startsWith('image/')) {
          showToast('Lütfen geçerli bir resim dosyası seçin.', 'error');
          return;
        }
        const reader = new FileReader();
        reader.onload = function(evt) {
          const dataUrl = evt.target.result;
          if (setupAvatarUrlInput) setupAvatarUrlInput.value = dataUrl;
          if (setupAvatarPreview) setupAvatarPreview.src = dataUrl;
          avatarPills.forEach(p => p.classList.remove('active'));
          showToast('Fotoğraf galeriden başarıyla seçildi!', 'success');
          updateLiveDiscordPreview();
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // --- Preset Avatar Selection ---
  avatarPills.forEach(pill => {
    pill.addEventListener('click', () => {
      avatarPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const url = pill.getAttribute('data-url');
      if (setupAvatarUrlInput && url) {
        setupAvatarUrlInput.value = url;
        if (setupAvatarPreview) setupAvatarPreview.src = url;
        updateLiveDiscordPreview();
      }
    });
  });

  if (setupAvatarUrlInput) {
    setupAvatarUrlInput.addEventListener('input', () => {
      const url = setupAvatarUrlInput.value.trim();
      if (url && setupAvatarPreview) {
        setupAvatarPreview.src = url;
        updateLiveDiscordPreview();
      }
    });
  }

  // --- Profile Storage Operations ---
  function getProfile() {
    try {
      const data = localStorage.getItem(PROFILE_STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  function applyProfileToDOM(profile) {
    if (!profile) return;
    const name = profile.username || 'Admin';
    const avatar = profile.avatarUrl || 'https://cdn.discordapp.net/embed/avatars/0.png';

    if (headerUserAvatar) headerUserAvatar.src = avatar;
    if (headerUsername) headerUsername.textContent = name;
    if (activeUserAvatar) activeUserAvatar.src = avatar;
    if (activeUsername) activeUsername.textContent = name;

    updateLiveDiscordPreview();
  }

  function openSetupModal() {
    const currentProfile = getProfile();
    if (currentProfile) {
      if (setupUsernameInput) setupUsernameInput.value = currentProfile.username || '';
      if (setupPasswordInput) setupPasswordInput.value = currentProfile.password || '';
      if (setupAvatarUrlInput) setupAvatarUrlInput.value = currentProfile.avatarUrl || '';
      if (setupAvatarPreview) setupAvatarPreview.src = currentProfile.avatarUrl || 'https://cdn.discordapp.net/embed/avatars/0.png';
    }
    if (modalOverlay) {
      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeSetupModal() {
    if (modalOverlay) {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  const savedProfile = getProfile();
  if (!savedProfile) {
    openSetupModal();
  } else {
    applyProfileToDOM(savedProfile);
  }

  if (openProfileBtn) openProfileBtn.addEventListener('click', openSetupModal);
  if (editProfileQuickBtn) editProfileQuickBtn.addEventListener('click', openSetupModal);

  if (profileForm) {
    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = setupUsernameInput.value.trim();
      const password = setupPasswordInput.value.trim();
      let avatarUrl = setupAvatarUrlInput.value.trim();

      if (!username || !password) {
        showToast('Kullanıcı adı ve şifrenizi doldurun.', 'error');
        return;
      }

      if (!avatarUrl) {
        avatarUrl = 'https://cdn.discordapp.net/embed/avatars/0.png';
      }

      const profileData = { username, password, avatarUrl };
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profileData));

      applyProfileToDOM(profileData);
      closeSetupModal();
      showToast(`Profil kaydedildi! Hoş geldiniz, ${username}.`, 'success');
    });
  }

  // --- Real-time Live Discord Preview ---
  const annTitleInput = document.getElementById('annTitle');
  const annMessageInput = document.getElementById('annMessage');
  const annImageUrlInput = document.getElementById('annImageUrl');
  const everyoneToggleInput = document.getElementById('everyoneToggle');

  const previewAvatar = document.getElementById('previewAvatar');
  const previewUsername = document.getElementById('previewUsername');
  const previewTime = document.getElementById('previewTime');
  const previewContentMention = document.getElementById('previewContentMention');
  const previewEmbedColorBar = document.getElementById('previewEmbedColorBar');
  const previewTitle = document.getElementById('previewTitle');
  const previewMessage = document.getElementById('previewMessage');
  const previewImage = document.getElementById('previewImage');
  const previewFooterAvatar = document.getElementById('previewFooterAvatar');
  const previewFooterText = document.getElementById('previewFooterText');

  function updateLiveDiscordPreview() {
    const profile = getProfile() || { username: 'Milky Admin', avatarUrl: 'https://cdn.discordapp.net/embed/avatars/0.png' };
    
    if (previewAvatar) previewAvatar.src = profile.avatarUrl;
    if (previewUsername) previewUsername.textContent = profile.username || 'Milky Admin';
    if (previewFooterAvatar) previewFooterAvatar.src = profile.avatarUrl;
    if (previewFooterText) previewFooterText.textContent = `Milky Admin Panel • Yetkili: ${profile.username || 'Admin'}`;

    const now = new Date();
    const timeStr = `Bugün ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    if (previewTime) previewTime.textContent = timeStr;

    if (previewContentMention && everyoneToggleInput) {
      previewContentMention.style.display = everyoneToggleInput.checked ? 'inline-block' : 'none';
    }

    const selectedColorHex = document.querySelector('input[name="embedColor"]:checked')?.value || '#5865F2';
    if (previewEmbedColorBar) previewEmbedColorBar.style.backgroundColor = selectedColorHex;

    const titleVal = annTitleInput ? annTitleInput.value.trim() : '';
    if (previewTitle) previewTitle.textContent = titleVal || '📢 Yönetici Duyurusu';

    const messageVal = annMessageInput ? annMessageInput.value.trim() : '';
    if (previewMessage) previewMessage.textContent = messageVal || 'Duyuru metniniz burada görünür...';

    const imageVal = annImageUrlInput ? annImageUrlInput.value.trim() : '';
    if (previewImage) {
      if (imageVal) {
        previewImage.src = imageVal;
        previewImage.style.display = 'block';
      } else {
        previewImage.style.display = 'none';
      }
    }
  }

  [annTitleInput, annMessageInput, annImageUrlInput, everyoneToggleInput, setupUsernameInput].forEach(input => {
    if (input) {
      input.addEventListener('input', updateLiveDiscordPreview);
      input.addEventListener('change', updateLiveDiscordPreview);
    }
  });

  document.querySelectorAll('input[name="embedColor"]').forEach(radio => {
    radio.addEventListener('change', updateLiveDiscordPreview);
  });

  updateLiveDiscordPreview();

  // --- Quick Templates ---
  const templates = {
    maintenance: {
      title: "🛠️ Sunucu Bakımı & Güncelleme",
      message: "Sunucumuz sistem bakımı ve optimizasyon çalışmaları için kısa süreliğine bakıma alınmıştır. Güncelleme tamamlandığında bilgilendirme yapılacaktır.\n\nAnlayışınız için teşekkür ederiz!",
      color: "#FFEA00",
      everyone: true
    },
    update: {
      title: "🎉 Yeni Güncelleme Notları v2.0",
      message: "Sistemlerimizde büyük yenilikler yayınlandı!\n\n✨ Öne Çıkan Yenilikler:\n- Geliştirilmiş Canlı Yönetim Paneli\n- Yüksek Hızlı Sunucu Performansı & Güvenlik\n- Yeni Arayüz Temaları ve Hata Düzeltmeleri",
      color: "#00E676",
      everyone: true
    },
    urgent: {
      title: "🚨 KANALSAL ACİL DUYURU",
      message: "Önemli Güvenlik / Sistem Uyarısı:\n\nLütfen tüm yetkililer ve üyeler dikkat etsin! Yetkisiz işlemler ve şüpheli erişim istekleri sistem tarafından otomatik olarak engellenmektedir.",
      color: "#FF1744",
      everyone: true
    },
    rules: {
      title: "📌 Sunucu Kuralları & Genel Bilgilendirme",
      message: "Sunucumuz içerisinde huzurlu bir ortam sağlamak için kurallara uymak zorunludur.\n\n- Saygılı iletişim kurun.\n- Reklam ve spam kesinlikle yasaktır.",
      color: "#00B0FF",
      everyone: false
    }
  };

  document.querySelectorAll('.template-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tplKey = btn.getAttribute('data-template');
      const tpl = templates[tplKey];
      if (!tpl) return;

      if (annTitleInput) annTitleInput.value = tpl.title;
      if (annMessageInput) annMessageInput.value = tpl.message;
      if (everyoneToggleInput) everyoneToggleInput.checked = tpl.everyone;

      const targetRadio = document.querySelector(`input[name="embedColor"][value="${tpl.color}"]`);
      if (targetRadio) targetRadio.checked = true;

      updateLiveDiscordPreview();
      showToast(`"${tpl.title}" şablonu dolduruldu!`, 'success');
    });
  });

  // --- Announcement Log History ---
  function getHistory() {
    try {
      const data = localStorage.getItem(HISTORY_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  function saveHistory(item) {
    const list = getHistory();
    list.unshift(item);
    if (list.length > 20) list.pop();
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(list));
    renderHistoryList();
  }

  function renderHistoryList() {
    const historyListContainer = document.getElementById('annHistoryList');
    if (!historyListContainer) return;

    const list = getHistory();
    if (list.length === 0) {
      historyListContainer.innerHTML = '<div class="history-empty">Henüz duyuru gönderilmedi.</div>';
      return;
    }

    historyListContainer.innerHTML = list.map((item, idx) => `
      <div class="history-item">
        <div class="history-meta-left">
          <div class="history-color-badge" style="background-color: ${item.color || '#5865F2'};"></div>
          <div class="history-details">
            <strong>${item.title || 'Duyuru'}</strong>
            <span>Yetkili: ${item.sender || 'Admin'} • ${item.date}</span>
          </div>
        </div>
        <button type="button" class="btn-sm btn-edit-profile resend-btn" data-index="${idx}">Tekrar Doldur</button>
      </div>
    `).join('');

    document.querySelectorAll('.resend-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-index'));
        const item = list[idx];
        if (item) {
          if (annTitleInput) annTitleInput.value = item.title || '';
          if (annMessageInput) annMessageInput.value = item.message || '';
          const targetRadio = document.querySelector(`input[name="embedColor"][value="${item.color}"]`);
          if (targetRadio) targetRadio.checked = true;
          updateLiveDiscordPreview();
          showToast('Geçmiş duyuru formu tekrar dolduruldu!', 'success');
        }
      });
    });
  }

  const clearHistoryBtn = document.getElementById('clearHistoryBtn');
  if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener('click', () => {
      localStorage.removeItem(HISTORY_STORAGE_KEY);
      renderHistoryList();
      showToast('Duyuru geçmişi temizlendi.', 'success');
    });
  }

  renderHistoryList();

  // --- DISCORD V2 WEBHOOK DISPATCHER ---
  const announcementForm = document.getElementById('announcementForm');

  if (announcementForm) {
    announcementForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const profile = getProfile();
      if (!profile) {
        showToast('Lütfen önce profilinizi oluşturun.', 'error');
        openSetupModal();
        return;
      }

      const annTitle = annTitleInput.value.trim();
      const annMessage = annMessageInput.value.trim();
      const annImageUrl = annImageUrlInput ? annImageUrlInput.value.trim() : '';
      const isEveryone = everyoneToggleInput.checked;
      const webhookUrl = document.getElementById('webhookUrlInput').value.trim();
      const selectedColorHex = document.querySelector('input[name="embedColor"]:checked')?.value || '#5865F2';

      if (!annMessage) {
        showToast('Lütfen duyuru metnini yazın.', 'error');
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

      const colorInt = parseInt(selectedColorHex.replace('#', ''), 16);

      // Discord API prohibits data: URIs for avatar_url
      let finalAvatarUrl = profile.avatarUrl;
      if (!finalAvatarUrl || finalAvatarUrl.startsWith('data:')) {
        finalAvatarUrl = 'https://cdn.discordapp.net/embed/avatars/0.png';
      }

      // Rich Embed Structure
      const embedObj = {
        title: annTitle || "📢 Yönetici Duyurusu",
        description: annMessage,
        color: colorInt,
        timestamp: new Date().toISOString(),
        footer: {
          text: `Milky Admin Panel • Yetkili: ${profile.username}`,
          icon_url: finalAvatarUrl
        }
      };

      if (annImageUrl) {
        embedObj.image = { url: annImageUrl };
      }

      // Discord Components V2 Container Components
      const v2ContainerComponents = [
        {
          type: ComponentType.Section, // 9
          components: [
            {
              type: ComponentType.TextDisplay, // 10
              content: `## ${annTitle || '📢 Yönetici Duyurusu'}\n\n${annMessage}`
            }
          ]
        }
      ];

      if (annImageUrl) {
        v2ContainerComponents.push({
          type: ComponentType.Separator, // 14
          divider: true,
          spacing: 1
        });
        v2ContainerComponents.push({
          type: ComponentType.Media, // 12
          items: [
            { media: { url: annImageUrl } }
          ]
        });
      }

      // Primary V2 Webhook Payload
      const v2Payload = {
        username: profile.username || "Milky Admin",
        avatar_url: finalAvatarUrl,
        content: isEveryone ? "@everyone" : null,
        flags: V2Flags.IsComponentsV2,
        components: [
          {
            type: ComponentType.Container, // 17
            accent_color: colorInt,
            components: v2ContainerComponents
          }
        ],
        embeds: [embedObj]
      };

      // Standard Fallback Payload (In case channel webhook doesn't support V2 flags)
      const standardPayload = {
        username: profile.username || "Milky Admin",
        avatar_url: finalAvatarUrl,
        content: isEveryone ? "@everyone" : null,
        embeds: [embedObj]
      };

      try {
        let response = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(v2Payload)
        });

        // Fallback to standard payload if V2 flags error occurs
        if (!response.ok && response.status !== 204) {
          console.warn("V2 Webhook dispatch failed, retrying with standard rich embed payload...");
          response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(standardPayload)
          });
        }

        if (response.ok || response.status === 204) {
          showToast('🎉 Duyuru Discord kanalına başarıyla gönderildi!', 'success');
          
          saveHistory({
            title: annTitle || 'Yönetici Duyurusu',
            message: annMessage,
            color: selectedColorHex,
            sender: profile.username,
            date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          });

          annMessageInput.value = '';
          annTitleInput.value = '';
          if (annImageUrlInput) annImageUrlInput.value = '';
          updateLiveDiscordPreview();
        } else {
          const errText = await response.text();
          console.error("Webhook Error Response:", errText);
          showToast(`Webhook hatası (${response.status}). Lütfen URL'yi kontrol edin.`, 'error');
        }
      } catch (err) {
        console.error("Webhook Dispatch Error:", err);
        showToast('Bağlantı hatası: Duyuru iletilemedi.', 'error');
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
