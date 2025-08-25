(function () {
  const COUNTER = 101170266; // твой ID из кода Метрики

  // безопасный вызов ym
  function goal(name, params = {}) {
    try { window.ym && ym(COUNTER, 'reachGoal', name, params); } catch (e) {}
  }

  // ==== Скролл-глубина 25/50/75/90 ====
  const marks = {25:false, 50:false, 75:false, 90:false};
  function trackScroll() {
    const doc = document.documentElement;
    const depth = (window.scrollY + window.innerHeight) / doc.scrollHeight * 100;
    [25,50,75,90].forEach(p => {
      if (depth >= p && !marks[p]) { marks[p] = true; goal(`scroll_${p}`); }
    });
    if (marks[90]) window.removeEventListener('scroll', onScrollRaf);
  }
  let ticking = false;
  function onScrollRaf() {
    if (!ticking) {
      window.requestAnimationFrame(() => { trackScroll(); ticking = false; });
      ticking = true;
    }
  }

  // ==== Активное время: пинг каждые 30с, пока вкладка активна ====
  let ping = null;
  function startPing(){ if (!ping) ping = setInterval(() => goal('active_30s'), 30000); }
  function stopPing(){ if (ping){ clearInterval(ping); ping = null; } }
  function onVisibility(){ document.visibilityState === 'visible' ? startPing() : stopPing(); }

  // Делегирование по data-ym-goal
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-ym-goal]');
    if (el) goal(el.getAttribute('data-ym-goal'));
  });

  // init
  document.addEventListener('DOMContentLoaded', () => {
    // Скролл
    window.addEventListener('scroll', onScrollRaf, { passive: true });
    trackScroll(); 
    document.addEventListener('visibilitychange', onVisibility);
    onVisibility();

    // === Отслеживание видимости блока игры ===
    const gameSection = document.querySelector(".game__canvas-container");
    if (gameSection && "IntersectionObserver" in window) {
      let seen = false;
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !seen) {
            seen = true;
            window.analytics?.goal("game_seen"); // цель в Метрике
            observer.disconnect();
          }
        });
      }, { threshold: 0.3 }); // хотя бы 30% блока видно
      observer.observe(gameSection);
    }
  });

  // Экспорт хелпера для модулей
  window.analytics = { goal };
})();