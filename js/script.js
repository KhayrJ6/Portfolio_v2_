// Mobile menu toggle
const menuBtn = document.getElementById('menu-btn');
const menuPanel = document.getElementById('menu');
if (menuBtn && menuPanel) {
  menuBtn.addEventListener('click', () => {
    const isOpen = menuBtn.classList.toggle('open');
    menuPanel.hidden = !isOpen;
    menuBtn.setAttribute('aria-expanded', String(isOpen));
  });
}

// Theme toggle (dark is default; preference persisted where storage is available;
// falls back to system preference; never lets a storage error block the rest of the page)
const root = document.documentElement;
const THEME_KEY = 'khairat-theme';

function applyTheme(theme) {
  if (theme === 'light') {
    root.setAttribute('data-theme', 'light');
  } else {
    root.removeAttribute('data-theme');
  }
}

function readStoredTheme() {
  try {
    return localStorage.getItem(THEME_KEY);
  } catch (err) {
    return null; // storage blocked (e.g. file:// origin) — fall back silently
  }
}

function writeStoredTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (err) {
    // storage blocked — theme still applies for this page view, just won't persist
  }
}

(function initTheme() {
  const saved = readStoredTheme();
  if (saved) {
    applyTheme(saved);
  } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    applyTheme('light');
  }
})();

document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const isLight = root.getAttribute('data-theme') === 'light';
    const next = isLight ? 'dark' : 'light';
    applyTheme(next);
    writeStoredTheme(next);
  });
});

// Experience tabs
const expTabs = document.querySelectorAll('.exp__tab');
const expPanels = document.querySelectorAll('.exp__panel');
expTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const target = tab.getAttribute('data-tab');
    expTabs.forEach((t) => t.setAttribute('aria-selected', String(t === tab)));
    expPanels.forEach((p) => p.classList.toggle('is-active', p.id === target));
  });
});

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && revealEls.length) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-visible'));
}
