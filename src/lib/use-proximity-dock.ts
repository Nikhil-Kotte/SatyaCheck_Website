import { useEffect, type RefObject } from 'react';

type DockOptions = {
  /** Pointer distance (px) at which an item starts to respond. */
  proximity?: number;
  spring?: number;
  damping?: number;
  /** Extra width (px) an item gains at full influence. */
  maxWidth?: number;
  /** Extra height (px) an item gains at full influence. */
  maxHeight?: number;
  /** How far (px) a fully-influenced item drops. */
  drop?: number;
};

type ItemState = { el: HTMLElement; link: HTMLElement; bg: HTMLElement | null; rest: number; target: number; value: number; velocity: number };

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const smoothstep = (t: number) => t * t * (3 - 2 * t);

// Desktop, fine pointer, motion allowed. Everywhere else the nav stays static.
const DOCK_QUERY = '(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';

/**
 * Proximity-spring dock (Animated Top Dock template). Each `[data-dock-item]`
 * inside `listRef` swells toward the pointer: influence is a smoothstep of
 * horizontal distance, integrated per item with a damped spring. Keyboard focus
 * mirrors the pointer so tabbing gets the same feedback.
 *
 * Markup per item: `li[data-dock-item] > a[data-dock-link] > span[data-dock-bg]`.
 */
export function useProximityDock(
  listRef: RefObject<HTMLElement | null>,
  { proximity = 122, spring = 0.19, damping = 0.7, maxWidth = 17, maxHeight = 16, drop = 3.5 }: DockOptions = {}
) {
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const host = (list.closest('nav') as HTMLElement | null) ?? list;
    const mq = window.matchMedia(DOCK_QUERY);

    let items: ItemState[] = [];
    let frame = 0;
    let pointerX: number | null = null;
    let focusIndex = -1;

    const paint = (s: ItemState) => {
      const v = s.value;
      s.el.style.marginInline = `${(v * maxWidth) / 2}px`;
      s.link.style.transform = `translate3d(0, ${v * drop}px, 0)`;
      if (s.bg) {
        s.bg.style.inset = `${(-v * maxHeight) / 2}px ${(-v * maxWidth) / 2}px`;
        s.bg.style.opacity = String(clamp(v * 1.4, 0, 1));
        s.bg.style.transition = 'none'; // the spring is the transition
      }
    };

    const clear = () => {
      items.forEach((s) => {
        s.el.style.marginInline = '';
        s.link.style.transform = '';
        if (s.bg) {
          s.bg.style.inset = '';
          s.bg.style.opacity = '';
          s.bg.style.transition = '';
        }
      });
    };

    // Rest centres are stored relative to the list's own centre. The list sits
    // in a justify-between row, so its centre does not move as items grow.
    const measure = () => {
      const els = Array.from(list.querySelectorAll<HTMLElement>('[data-dock-item]'));
      const prev = items;
      items.forEach((s) => (s.value = 0));
      clear();
      const lr = list.getBoundingClientRect();
      const mid = lr.left + lr.width / 2;
      items = els.map((el, i) => {
        const r = el.getBoundingClientRect();
        const link = el.querySelector<HTMLElement>('[data-dock-link]') ?? el;
        return {
          el,
          link,
          bg: el.querySelector<HTMLElement>('[data-dock-bg]'),
          rest: r.left + r.width / 2 - mid,
          target: 0,
          value: 0,
          velocity: prev[i]?.velocity ?? 0,
        };
      });
    };

    const retarget = () => {
      const lr = list.getBoundingClientRect();
      const mid = lr.left + lr.width / 2;
      const x = focusIndex >= 0 && items[focusIndex] ? mid + items[focusIndex].rest : pointerX;
      items.forEach((s) => {
        s.target = x == null ? 0 : smoothstep(clamp(1 - Math.abs(x - (mid + s.rest)) / proximity, 0, 1));
      });
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const tick = () => {
      frame = 0;
      let moving = false;
      items.forEach((s) => {
        s.velocity += (s.target - s.value) * spring;
        s.velocity *= damping;
        s.value += s.velocity;
        if (Math.abs(s.velocity) < 0.0005 && Math.abs(s.target - s.value) < 0.0005) {
          s.value = s.target;
          s.velocity = 0;
        } else moving = true;
        paint(s);
      });
      if (moving) frame = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      pointerX = e.clientX;
      retarget();
    };
    const onLeave = () => {
      pointerX = null;
      retarget();
    };
    const onFocusIn = (e: FocusEvent) => {
      focusIndex = items.findIndex((s) => s.el.contains(e.target as Node));
      retarget();
    };
    const onFocusOut = (e: FocusEvent) => {
      if (list.contains(e.relatedTarget as Node)) return;
      focusIndex = -1;
      retarget();
    };

    let attached = false;
    const attach = () => {
      if (attached) return;
      attached = true;
      measure();
      host.addEventListener('pointermove', onMove);
      host.addEventListener('pointerleave', onLeave);
      list.addEventListener('focusin', onFocusIn);
      list.addEventListener('focusout', onFocusOut);
      window.addEventListener('resize', measure);
    };
    const detach = () => {
      if (!attached) return;
      attached = false;
      cancelAnimationFrame(frame);
      frame = 0;
      pointerX = null;
      focusIndex = -1;
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerleave', onLeave);
      list.removeEventListener('focusin', onFocusIn);
      list.removeEventListener('focusout', onFocusOut);
      window.removeEventListener('resize', measure);
      clear();
    };
    const sync = () => (mq.matches ? attach() : detach());

    sync();
    mq.addEventListener('change', sync);
    // Webfonts change label widths after first paint.
    document.fonts?.ready.then(() => attached && measure());

    return () => {
      mq.removeEventListener('change', sync);
      detach();
    };
  }, [listRef, proximity, spring, damping, maxWidth, maxHeight, drop]);
}
