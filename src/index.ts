import { App } from 'illutions';

// Define the static settings used when the app starts
import { cfg } from './cfg';
// Import the asset definitions
import { comps } from './comps';
// Control event-driven runtime behavior with a state machine
import { stm } from './stm';

// For typed access to components and engine systems.
export type MyApp = App<typeof comps>;

// Start the app when the page is ready
document.addEventListener('DOMContentLoaded', () => {
  App.run(cfg, comps, stm);
});
