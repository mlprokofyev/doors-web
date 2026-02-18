/**
 * Door interaction: click → open animation → dark void → navigate.
 * Loaded on the /doors hub page only.
 */

const ANIMATION_DURATION = 600;
const VOID_TRANSITION = 300;

function init(): void {
  const overlay = document.getElementById('void-overlay');
  if (!overlay) return;

  const activeDoors = document.querySelectorAll<HTMLAnchorElement>('.door--active');

  activeDoors.forEach((door) => {
    door.addEventListener('click', (e: Event) => {
      e.preventDefault();

      const href = door.getAttribute('href');
      if (!href) return;

      // Prevent double-click
      if (door.classList.contains('door--opening')) return;

      // Step 1: Play door open animation
      door.classList.add('door--opening');

      // Step 2: After animation, trigger dark void
      setTimeout(() => {
        overlay.classList.add('void-overlay--active');

        // Step 3: After void transition, navigate
        overlay.addEventListener(
          'transitionend',
          () => {
            window.location.href = href;
          },
          { once: true }
        );

        // Fallback: if transitionend doesn't fire, navigate anyway
        setTimeout(() => {
          window.location.href = href;
        }, VOID_TRANSITION + 100);
      }, ANIMATION_DURATION);
    });
  });
}

// Run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
