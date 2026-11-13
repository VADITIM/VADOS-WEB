import { onBeforeUnmount, onMounted, type Ref } from 'vue';

function fitToWidth(element: HTMLElement): void {
  const frame = element.parentElement;
  if (!frame) return;
  element.style.fontSize = '';
  const naturalSize = parseFloat(getComputedStyle(element).fontSize);
  const naturalWidth = element.offsetWidth;
  if (naturalWidth === 0) return;
  element.style.fontSize = `${(naturalSize * frame.clientWidth) / naturalWidth}px`;
}

export function useFullWidthText(element: Ref<HTMLElement | null>): void {
  let observer: ResizeObserver | null = null;

  onMounted(() => {
    const target = element.value;
    const frame = target?.parentElement;
    if (!target || !frame) return;
    observer = new ResizeObserver(() => fitToWidth(target));
    observer.observe(frame);
    document.fonts.ready.then(() => fitToWidth(target));
  });

  onBeforeUnmount(() => observer?.disconnect());
}
