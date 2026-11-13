import { onMounted, type Ref } from 'vue';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { INTRO_ENTER_GATE, SCROLL_ENTER_GATE } from './motionConstants';
import { onIntroFinished, registerScrollSetup } from './scrollEngine';
import { hideRevealPieces, playRevealPieces } from './textReveal';

type RevealCause = 'intro' | 'scroll';

const SCROLL_REVEAL_START = 'top 85%';

export function useSectionReveal(root: Ref<HTMLElement | null>, cause: RevealCause = 'scroll'): void {
  onMounted(() => {
    const element = root.value;
    if (!element) return;
    hideRevealPieces(element);
    if (cause === 'intro') {
      onIntroFinished(() => playRevealPieces(element, INTRO_ENTER_GATE));
      return;
    }
    registerScrollSetup(() => {
      ScrollTrigger.create({
        trigger: element,
        start: SCROLL_REVEAL_START,
        once: true,
        onEnter: () => playRevealPieces(element, SCROLL_ENTER_GATE),
      });
    });
  });
}
