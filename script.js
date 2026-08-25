/* =========================================
   MILKY.DEV — PURE ADMIN & DISCORD HUB ENGINE
========================================= */

document.addEventListener('DOMContentLoaded', () => {

  // --- Scroll Reveal Animation ---
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- Header Scroll Glass Effect ---
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.style.background = 'rgba(10, 10, 12, 0.95)';
      } else {
        header.style.background = 'rgba(10, 10, 12, 0.85)';
      }
    });
  }

  // =========================================
  // UTILITY: TOAST NOTIFICATIONS
  // =========================================
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

  // =========================================
  // PROFILE & ONBOARDING SYSTEM
  // =========================================
  const PROFILE_STORAGE_KEY = 'milky_admin_profile';
  const HISTORY_STORAGE_KEY = 'milky_ann_history';

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

  // Eye Icon Password Toggle
  if (togglePasswordBtn && setupPasswordInput) {
    togglePasswordBtn.addEventListener('click', () => {
      const type = setupPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      setupPasswordInput.setAttribute('type', type);
      togglePasswordBtn.textContent = type === 'password' ? '👁️' : '🙈';
    });
  }

  // Local File Upload Reader for Avatar
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
          showToast('Fotoğraf galeriden başarıyla yüklendi!', 'success');
          updateLiveDiscordPreview();
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Avatar Preset Pills Selection
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

  // Avatar URL Input typing listener
  if (setupAvatarUrlInput) {
    setupAvatarUrlInput.addEventListener('input', () => {
      const url = setupAvatarUrlInput.value.trim();
      if (url && setupAvatarPreview) {
        setupAvatarPreview.src = url;
        updateLiveDiscordPreview();
      }
    });
  }

  // Read Profile
  function getProfile() {
    try {
      const data = localStorage.getItem(PROFILE_STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  // Apply Profile to DOM Elements
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

  // Open/Close Modal
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

  // Initial Onboarding Check
  const savedProfile = getProfile();
  if (!savedProfile) {
    openSetupModal();
  } else {
    applyProfileToDOM(savedProfile);
  }

  if (openProfileBtn) openProfileBtn.addEventListener('click', openSetupModal);
  if (editProfileQuickBtn) editProfileQuickBtn.addEventListener('click', openSetupModal);

  // Save Profile Form
  if (profileForm) {
    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = setupUsernameInput.value.trim();
      const password = setupPasswordInput.value.trim();
      let avatarUrl = setupAvatarUrlInput.value.trim();

      if (!username || !password) {
        showToast('Lütfen kullanıcı adı ve şifrenizi doldurun.', 'error');
        return;
      }

      if (!avatarUrl) {
        avatarUrl = 'https://cdn.discordapp.net/embed/avatars/0.png';
      }

      const profileData = { username, password, avatarUrl };
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profileData));

      applyProfileToDOM(profileData);
      closeSetupModal();
      showToast(`Profiliniz başarıyla kaydedildi! Hoş geldiniz, ${username}.`, 'success');
    });
  }

  // =========================================
  // CANLI DISCORD MESAJ ÖNİZLEMESİ (LIVE PREVIEW ENGINE)
  // =========================================
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
    
    // Avatar & Username
    if (previewAvatar) previewAvatar.src = profile.avatarUrl;
    if (previewUsername) previewUsername.textContent = profile.username || 'Milky Admin';
    if (previewFooterAvatar) previewFooterAvatar.src = profile.avatarUrl;
    if (previewFooterText) previewFooterText.textContent = `Milky Admin Panel • Yetkili: ${profile.username || 'Admin'}`;

    // Timestamp
    const now = new Date();
    const timeStr = `Bugün ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    if (previewTime) previewTime.textContent = timeStr;

    // Mention
    if (previewContentMention && everyoneToggleInput) {
      previewContentMention.style.display = everyoneToggleInput.checked ? 'inline-block' : 'none';
    }

    // Embed Color
    const selectedColorHex = document.querySelector('input[name="embedColor"]:checked')?.value || '#5865F2';
    if (previewEmbedColorBar) previewEmbedColorBar.style.backgroundColor = selectedColorHex;

    // Title
    const titleVal = annTitleInput ? annTitleInput.value.trim() : '';
    if (previewTitle) previewTitle.textContent = titleVal || '📢 Yönetici Duyurusu';

    // Message Text
    const messageVal = annMessageInput ? annMessageInput.value.trim() : '';
    if (previewMessage) {
      previewMessage.textContent = messageVal || 'Duyuru metni buraya yazıldıkça canlı olarak bu alanda görünecektir...';
    }

    // Optional Banner Image
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

  // Attach Input Listeners for Real-time Update
  [annTitleInput, annMessageInput, annImageUrlInput, everyoneToggleInput, setupUsernameInput].forEach(input => {
    if (input) {
      input.addEventListener('input', updateLiveDiscordPreview);
      input.addEventListener('change', updateLiveDiscordPreview);
    }
  });

  document.querySelectorAll('input[name="embedColor"]').forEach(radio => {
    radio.addEventListener('change', updateLiveDiscordPreview);
  });

  // Initial Preview Draw
  updateLiveDiscordPreview();

  // =========================================
  // QUICK ANNOUNCEMENT TEMPLATES
  // =========================================
  const templates = {
    maintenance: {
      title: "🛠️ Sunucu Bakımı & Güncelleme",
      message: "Sunucumuz sistem optimizasyonları ve yeni güncellemeler için kısa süreli bakım moduna alınmıştır. Güncelleme tamamlandığında tekrar bilgilendirme yapılacaktır.\n\nAnlayışınız için teşekkür ederiz!",
      color: "#FFEA00",
      everyone: true
    },
    update: {
      title: "🎉 Yeni Güncelleme Notları v2.0",
      message: "Sistemlerimizde büyük yenilikler yayınlandı!\n\n✨ Öne Çıkan Yenilikler:\n- Geliştirilmiş Canlı Yönetim Paneli\n- Yüksek Hızlı Sunucu Performansı & Güvenlik\n- Yeni Arayüz Temaları ve Hata Düzeltmeleri\n\nKeyifli kullanımlar dileriz!",
      color: "#00E676",
      everyone: true
    },
    urgent: {
      title: "🚨 KANALSAL ACİL DUYURU",
      message: "Önemli Güvenlik / Sistem Uyarısı:\n\nLütfen tüm yetkililer ve üyeler dikkat etsin! Yetkisiz işlemler ve şüpheli erişim istekleri sistem tarafından otomatik olarak engellenmektedir. Güvenliğiniz için şifrelerinizi kimseyle paylaşmayın.",
      color: "#FF1744",
      everyone: true
    },
    rules: {
      title: "📌 Sunucu Kuralları & Genel Bilgilendirme",
      message: "Sunucumuz içerisinde huzurlu ve kaliteli bir ortam sağlamak için kurallara uymak zorunludur.\n\n- Saygılı ve seviyeli iletişim kurun.\n- Reklam ve spam kesinlikle yasaktır.\n- Yetkili ekibimizin uyarılarına riayet ediniz.",
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
      showToast(`"${tpl.title}" şablonu başarıyla dolduruldu!`, 'success');
    });
  });

  // =========================================
  // ANNOUNCEMENT LOG HISTORY
  // =========================================
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
    if (list.length > 20) list.pop(); // keep last 20
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(list));
    renderHistoryList();
  }

  function renderHistoryList() {
    const historyListContainer = document.getElementById('annHistoryList');
    if (!historyListContainer) return;

    const list = getHistory();
    if (list.length === 0) {
      historyListContainer.innerHTML = '<div class="history-empty">Henüz kaydedilmiş bir duyuru geçmişi bulunmuyor.</div>';
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

    // Re-send click handlers
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

  // =========================================
  // V2 DISCORD ANNOUNCEMENT WEBHOOK DISPATCHER
  // =========================================
  const announcementForm = document.getElementById('announcementForm');

  if (announcementForm) {
    announcementForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const profile = getProfile();
      if (!profile) {
        showToast('Duyuru göndermeden önce profil oluşturmanız gerekmektedir.', 'error');
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

      const colorInt = parseInt(selectedColorHex.replace('#', ''), 16);

      // Embed Object Construction
      const embedObj = {
        title: annTitle || "📢 Yönetici Duyurusu",
        description: annMessage,
        color: colorInt,
        timestamp: new Date().toISOString(),
        footer: {
          text: `Milky Admin Panel • Yetkili: ${profile.username}`,
          icon_url: profile.avatarUrl.startsWith('data:') ? undefined : profile.avatarUrl
        }
      };

      if (annImageUrl) {
        embedObj.image = { url: annImageUrl };
      }

      // V2 Webhook Payload
      const payload = {
        username: profile.username || "Milky Admin",
        avatar_url: profile.avatarUrl.startsWith('data:') ? undefined : profile.avatarUrl,
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
          showToast('🎉 Duyuru Discord kanalına başarıyla gönderildi!', 'success');
          
          // Save to Log History
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
          showToast('Webhook gönderimi başarısız. Lütfen URL\'yi kontrol edin.', 'error');
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
