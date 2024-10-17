import type { Footnote } from '../use-cases'
import { addClass, hasClass, removeClass } from './element'
import {
  type Position,
  getLeftInPixels,
  getMaxHeight,
  repositionPopover,
  repositionTooltip,
} from './layout'

function styleText(button: any, footnoteContent: any) {
  const parentLine = button.closest('p') || button.parentElement;
  parentLine.style.fontWeight = 'bold';
  const allParagraphs = document.querySelectorAll('p');
  const title = document.querySelector('h1 h2 h3 h4 h5');

  allParagraphs.forEach(p => {
    if (p !== parentLine && p !== title && !footnoteContent.contains(p)) {
      p.style.opacity = '0.2';
      p.style.color = '#828282';
    }
  });
}

function resetTextStyle() {
  const allParagraphs = document.querySelectorAll('p');
  allParagraphs.forEach(p => {
    p.style.fontWeight = 'normal';
    p.style.opacity = '1';
    p.style.color = '';
  });
}

const CLASS_ACTIVE = 'is-active'
const CLASS_CHANGING = 'is-changing'
const CLASS_SCROLLABLE = 'is-scrollable'

export type FootnoteElements = Readonly<{
  id: string
  host: HTMLElement
  button: HTMLElement
  popover: HTMLElement
  content: HTMLElement
  wrapper: HTMLElement
}>

export function footnoteActions({
  id,
  button,
  content,
  host,
  popover,
  wrapper,
}: FootnoteElements): Footnote<HTMLElement> {
  let maxHeight = 0
  let position: Position = 'above'

  const isMounted = () => document.body.contains(popover)

  return {
    id,

    activate: (onActivate) => {
      button.setAttribute('aria-expanded', 'true')
      addClass(button, CLASS_CHANGING)
      addClass(button, CLASS_ACTIVE)
      button.insertAdjacentElement('afterend', popover)
      popover.style.maxWidth = document.body.clientWidth + 'px'
      maxHeight = getMaxHeight(content)
      styleText(button, content)
      onActivate?.(popover, button)
    },

    dismiss: (onDismiss) => {
      button.setAttribute('aria-expanded', 'false')
      addClass(button, CLASS_CHANGING)
      removeClass(button, CLASS_ACTIVE)
      removeClass(popover, CLASS_ACTIVE)
      resetTextStyle()
      onDismiss?.(popover, button)
    },

    isActive: () => hasClass(button, CLASS_ACTIVE),

    isReady: () => !hasClass(button, CLASS_CHANGING),

    ready: () => {
      addClass(popover, CLASS_ACTIVE)
      removeClass(button, CLASS_CHANGING)
    },

    remove: () => {
      popover.remove()
      removeClass(button, CLASS_CHANGING)
    },

    reposition: () => {
      if (isMounted()) {
        content.style.maxHeight = 'none';
        popover.style.left = "1px";
        popover.style.bottom = "1px";
        popover.style.top = "auto";
        popover.style.position = "fixed";
        popover.style.height = 'auto';
        const contentHeight = content.offsetHeight;
        popover.style.height = contentHeight + 'px';
        const maxHeight = window.innerHeight - 20;
        if (contentHeight > maxHeight) {
          content.style.maxHeight = maxHeight + 'px';
          addClass(popover, CLASS_SCROLLABLE);
          content.setAttribute("tabindex", "0");
        } else {
          removeClass(popover, CLASS_SCROLLABLE);
          content.removeAttribute("tabindex");
        }
      }
    },

    resize: () => {
      if (isMounted()) {
        const maxWidth = 1000;
        popover.style.maxWidth = maxWidth + "px";
        const availableWidth = window.innerWidth - 40;
        wrapper.style.width = Math.min(maxWidth, availableWidth) + "px";
        content.style.maxHeight = 'none';
        popover.style.height = 'auto';
        const contentHeight = content.offsetHeight;
        const contentWidth = content.offsetWidth;
        popover.style.height = contentHeight + 'px';
        popover.style.width = contentWidth + 'px';
        const maxHeight = window.innerHeight - 20;
        if (contentHeight > maxHeight) {
          content.style.maxHeight = maxHeight + 'px';
          addClass(popover, CLASS_SCROLLABLE);
          content.setAttribute("tabindex", "0");
        } else {
          removeClass(popover, CLASS_SCROLLABLE);
          content.removeAttribute("tabindex");
        }
      }
    },

    destroy: () => host.remove(),


  }
}
