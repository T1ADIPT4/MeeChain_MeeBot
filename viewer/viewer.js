/**
 * MeeChain Badge Viewer with i18n Support
 * Internationalization-ready viewer for badges and milestones
 */

// Detect browser language
const browserLang = navigator.language || navigator.userLanguage;
const defaultLang = browserLang.startsWith('th') ? 'th' : 'en';

// Global i18n object
let i18n = {};
let currentLang = defaultLang;

/**
 * Load i18n translations
 * @param {string} lang - Language code ('th' or 'en')
 */
async function loadI18n(lang = defaultLang) {
  try {
    const response = await fetch(`./i18n/${lang}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load ${lang}.json`);
    }
    i18n = await response.json();
    currentLang = lang;
    console.log(`✅ Loaded ${lang} translations`);
    return i18n;
  } catch (error) {
    console.warn(`Failed to load ${lang} translations, using fallback:`, error);
    // Fallback to embedded English translations
    i18n = {
      milestone_complete: "Milestone completed",
      badge_uploaded: "Badge uploaded successfully",
      metadata_ready: "Metadata generated",
      fallback_message: "No milestone found",
      viewer_title: "MeeChain Badge Viewer",
      quest_id: "Quest ID",
      badge_id: "Badge ID",
      status: "Status",
      using_fallback: "🟠 Using Fallback Asset",
      system_ready: "System Ready",
      loading: "Loading...",
      error: "Error",
      no_badge_found: "No badge found",
      milestone_status: "Milestone Status",
      file_name: "File Name",
      file_size: "File Size",
      mime_type: "MIME Type"
    };
    return i18n;
  }
}

/**
 * Get translated text
 * @param {string} key - Translation key
 * @param {string} fallback - Fallback text if key not found
 */
function t(key, fallback = '') {
  return i18n[key] || fallback || key;
}

/**
 * Switch language
 * @param {string} lang - Language code ('th' or 'en')
 */
async function switchLanguage(lang) {
  await loadI18n(lang);
  updateUI();
}

/**
 * Update UI with current language
 */
function updateUI() {
  // Update all elements with data-i18n attribute
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(element => {
    const key = element.getAttribute('data-i18n');
    element.textContent = t(key);
  });
}

/**
 * Display badge with milestone information
 * @param {string} questId - Quest ID
 * @param {string} badgeId - Badge ID
 * @param {Object} milestoneData - Milestone data
 */
function displayBadge(questId, badgeId, milestoneData) {
  const container = document.getElementById('badge-container');
  
  if (!container) {
    console.error('Badge container not found');
    return;
  }
  
  const badgeHTML = `
    <div class="badge-card">
      <h2 data-i18n="viewer_title">${t('viewer_title')}</h2>
      <div class="badge-image-container">
        <img src="${milestoneData.imageUrl || '../copilot/assets/fallback/badge-placeholder.svg'}" 
             alt="Badge ${questId}" 
             class="badge-image">
      </div>
      <div class="badge-info">
        <div class="info-row">
          <span class="label" data-i18n="quest_id">${t('quest_id')}:</span>
          <span class="value">${questId}</span>
        </div>
        ${badgeId ? `
        <div class="info-row">
          <span class="label" data-i18n="badge_id">${t('badge_id')}:</span>
          <span class="value">${badgeId}</span>
        </div>
        ` : ''}
        <div class="info-row">
          <span class="label" data-i18n="milestone_status">${t('milestone_status')}:</span>
          <span class="value">${milestoneData.milestone || t('no_badge_found')}</span>
        </div>
        <div class="info-row">
          <span class="label" data-i18n="status">${t('status')}:</span>
          <span class="value" data-i18n="using_fallback">${t('using_fallback')}</span>
        </div>
      </div>
      <div class="language-switcher">
        <button onclick="switchLanguage('th')" class="${currentLang === 'th' ? 'active' : ''}">🇹🇭 ไทย</button>
        <button onclick="switchLanguage('en')" class="${currentLang === 'en' ? 'active' : ''}">🇬🇧 English</button>
      </div>
    </div>
  `;
  
  container.innerHTML = badgeHTML;
}

/**
 * Load milestone data from log
 */
async function loadMilestoneData() {
  try {
    const response = await fetch('../copilot/milestone.log');
    if (!response.ok) {
      return {
        milestone: t('fallback_message'),
        imageUrl: null
      };
    }
    
    const logContent = await response.text();
    const milestones = logContent.split('\n').filter(line => line.trim());
    
    return {
      milestone: milestones[milestones.length - 1] || t('no_badge_found'),
      milestoneCount: milestones.length,
      imageUrl: null
    };
  } catch (error) {
    console.warn('Failed to load milestone data:', error);
    return {
      milestone: t('fallback_message'),
      imageUrl: null
    };
  }
}

/**
 * Initialize viewer
 */
async function initViewer() {
  console.log('🚀 Initializing MeeChain Badge Viewer with i18n support...');
  
  // Load translations
  await loadI18n(defaultLang);
  console.log(`📝 Current language: ${currentLang}`);
  
  // Load milestone data
  const milestoneData = await loadMilestoneData();
  console.log('📊 Milestone data loaded:', milestoneData);
  
  // Display badge
  displayBadge('quest-001', null, milestoneData);
  
  console.log('✅ Viewer initialized successfully');
}

// Export functions for global access
if (typeof window !== 'undefined') {
  window.initViewer = initViewer;
  window.switchLanguage = switchLanguage;
  window.t = t;
  window.displayBadge = displayBadge;
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initViewer,
    loadI18n,
    switchLanguage,
    t,
    displayBadge,
    loadMilestoneData
  };
}
