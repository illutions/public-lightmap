import { Comp } from 'illutions';

import type { Mode } from '../objs/furniture';
import css from './style/toggle.css?inline';
import html from './html/toggle.html?raw';

const modes = [
  { value: 'combined', label: 'Combined' },
  { value: 'lightmap', label: 'Lightmap' },
  { value: 'realtime', label: 'Realtime' },
] as const satisfies readonly { value: Mode; label: string }[];

export class Toggle extends Comp {
  private modeIndex = 0;
  private buttons: HTMLButtonElement[] = [];
  private modeLabel: HTMLElement | null = null;

  constructor() {
    super();
    // Isolate the component markup and styles from the host page
    this.attachShadow({ mode: 'open' });
  }

  // Initialize the mode control whenever the component enters the page
  public connectedCallback(): void {
    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = html;
    this.buttons = Array.from(this.shadowRoot.querySelectorAll<HTMLButtonElement>('button[data-step]'));
    this.modeLabel = this.shadowRoot.getElementById('mode');

    const style = document.createElement('style');
    style.textContent = css;
    this.shadowRoot.prepend(style);

    for (const button of this.buttons)
      button.addEventListener('click', this.stepMode);

    this.addEventListener('pointerdown', this.stopCanvasPointerPropagation);
    this.addEventListener('pointermove', this.stopCanvasPointerPropagation);
    this.addEventListener('pointerup', this.stopCanvasPointerPropagation);

    this.updateControl();
  }

  // Remove event listeners whenever the component leaves the page
  public disconnectedCallback(): void {
    for (const button of this.buttons)
      button.removeEventListener('click', this.stepMode);

    this.removeEventListener('pointerdown', this.stopCanvasPointerPropagation);
    this.removeEventListener('pointermove', this.stopCanvasPointerPropagation);
    this.removeEventListener('pointerup', this.stopCanvasPointerPropagation);
  }

  // Synchronize the control with the active rendering mode
  public setMode(mode: Mode): void {
    this.modeIndex = modes.findIndex((entry) => entry.value === mode);
    this.updateControl();
  }

  // Select the previous or next rendering mode without forwarding input to the canvas
  private stepMode = (event: MouseEvent): void => {
    event.stopPropagation();

    const step = Number((event.currentTarget as HTMLButtonElement).dataset.step);
    this.modeIndex = (this.modeIndex + step + modes.length) % modes.length;
    const mode = modes[this.modeIndex].value;

    this.setMode(mode);
    this.events.send({ type: 'Mode_Changed', mode });
  };

  // Reflect the active mode in the centered label
  private updateControl(): void {
    if (this.modeLabel)
      this.modeLabel.textContent = modes[this.modeIndex].label;
  }

  private stopCanvasPointerPropagation = (event: PointerEvent): void => {
    event.stopPropagation();
  };
}
