import { Comp } from 'illutions';

import type { BakeMode } from '../objs/furniture';
import css from './style/toggle.css?inline';
import html from './html/toggle.html?raw';

export class Toggle extends Comp {
  private mode: BakeMode = 'combined';
  private button: HTMLButtonElement | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  // Initialize the switch whenever the component enters the page
  public connectedCallback(): void {
    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = html;
    this.button = this.shadowRoot.querySelector('button');

    const style = document.createElement('style');
    style.textContent = css;
    this.shadowRoot.prepend(style);

    this.button?.addEventListener('click', this.toggleMode);
    this.addEventListener('pointerdown', this.stopCanvasPointerPropagation);
    this.addEventListener('pointermove', this.stopCanvasPointerPropagation);
    this.addEventListener('pointerup', this.stopCanvasPointerPropagation);

    this.updateButton();
  }

  // Remove event listeners whenever the component leaves the page
  public disconnectedCallback(): void {
    this.button?.removeEventListener('click', this.toggleMode);
    this.removeEventListener('pointerdown', this.stopCanvasPointerPropagation);
    this.removeEventListener('pointermove', this.stopCanvasPointerPropagation);
    this.removeEventListener('pointerup', this.stopCanvasPointerPropagation);
  }

  // Synchronize the switch with the active rendering mode
  public setMode(mode: BakeMode): void {
    this.mode = mode;
    this.updateButton();
  }

  // Toggle the rendering mode without forwarding input to the canvas
  private toggleMode = (event: MouseEvent): void => {
    event.stopPropagation();

    const mode: BakeMode = this.mode === 'combined' ? 'lightmap' : 'combined';
    this.setMode(mode);
    this.events.send({ type: 'Toggle_Mode_Changed', mode });
  };

  // Reflect the active mode through accessible button state
  private updateButton(): void {
    if (!this.button) return;

    const lightmapSelected = this.mode === 'lightmap';
    this.button.setAttribute('aria-checked', String(lightmapSelected));
    this.button.dataset.mode = this.mode;
  }

  private stopCanvasPointerPropagation = (event: PointerEvent): void => {
    event.stopPropagation();
  };
}
