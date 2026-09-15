document.addEventListener('DOMContentLoaded', () => {
  const state = {
    timeLeft: 25 * 60,
    isRunning: false,
    sessionType: 'work',
    completedPomodoros: 0,
    totalSecondsElapsed: 0,
    settings: {
      work: 25,
      shortBreak: 5,
      longBreak: 15,
      sessionsBeforeLongBreak: 4
    },
    theme: 'dark'
  };

  let intervalId = null;
  const circumference = 2 * Math.PI * 54;

  const elements = {
    timeDisplay: document.getElementById('time-display'),
    sessionBadge: document.getElementById('session-badge'),
    completedPomodoros: document.getElementById('completed-pomodoros'),
    totalTime: document.getElementById('total-time'),
    startPauseBtn: document.getElementById('start-pause-btn'),
    resetBtn: document.getElementById('reset-btn'),
    skipBtn: document.getElementById('skip-btn'),
    themeToggle: document.getElementById('theme-toggle'),
    settingsBtn: document.getElementById('settings-btn'),
    settingsModal: document.getElementById('settings-modal'),
    closeSettingsBtn: document.getElementById('close-settings'),
    settingsForm: document.getElementById('settings-form'),
    ringProgress: document.querySelector('.timer-ring-progress'),
    inputs: {
      work: document.getElementById('work-duration'),
      shortBreak: document.getElementById('short-break-duration'),
      longBreak: document.getElementById('long-break-duration'),
      sessionsBeforeLongBreak: document.getElementById('sessions-before-long-break')
    }
  };

  function init() {
    loadState();
    applyTheme();
    updateDisplay();
    setupEventListeners();
  }

  function loadState() {
    const saved = localStorage.getItem('pomodoroState');
    if (saved) {
      const parsed = JSON.parse(saved);
      Object.assign(state, parsed);
      // Reset running state on load to prevent auto-starting
      state.isRunning = false;
      if (intervalId) clearInterval(intervalId);
    }
  }

  function saveState() {
    localStorage.setItem('pomodoroState', JSON.stringify(state));
  }

  function applyTheme() {
    document.documentElement.setAttribute('data-theme', state.theme);
  }

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  function updateDisplay() {
    elements.timeDisplay.textContent = formatTime(state.timeLeft);
    elements.sessionBadge.textContent = state.sessionType === 'work' ? 'Work' : state.sessionType === 'shortBreak' ? 'Short Break' : 'Long Break';
    elements.sessionBadge.className = `session-badge ${state.sessionType}`;
    elements.completedPomodoros.textContent = state.completedPomodoros;
    elements.totalTime.textContent = formatTime(state.totalSecondsElapsed);
    elements.startPauseBtn.textContent = state.isRunning ? 'Pause' : 'Start';
    
    const progress = (state.timeLeft / (state.settings[state.sessionType] * 60)) * circumference;
    elements.ringProgress.style.strokeDashoffset = circumference - progress;
  }

  function playNotification() {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
    
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.5);
  }

  function switchSession() {
    playNotification();
    if (state.sessionType === 'work') {
      state.completedPomodoros++;
      if (state.completedPomodoros % state.settings.sessionsBeforeLongBreak === 0) {
        state.sessionType = 'longBreak';
      } else {
        state.sessionType = 'shortBreak';
      }
    } else {
      state.sessionType = 'work';
    }
    
    state.timeLeft = state.settings[state.sessionType] * 60;
    state.isRunning = false;
    if (intervalId) clearInterval(intervalId);
    saveState();
    updateDisplay();
  }

  function tick() {
    if (state.timeLeft > 0) {
      state.timeLeft--;
      state.totalSecondsElapsed++;
      updateDisplay();
      saveState();
    } else {
      switchSession();
    }
  }

  function toggleTimer() {
    if (state.isRunning) {
      clearInterval(intervalId);
      state.isRunning = false;
    } else {
      intervalId = setInterval(tick, 1000);
      state.isRunning = true;
    }
    saveState();
    updateDisplay();
  }

  function resetTimer() {
    clearInterval(intervalId);
    state.isRunning = false;
    state.timeLeft = state.settings[state.sessionType] * 60;
    saveState();
    updateDisplay();
  }

  function skipSession() {
    switchSession();
  }

  function toggleTheme() {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    applyTheme();
    saveState();
  }

  function openSettings() {
    elements.inputs.work.value = state.settings.work;
    elements.inputs.shortBreak.value = state.settings.shortBreak;
    elements.inputs.longBreak.value = state.settings.longBreak;
    elements.inputs.sessionsBeforeLongBreak.value = state.settings.sessionsBeforeLongBreak;
    elements.settingsModal.hidden = false;
    setTimeout(() => elements.settingsModal.classList.add('active'), 10);
  }

  function closeSettings() {
    elements.settingsModal.classList.remove('active');
    setTimeout(() => elements.settingsModal.hidden = true, 300);
  }

  function saveSettings(e) {
    e.preventDefault();
    state.settings.work = parseInt(elements.inputs.work.value) || 25;
    state.settings.shortBreak = parseInt(elements.inputs.shortBreak.value) || 5;
    state.settings.longBreak = parseInt(elements.inputs.longBreak.value) || 15;
    state.settings.sessionsBeforeLongBreak = parseInt(elements.inputs.sessionsBeforeLongBreak.value) || 4;
    
    if (!state.isRunning) {
      state.timeLeft = state.settings[state.sessionType] * 60;
    }
    
    saveState();
    updateDisplay();
    closeSettings();
  }

  function setupEventListeners() {
    elements.startPauseBtn.addEventListener('click', toggleTimer);
    elements.resetBtn.addEventListener('click', resetTimer);
    elements.skipBtn.addEventListener('click', skipSession);
    elements.themeToggle.addEventListener('click', toggleTheme);
    elements.settingsBtn.addEventListener('click', openSettings);
    elements.closeSettingsBtn.addEventListener('click', closeSettings);
    elements.settingsForm.addEventListener('submit', saveSettings);
    
    elements.settingsModal.addEventListener('click', (e) => {
      if (e.target === elements.settingsModal) closeSettings();
    });
  }

  init();
});