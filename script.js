/* =========================================
   MILKY.DEV — DISCORD V2 ADMIN ENGINE v35
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

const PROFILE_STORAGE_KEY = 'milky_admin_profile';
const HISTORY_STORAGE_KEY = 'milky_ann_history';
const DEFAULT_AVATAR = 'https://cdn.discordapp.net/embed/avatars/0.png';

// --- Toast Notification Helper ---
window.showToast = function(text, type = 'success') {
  const toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) {
    alert(text);
    return;
  }

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
};

// --- Read Profile ---
window.getProfile = function() {
  try {
    const data = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!data) return null;
    const parsed = JSON.parse(data);
    if (!parsed || typeof parsed !== 'object') return null;
    return parsed;
  } catch (e) {
    return null;
  }
};

// --- Open Setup Modal (Global) ---
window.openSetupModal = function() {
  const modalOverlay = document.getElementById('profileSetupModal');
  const setupUsernameInput = document.getElementById('setupUsername');
  const setupPasswordInput = document.getElementById('setupPassword');
  const setupAvatarUrlInput = document.getElementById('setupAvatarUrl');
  const setupAvatarPreview = document.getElementById('setupAvatarPreview');

  const currentProfile = window.getProfile();
  if (currentProfile) {
    if (setupUsernameInput) setupUsernameInput.value = currentProfile.username || '';
    if (setupPasswordInput) setupPasswordInput.value = currentProfile.password || '';
    if (setupAvatarUrlInput) setupAvatarUrlInput.value = currentProfile.avatarUrl || '';
    if (setupAvatarPreview) setupAvatarPreview.src = currentProfile.avatarUrl || DEFAULT_AVATAR;
  }

  if (modalOverlay) {
    modalOverlay.classList.add('active');
    modalOverlay.style.display = 'flex';
    modalOverlay.style.opacity = '1';
    modalOverlay.style.pointerEvents = 'auto';
    document.body.style.overflow = 'hidden';
  }
};

// --- Close Setup Modal (Global) ---
window.closeSetupModal = function() {
  const modalOverlay = document.getElementById('profileSetupModal');
  if (modalOverlay) {
    modalOverlay.classList.remove('active');
    modalOverlay.style.display = 'none';
    modalOverlay.style.opacity = '0';
    modalOverlay.style.pointerEvents = 'none';
    document.body.style.overflow = '';
  }
};

// --- Live Preview Engine ---
window.updateLiveDiscordPreview = function() {
  const profile = window.getProfile() || { username: 'Milky Admin', avatarUrl: DEFAULT_AVATAR };
  let avatar = profile.avatarUrl;
  if (!avatar || typeof avatar !== 'string' || avatar.trim() === '') {
    avatar = DEFAULT_AVATAR;
  }

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

  if (previewAvatar) previewAvatar.src = avatar;
  if (previewUsername) previewUsername.textContent = profile.username || 'Milky Admin';
  if (previewFooterAvatar) previewFooterAvatar.src = avatar;
  if (previewFooterText) previewFooterText.textContent = `Milky Admin Panel • Yetkili: ${profile.username || 'Admin'}`;

  const now = new Date();
  const timeStr = `Bugün ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  if (previewTime) previewTime.textContent = timeStr;

  const everyoneToggleInput = document.getElementById('everyoneToggle');
  if (previewContentMention && everyoneToggleInput) {
    previewContentMention.style.display = everyoneToggleInput.checked ? 'inline-block' : 'none';
  }

  const selectedColorHex = document.querySelector('input[name="embedColor"]:checked')?.value || '#5865F2';
  if (previewEmbedColorBar) previewEmbedColorBar.style.backgroundColor = selectedColorHex;

  const annTitleInput = document.getElementById('annTitle');
  const titleVal = annTitleInput ? annTitleInput.value.trim() : '';
  if (previewTitle) previewTitle.textContent = titleVal || '📢 Yönetici Duyurusu';

  const annMessageInput = document.getElementById('annMessage');
  const messageVal = annMessageInput ? annMessageInput.value.trim() : '';
  if (previewMessage) previewMessage.textContent = messageVal || 'Duyuru metniniz burada görünür...';

  const annImageUrlInput = document.getElementById('annImageUrl');
  const imageVal = annImageUrlInput ? annImageUrlInput.value.trim() : '';
  if (previewImage) {
    if (imageVal) {
      previewImage.src = imageVal;
      previewImage.style.display = 'block';
    } else {
      previewImage.style.display = 'none';
    }
  }
};

// --- Apply Profile to UI ---
window.applyProfileToDOM = function(profile) {
  if (!profile) return;
  const name = profile.username || 'Admin';
  let avatar = profile.avatarUrl;
  if (!avatar || typeof avatar !== 'string' || avatar.trim() === '') {
    avatar = DEFAULT_AVATAR;
  }

  const headerUserAvatar = document.getElementById('headerUserAvatar');
  const headerUsername = document.getElementById('headerUsername');
  const activeUserAvatar = document.getElementById('activeUserAvatar');
  const activeUsername = document.getElementById('activeUsername');

  if (headerUserAvatar) headerUserAvatar.src = avatar;
  if (headerUsername) headerUsername.textContent = name;
  if (activeUserAvatar) activeUserAvatar.src = avatar;
  if (activeUsername) activeUsername.textContent = name;

  window.updateLiveDiscordPreview();
};

// --- Profile Form Submit Handler ---
window.handleProfileSubmit = function(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  const setupUsernameInput = document.getElementById('setupUsername');
  const setupPasswordInput = document.getElementById('setupPassword');
  const setupAvatarUrlInput = document.getElementById('setupAvatarUrl');

  const username = setupUsernameInput ? setupUsernameInput.value.trim() : '';
  const password = setupPasswordInput ? setupPasswordInput.value.trim() : '';
  let avatarUrl = setupAvatarUrlInput ? setupAvatarUrlInput.value.trim() : '';

  if (!username || !password) {
    window.showToast('Lütfen kullanıcı adı ve şifrenizi doldurun.', 'error');
    return false;
  }

  if (!avatarUrl) {
    avatarUrl = DEFAULT_AVATAR;
  }

  const profileData = { username, password, avatarUrl };
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profileData));

  window.applyProfileToDOM(profileData);
  window.closeSetupModal();
  window.showToast(`Profiliniz kaydedildi! Hoş geldiniz, ${username}.`, 'success');
  return false;
};

// --- History Log Management ---
window.getHistory = function() {
  try {
    const data = localStorage.getItem(HISTORY_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

window.saveHistory = function(item) {
  const list = window.getHistory();
  list.unshift(item);
  if (list.length > 20) list.pop();
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(list));
  window.renderHistoryList();
};

window.renderHistoryList = function() {
  const historyListContainer = document.getElementById('annHistoryList');
  if (!historyListContainer) return;

  const list = window.getHistory();
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
        const annTitleInput = document.getElementById('annTitle');
        const annMessageInput = document.getElementById('annMessage');
        if (annTitleInput) annTitleInput.value = item.title || '';
        if (annMessageInput) annMessageInput.value = item.message || '';
        const targetRadio = document.querySelector(`input[name="embedColor"][value="${item.color}"]`);
        if (targetRadio) targetRadio.checked = true;
        window.updateLiveDiscordPreview();
        window.showToast('Geçmiş duyuru formu tekrar dolduruldu!', 'success');
      }
    });
  });
};

// --- Webhook Announcement Dispatch Handler ---
window.handleAnnouncementSubmit = async function(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  const profile = window.getProfile();
  if (!profile) {
    window.showToast('Lütfen önce profilinizi oluşturun.', 'error');
    window.openSetupModal();
    return false;
  }

  const annTitleInput = document.getElementById('annTitle');
  const annMessageInput = document.getElementById('annMessage');
  const annImageUrlInput = document.getElementById('annImageUrl');
  const everyoneToggleInput = document.getElementById('everyoneToggle');
  const webhookUrlInput = document.getElementById('webhookUrlInput');

  const annTitle = annTitleInput ? annTitleInput.value.trim() : '';
  const annMessage = annMessageInput ? annMessageInput.value.trim() : '';
  const annImageUrl = annImageUrlInput ? annImageUrlInput.value.trim() : '';
  const isEveryone = everyoneToggleInput ? everyoneToggleInput.checked : false;
  const webhookUrl = webhookUrlInput ? webhookUrlInput.value.trim() : '';
  const selectedColorHex = document.querySelector('input[name="embedColor"]:checked')?.value || '#5865F2';

  if (!annMessage) {
    window.showToast('Lütfen duyuru metnini yazın.', 'error');
    return false;
  }

  if (!webhookUrl) {
    window.showToast('Geçerli bir Discord Webhook URL girin.', 'error');
    return false;
  }

  const sendBtn = document.getElementById('sendAnnBtn');
  const originalBtnHTML = sendBtn ? sendBtn.innerHTML : '';

  if (sendBtn) {
    sendBtn.disabled = true;
    sendBtn.style.opacity = '0.7';
    sendBtn.innerHTML = '⏳ Discord\'a Gönderiliyor...';
  }

  const colorInt = parseInt(selectedColorHex.replace('#', ''), 16);

  let finalAvatarUrl = profile.avatarUrl;
  if (!finalAvatarUrl || typeof finalAvatarUrl !== 'string' || finalAvatarUrl.startsWith('data:')) {
    finalAvatarUrl = DEFAULT_AVATAR;
  }

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

  const v2ContainerComponents = [
    {
      type: ComponentType.Section,
      components: [
        {
          type: ComponentType.TextDisplay,
          content: `## ${annTitle || '📢 Yönetici Duyurusu'}\n\n${annMessage}`
        }
      ]
    }
  ];

  if (annImageUrl) {
    v2ContainerComponents.push({
      type: ComponentType.Separator,
      divider: true,
      spacing: 1
    });
    v2ContainerComponents.push({
      type: ComponentType.Media,
      items: [{ media: { url: annImageUrl } }]
    });
  }

  const v2Payload = {
    username: profile.username || "Milky Admin",
    avatar_url: finalAvatarUrl,
    content: isEveryone ? "@everyone" : null,
    flags: V2Flags.IsComponentsV2,
    components: [
      {
        type: ComponentType.Container,
        accent_color: colorInt,
        components: v2ContainerComponents
      }
    ],
    embeds: [embedObj]
  };

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

    if (!response.ok && response.status !== 204) {
      response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(standardPayload)
      });
    }

    if (response.ok || response.status === 204) {
      window.showToast('🎉 Duyuru Discord kanalına başarıyla gönderildi!', 'success');
      
      window.saveHistory({
        title: annTitle || 'Yönetici Duyurusu',
        message: annMessage,
        color: selectedColorHex,
        sender: profile.username,
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });

      if (annMessageInput) annMessageInput.value = '';
      if (annTitleInput) annTitleInput.value = '';
      if (annImageUrlInput) annImageUrlInput.value = '';
      window.updateLiveDiscordPreview();
    } else {
      window.showToast(`Webhook hatası (${response.status}). Lütfen URL'yi kontrol edin.`, 'error');
    }
  } catch (err) {
    console.error("Dispatch Error:", err);
    window.showToast('Bağlantı hatası: Duyuru iletilemedi.', 'error');
  } finally {
    if (sendBtn) {
      sendBtn.disabled = false;
      sendBtn.style.opacity = '1';
      sendBtn.innerHTML = originalBtnHTML;
    }
  }

  return false;
};

// --- DOM Content Loaded Init ---
document.addEventListener('DOMContentLoaded', () => {

  const setupPasswordInput = document.getElementById('setupPassword');
  const togglePasswordBtn = document.getElementById('togglePasswordBtn');
  
  const setupAvatarFileInput = document.getElementById('setupAvatarFile');
  const setupAvatarUrlInput = document.getElementById('setupAvatarUrl');
  const setupAvatarPreview = document.getElementById('setupAvatarPreview');
  const avatarPills = document.querySelectorAll('.avatar-pill');

  if (togglePasswordBtn && setupPasswordInput) {
    togglePasswordBtn.addEventListener('click', () => {
      const type = setupPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      setupPasswordInput.setAttribute('type', type);
      togglePasswordBtn.textContent = type === 'password' ? '👁️' : '🙈';
    });
  }

  if (setupAvatarFileInput) {
    setupAvatarFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        if (!file.type.startsWith('image/')) {
          window.showToast('Lütfen geçerli bir resim dosyası seçin.', 'error');
          return;
        }
        const reader = new FileReader();
        reader.onload = function(evt) {
          const dataUrl = evt.target.result;
          if (setupAvatarUrlInput) setupAvatarUrlInput.value = dataUrl;
          if (setupAvatarPreview) setupAvatarPreview.src = dataUrl;
          avatarPills.forEach(p => p.classList.remove('active'));
          window.showToast('Fotoğraf yüklendi!', 'success');
          window.updateLiveDiscordPreview();
        };
        reader.readAsDataURL(file);
      }
    });
  }

  avatarPills.forEach(pill => {
    pill.addEventListener('click', () => {
      avatarPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const url = pill.getAttribute('data-url');
      if (setupAvatarUrlInput && url) {
        setupAvatarUrlInput.value = url;
        if (setupAvatarPreview) setupAvatarPreview.src = url;
        window.updateLiveDiscordPreview();
      }
    });
  });

  if (setupAvatarUrlInput) {
    setupAvatarUrlInput.addEventListener('input', () => {
      const url = setupAvatarUrlInput.value.trim();
      if (url && setupAvatarPreview) {
        setupAvatarPreview.src = url;
        window.updateLiveDiscordPreview();
      }
    });
  }

  const savedProfile = window.getProfile();
  if (!savedProfile) {
    window.openSetupModal();
  } else {
    window.applyProfileToDOM(savedProfile);
  }

  const annTitleInput = document.getElementById('annTitle');
  const annMessageInput = document.getElementById('annMessage');
  const annImageUrlInput = document.getElementById('annImageUrl');
  const everyoneToggleInput = document.getElementById('everyoneToggle');
  const setupUsernameInput = document.getElementById('setupUsername');

  [annTitleInput, annMessageInput, annImageUrlInput, everyoneToggleInput, setupUsernameInput].forEach(input => {
    if (input) {
      input.addEventListener('input', window.updateLiveDiscordPreview);
      input.addEventListener('change', window.updateLiveDiscordPreview);
    }
  });

  document.querySelectorAll('input[name="embedColor"]').forEach(radio => {
    radio.addEventListener('change', window.updateLiveDiscordPreview);
  });

  window.updateLiveDiscordPreview();

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

      window.updateLiveDiscordPreview();
      window.showToast(`"${tpl.title}" şablonu dolduruldu!`, 'success');
    });
  });

  const clearHistoryBtn = document.getElementById('clearHistoryBtn');
  if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener('click', () => {
      localStorage.removeItem(HISTORY_STORAGE_KEY);
      window.renderHistoryList();
      window.showToast('Duyuru geçmişi temizlendi.', 'success');
    });
  }

  window.renderHistoryList();
});
