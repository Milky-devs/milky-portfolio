/* ==========================================================================
   MODERATION PANEL — DISCORD WEBHOOK ENGINE (BULLETPROOF HTTP 204 DISPATCH)
   ========================================================================== */

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
  toast.className = `toast-item ${type}`;
  toast.innerHTML = `
    <span class="material-symbols-outlined" style="color: ${type === 'success' ? '#10b981' : '#ef4444'}; font-size: 20px;">
      ${type === 'success' ? 'check_circle' : 'error'}
    </span>
    <div>${text}</div>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(30px)';
    toast.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
    setTimeout(() => toast.remove(), 200);
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
  const setupDiscordIdInput = document.getElementById('setupDiscordId');
  const setupPasswordInput = document.getElementById('setupPassword');
  const setupAvatarUrlInput = document.getElementById('setupAvatarUrl');
  const setupAvatarPreview = document.getElementById('setupAvatarPreview');

  const currentProfile = window.getProfile();
  if (currentProfile) {
    if (setupUsernameInput) setupUsernameInput.value = currentProfile.username || '';
    if (setupDiscordIdInput) setupDiscordIdInput.value = currentProfile.discordId || '';
    if (setupPasswordInput) setupPasswordInput.value = currentProfile.password || '';
    if (setupAvatarUrlInput) setupAvatarUrlInput.value = currentProfile.avatarUrl || '';
    if (setupAvatarPreview) setupAvatarPreview.src = currentProfile.avatarUrl || DEFAULT_AVATAR;
  }

  if (modalOverlay) {
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
};

// --- Close Setup Modal (Global) ---
window.closeSetupModal = function() {
  const modalOverlay = document.getElementById('profileSetupModal');
  if (modalOverlay) {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
};

// --- Live Preview Engine ---
window.updateLiveDiscordPreview = function() {
  const profile = window.getProfile() || { username: 'crystaltears0', discordId: '', avatarUrl: DEFAULT_AVATAR };
  let avatar = profile.avatarUrl;
  if (!avatar || typeof avatar !== 'string' || avatar.trim() === '' || avatar.startsWith('data:')) {
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
  const previewFooterText = document.getElementById('previewFooterText');

  if (previewAvatar) previewAvatar.src = avatar;
  if (previewUsername) previewUsername.textContent = profile.username || 'Sunucu Duyurusu';

  const now = new Date();
  const timeStr = `Bugün ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  if (previewTime) previewTime.textContent = timeStr;

  const everyoneToggleInput = document.getElementById('everyoneToggle');
  if (previewContentMention && everyoneToggleInput) {
    previewContentMention.style.display = everyoneToggleInput.checked ? 'inline-block' : 'none';
  }

  const selectedColorHex = document.querySelector('input[name="embedColor"]:checked')?.value || '#1E3A8A';
  if (previewEmbedColorBar) previewEmbedColorBar.style.backgroundColor = selectedColorHex;

  const annTitleInput = document.getElementById('annTitle');
  const titleVal = annTitleInput ? annTitleInput.value.trim() : '';
  if (previewTitle) previewTitle.textContent = titleVal || 'Sunucu Duyurusu';

  const annMessageInput = document.getElementById('annMessage');
  const messageVal = annMessageInput ? annMessageInput.value.trim() : '';
  if (previewMessage) previewMessage.textContent = messageVal || 'Duyuru metniniz burada görünür...';

  const annImageUrlInput = document.getElementById('annImageUrl');
  const imageVal = annImageUrlInput ? annImageUrlInput.value.trim() : '';
  if (previewImage) {
    if (imageVal && imageVal.startsWith('http')) {
      previewImage.src = imageVal;
      previewImage.style.display = 'block';
    } else {
      previewImage.style.display = 'none';
    }
  }

  if (previewFooterText) {
    const usernameStr = profile.username || 'crystaltears0';
    const tagStr = (profile.discordId && /^\d+$/.test(profile.discordId.trim())) 
      ? `@${profile.discordId.trim()}` 
      : `@${usernameStr}`;
    previewFooterText.innerHTML = `• <span class="dc-user-tag">${tagStr}</span> (${usernameStr}), Sunucu Yetkilisi`;
  }
};

// --- Apply Profile to DOM ---
window.applyProfileToDOM = function(profile) {
  if (!profile) return;
  const name = profile.username || 'Sunucu Yetkilisi';
  let avatar = profile.avatarUrl;
  if (!avatar || typeof avatar !== 'string' || avatar.trim() === '' || avatar.startsWith('data:')) {
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
  const setupDiscordIdInput = document.getElementById('setupDiscordId');
  const setupPasswordInput = document.getElementById('setupPassword');
  const setupAvatarUrlInput = document.getElementById('setupAvatarUrl');

  const username = setupUsernameInput ? setupUsernameInput.value.trim() : '';
  const discordId = setupDiscordIdInput ? setupDiscordIdInput.value.trim() : '';
  const password = setupPasswordInput ? setupPasswordInput.value.trim() : '';
  let avatarUrl = setupAvatarUrlInput ? setupAvatarUrlInput.value.trim() : '';

  if (!username || !password) {
    window.showToast('Lütfen kullanıcı adı ve şifrenizi doldurun.', 'error');
    return false;
  }

  if (!avatarUrl) {
    avatarUrl = DEFAULT_AVATAR;
  }

  const profileData = { username, discordId, password, avatarUrl };
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
    historyListContainer.innerHTML = '<div class="empty-history-box">Henüz duyuru gönderilmedi.</div>';
    return;
  }

  historyListContainer.innerHTML = list.map((item, idx) => `
    <div class="history-card-item">
      <div class="history-card-left">
        <div class="history-color-indicator" style="background-color: ${item.color || '#1E3A8A'};"></div>
        <div class="history-card-info">
          <strong>${item.title || 'Duyuru'}</strong>
          <span>Yetkili: ${item.sender || 'Sunucu Yetkilisi'} • ${item.date}</span>
        </div>
      </div>
      <button type="button" class="btn-ghost-danger resend-btn" data-index="${idx}" style="color: var(--text-main); border-color: var(--border-color);">Tekrar Doldur</button>
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

// --- BULLETPROOF DISCORD WEBHOOK DISPATCH HANDLER (HTTP 204 GUARANTEED) ---
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

  const annTitle = annTitleInput ? annTitleInput.value.trim() : 'Sunucu Duyurusu';
  const annMessage = annMessageInput ? annMessageInput.value.trim() : '';
  const annImageUrl = annImageUrlInput ? annImageUrlInput.value.trim() : '';
  const isEveryone = everyoneToggleInput ? everyoneToggleInput.checked : false;
  const webhookUrl = webhookUrlInput ? webhookUrlInput.value.trim() : '';
  const selectedColorHex = document.querySelector('input[name="embedColor"]:checked')?.value || '#1E3A8A';

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
    sendBtn.innerHTML = '<span class="material-symbols-outlined">hourglass_empty</span> Discord\'a Gönderiliyor...';
  }

  const colorInt = parseInt(selectedColorHex.replace('#', ''), 16) || 0x1E3A8A;

  let finalAvatarUrl = profile.avatarUrl;
  if (!finalAvatarUrl || typeof finalAvatarUrl !== 'string' || finalAvatarUrl.startsWith('data:') || !finalAvatarUrl.startsWith('http')) {
    finalAvatarUrl = DEFAULT_AVATAR;
  }

  // Author mention tag formatting
  let authorMentionStr = `**@${profile.username}** (${profile.username})`;
  if (profile.discordId && /^\d+$/.test(profile.discordId.trim())) {
    authorMentionStr = `<@${profile.discordId.trim()}> (${profile.username})`;
  }

  // Bulletproof Payload (DISCOHOOK / DISCORD WEBHOOK STANDARD)
  const embedObj = {
    title: annTitle || "Sunucu Duyurusu",
    description: annMessage,
    color: colorInt,
    timestamp: new Date().toISOString(),
    fields: [
      {
        name: "\u200b",
        value: `• ${authorMentionStr}, Sunucu Yetkilisi`,
        inline: false
      }
    ],
    footer: {
      text: `Sunucu Duyurusu • Yetkili: ${profile.username}`
    }
  };

  if (annImageUrl && annImageUrl.startsWith('http')) {
    embedObj.image = { url: annImageUrl };
  }

  const payload = {
    username: profile.username || "Sunucu Duyurusu",
    avatar_url: finalAvatarUrl,
    content: isEveryone ? "@everyone" : null,
    embeds: [embedObj]
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (response.ok || response.status === 204) {
      window.showToast('🎉 Duyuru Discord kanalına başarıyla gönderildi!', 'success');
      
      window.saveHistory({
        title: annTitle || 'Sunucu Duyurusu',
        message: annMessage,
        color: selectedColorHex,
        sender: profile.username,
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });

      if (annMessageInput) annMessageInput.value = '';
      if (annTitleInput) annTitleInput.value = 'Sunucu Duyurusu';
      if (annImageUrlInput) annImageUrlInput.value = '';
      window.updateLiveDiscordPreview();
    } else {
      const errTxt = await response.text();
      console.error("Webhook Error:", response.status, errTxt);
      window.showToast(`Webhook hatası (${response.status}). URL'yi kontrol edin.`, 'error');
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
  const avatarPills = document.querySelectorAll('.avatar-chip');

  if (togglePasswordBtn && setupPasswordInput) {
    togglePasswordBtn.addEventListener('click', () => {
      const isPass = setupPasswordInput.getAttribute('type') === 'password';
      setupPasswordInput.setAttribute('type', isPass ? 'text' : 'password');
      const eyeIcon = document.getElementById('eyeIcon');
      if (eyeIcon) {
        eyeIcon.textContent = isPass ? 'visibility_off' : 'visibility';
      }
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
      title: "Sunucu Bakımı",
      message: "Sunucumuz sistem bakımı ve optimizasyon çalışmaları için kısa süreliğine bakıma alınmıştır. Güncelleme tamamlandığında bilgilendirme yapılacaktır.\n\nAnlayışınız için teşekkür ederiz!",
      color: "#1E3A8A",
      everyone: true
    },
    update: {
      title: "Yeni Güncelleme Notları v2.0",
      message: "Sistemlerimizde büyük yenilikler yayınlandı!\n\n✨ Öne Çıkan Yenilikler:\n- Geliştirilmiş Canlı Yönetim Paneli\n- Yüksek Hızlı Sunucu Performansı & Güvenlik\n- Yeni Arayüz Temaları ve Hata Düzeltmeleri",
      color: "#050505",
      everyone: true
    },
    urgent: {
      title: "Acil Duyuru",
      message: "Önemli Güvenlik / Sistem Uyarısı:\n\nLütfen tüm yetkililer meşgul etmesin! Şüpheli erişim istekleri sistem tarafından engellenmektedir.",
      color: "#FFFFFF",
      everyone: true
    },
    rules: {
      title: "Sunucu Kuralları & Bilgilendirme",
      message: "Sunucumuz içerisinde huzurlu bir ortam sağlamak için kurallara uymak zorunludur.\n\n- Saygılı iletişim kurun.\n- Reklam ve spam kesinlikle yasaktır.",
      color: "#475569",
      everyone: false
    }
  };

  document.querySelectorAll('.template-card').forEach(btn => {
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
