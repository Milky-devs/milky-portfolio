/* ==========================================================================
   MODERATION PANEL — OFFICIAL DISCORD COMPONENTS V2 WEBHOOK ENGINE
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

// --- Helper: Validate URL ---
function isValidHttpUrl(string) {
  if (!string || typeof string !== 'string') return false;
  const trimmed = string.trim();
  return trimmed.startsWith('http://') || trimmed.startsWith('https://');
}

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
  if (!avatar || typeof avatar !== 'string' || avatar.trim() === '' || !isValidHttpUrl(avatar)) {
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
    if (isValidHttpUrl(imageVal)) {
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

  // V2 Component Buttons Live Preview Update
  const buttonsToggle = document.getElementById('buttonsToggle');
  const buttonsConfigRow = document.getElementById('buttonsConfigRow');
  const previewV2Buttons = document.getElementById('previewV2Buttons');
  const previewBtn1 = document.getElementById('previewBtn1');
  const previewBtn2 = document.getElementById('previewBtn2');

  const isButtons = buttonsToggle ? buttonsToggle.checked : false;
  if (buttonsConfigRow) buttonsConfigRow.style.display = isButtons ? 'block' : 'none';

  if (isButtons) {
    const b1Label = document.getElementById('btn1Label')?.value.trim() || '🌐 Web Sitemiz';
    const b1Url = document.getElementById('btn1Url')?.value.trim() || '';
    const b2Label = document.getElementById('btn2Label')?.value.trim() || '';
    const b2Url = document.getElementById('btn2Url')?.value.trim() || '';

    const validB1 = b1Label && isValidHttpUrl(b1Url);
    const validB2 = b2Label && isValidHttpUrl(b2Url);

    if (previewV2Buttons) previewV2Buttons.style.display = (validB1 || validB2) ? 'flex' : 'none';

    if (previewBtn1) {
      previewBtn1.textContent = b1Label;
      previewBtn1.style.display = validB1 ? 'inline-flex' : 'none';
    }
    if (previewBtn2) {
      previewBtn2.textContent = b2Label;
      previewBtn2.style.display = validB2 ? 'inline-flex' : 'none';
    }
  } else {
    if (previewV2Buttons) previewV2Buttons.style.display = 'none';
  }
};

// --- Apply Profile to DOM ---
window.applyProfileToDOM = function(profile) {
  if (!profile) return;
  const name = profile.username || 'Sunucu Yetkilisi';
  let avatar = profile.avatarUrl;
  if (!avatar || typeof avatar !== 'string' || avatar.trim() === '' || !isValidHttpUrl(avatar)) {
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

  if (!avatarUrl || !isValidHttpUrl(avatarUrl)) {
    avatarUrl = DEFAULT_AVATAR;
  }

  const profileData = { username, discordId, password, avatarUrl };
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profileData));

  window.applyProfileToDOM(profileData);
  window.closeSetupModal();
  window.showToast(`Profiliniz kaydedildi! Hoş geldiniz, ${username}.`, 'success');
  return false;
};

// --- Build Official Components V2 Payload (flags: 32768) ---
window.buildCurrentPayload = function() {
  const profile = window.getProfile() || { username: 'Sunucu Duyurusu', discordId: '', avatarUrl: DEFAULT_AVATAR };
  const annTitle = document.getElementById('annTitle')?.value.trim() || 'Sunucu Duyurusu';
  const annMessage = document.getElementById('annMessage')?.value.trim() || '';
  const annImageUrl = document.getElementById('annImageUrl')?.value.trim() || '';
  const isEveryone = document.getElementById('everyoneToggle')?.checked || false;
  const isButtons = document.getElementById('buttonsToggle')?.checked || false;

  const selectedColorHex = document.querySelector('input[name="embedColor"]:checked')?.value || '#1E3A8A';
  const colorInt = parseInt(selectedColorHex.replace('#', ''), 16) || 0x1E3A8A;

  let authorMentionStr = `**@${profile.username}** (${profile.username})`;
  if (profile.discordId && /^\d+$/.test(profile.discordId.trim())) {
    authorMentionStr = `<@${profile.discordId.trim()}> (${profile.username})`;
  }

  let finalAvatar = profile.avatarUrl;
  if (!isValidHttpUrl(finalAvatar)) {
    finalAvatar = DEFAULT_AVATAR;
  }

  // --- PERFECT DISCORD V2 CONTAINER STRUCTURE ---
  const containerChildComponents = [
    {
      type: 10, // TextDisplay (Title + Description)
      content: `# ${annTitle}\n\n${annMessage}`
    }
  ];

  if (isValidHttpUrl(annImageUrl)) {
    containerChildComponents.push({ type: 14, spacing: 1, divider: true });
    containerChildComponents.push({
      type: 12, // MediaGallery
      items: [{ media: { url: annImageUrl } }]
    });
  }

  containerChildComponents.push({ type: 14, spacing: 1, divider: true });
  containerChildComponents.push({
    type: 10, // TextDisplay (Author Footer)
    content: `• ${authorMentionStr}, Sunucu Yetkilisi`
  });

  if (isButtons) {
    const b1Label = document.getElementById('btn1Label')?.value.trim() || '🌐 Web Sitemiz';
    const b1Url = document.getElementById('btn1Url')?.value.trim() || '';
    const b2Label = document.getElementById('btn2Label')?.value.trim() || '';
    const b2Url = document.getElementById('btn2Url')?.value.trim() || '';

    const buttonsList = [];
    if (b1Label && isValidHttpUrl(b1Url)) buttonsList.push({ type: 2, style: 5, label: b1Label, url: b1Url.trim() });
    if (b2Label && isValidHttpUrl(b2Url)) buttonsList.push({ type: 2, style: 5, label: b2Label, url: b2Url.trim() });
    if (buttonsList.length > 0) {
      containerChildComponents.push({ type: 1, components: buttonsList });
    }
  }

  const rootComponents = [];
  if (isEveryone) {
    rootComponents.push({
      type: 10, // TextDisplay
      content: "@everyone"
    });
  }

  rootComponents.push({
    type: 17, // Container
    accent_color: colorInt,
    components: containerChildComponents
  });

  return {
    username: profile.username || "Sunucu Duyurusu",
    avatar_url: finalAvatar,
    flags: 32768, // IS_COMPONENTS_V2
    components: rootComponents
  };
};

// --- DISCORD WEBHOOK DISPATCH HANDLER ---
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

  const annMessageInput = document.getElementById('annMessage');
  const webhookUrlInput = document.getElementById('webhookUrlInput');

  const annMessage = annMessageInput ? annMessageInput.value.trim() : '';
  let webhookUrl = webhookUrlInput ? webhookUrlInput.value.trim() : '';

  if (!annMessage) {
    window.showToast('Lütfen duyuru metnini yazın.', 'error');
    return false;
  }

  if (!webhookUrl || !isValidHttpUrl(webhookUrl)) {
    window.showToast('Geçerli bir Discord Webhook URL girin.', 'error');
    return false;
  }

  // Mandatory V2 Webhook parameter ?with_components=true
  if (!webhookUrl.includes('with_components=true')) {
    webhookUrl += webhookUrl.includes('?') ? '&with_components=true' : '?with_components=true';
  }

  const sendBtn = document.getElementById('sendAnnBtn');
  const originalBtnHTML = sendBtn ? sendBtn.innerHTML : '';

  if (sendBtn) {
    sendBtn.disabled = true;
    sendBtn.style.opacity = '0.7';
    sendBtn.innerHTML = '<span class="material-symbols-outlined">hourglass_empty</span> V2 Konteyner Gönderiliyor...';
  }

  const payload = window.buildCurrentPayload();

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (response.ok || response.status === 200 || response.status === 204) {
      window.showToast('🎉 Pure Components V2 Konteyner duyurusu başarıyla gönderildi!', 'success');
      
      window.saveHistory({
        title: document.getElementById('annTitle')?.value.trim() || 'Sunucu Duyurusu',
        message: annMessage,
        color: document.querySelector('input[name="embedColor"]:checked')?.value || '#1E3A8A',
        sender: profile.username,
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });

      if (annMessageInput) annMessageInput.value = '';
      const annTitleInput = document.getElementById('annTitle');
      const annImageUrlInput = document.getElementById('annImageUrl');
      if (annTitleInput) annTitleInput.value = 'Sunucu Duyurusu';
      if (annImageUrlInput) annImageUrlInput.value = '';
      window.updateLiveDiscordPreview();
    } else {
      const errTxt = await response.text();
      console.error("Webhook Error:", response.status, errTxt);
      window.showToast(`Webhook yanıtı: ${response.status}. Lütfen URL'yi kontrol edin.`, 'error');
    }
  } catch (err) {
    console.error("Dispatch Exception:", err);
    window.showToast('Ağ/Tarayıcı Engeli: İletişim kurulamadı (AdBlocker kapatmayı deneyin).', 'error');
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
  const buttonsToggle = document.getElementById('buttonsToggle');
  const btn1Label = document.getElementById('btn1Label');
  const btn1Url = document.getElementById('btn1Url');
  const btn2Label = document.getElementById('btn2Label');
  const btn2Url = document.getElementById('btn2Url');
  const setupUsernameInput = document.getElementById('setupUsername');

  [
    annTitleInput, annMessageInput, annImageUrlInput, everyoneToggleInput,
    buttonsToggle, btn1Label, btn1Url, btn2Label, btn2Url,
    setupUsernameInput
  ].forEach(input => {
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
      message: "Sunucumuz sistem bakımı meşgul çalışmalar için kısa süreliğine bakıma alınmıştır. Güncelleme tamamlandığında bilgilendirme yapılacaktır.\n\nAnlayışınız için teşekkür ederiz!",
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
