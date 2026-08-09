/**
 * Door interaction: click → open animation → dark void → navigate.
 * Doors with a data-password attribute first ask for the password;
 * the open sequence only runs after a correct entry.
 * Loaded on the /doors hub page only.
 */

const ANIMATION_DURATION = 600;
const VOID_TRANSITION = 300;

function openDoor(door: HTMLAnchorElement, overlay: HTMLElement, href: string): void {
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
}

function showPasswordGate(
  door: HTMLAnchorElement,
  overlay: HTMLElement,
  href: string,
  expected: string
): void {
  // Only one gate at a time
  if (document.querySelector('.password-gate')) return;

  const gate = document.createElement('div');
  gate.className = 'password-gate';
  gate.innerHTML = `
    <div class="password-gate__panel" role="dialog" aria-modal="true" aria-label="This door is locked">
      <div class="password-gate__title">This door is locked</div>
      <input
        class="password-gate__input"
        type="password"
        inputmode="numeric"
        autocomplete="off"
        maxlength="16"
        aria-label="Password"
      />
      <div class="password-gate__hint">Enter the password</div>
    </div>
  `;
  document.body.appendChild(gate);

  const panel = gate.querySelector<HTMLElement>('.password-gate__panel')!;
  const input = gate.querySelector<HTMLInputElement>('.password-gate__input')!;
  input.focus();

  const close = (): void => {
    document.removeEventListener('keydown', onKeydown);
    gate.remove();
  };

  const submit = (): void => {
    if (input.value === expected) {
      close();
      openDoor(door, overlay, href);
    } else {
      panel.classList.remove('password-gate__panel--wrong');
      // Restart the shake animation
      void panel.offsetWidth;
      panel.classList.add('password-gate__panel--wrong');
      input.value = '';
      input.focus();
    }
  };

  const onKeydown = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') close();
  };

  input.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Enter') submit();
  });
  document.addEventListener('keydown', onKeydown);

  // Click outside the panel dismisses
  gate.addEventListener('click', (e: Event) => {
    if (e.target === gate) close();
  });
}

function init(): void {
  const overlay = document.getElementById('void-overlay');
  if (!overlay) return;

  const activeDoors = document.querySelectorAll<HTMLAnchorElement>('.door--active');

  activeDoors.forEach((door) => {
    door.addEventListener('click', (e: Event) => {
      e.preventDefault();

      const href = door.getAttribute('href');
      if (!href) return;

      const password = door.dataset.password;
      if (password) {
        showPasswordGate(door, overlay, href, password);
      } else {
        openDoor(door, overlay, href);
      }
    });
  });
}

// Run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
