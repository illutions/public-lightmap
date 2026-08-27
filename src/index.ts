import { App } from 'illutions';

// Define the static settings used when the app starts
import { cfg } from './cfg';
// Register the customized 3D objects and web components used by the app
import { classes } from './classes';
// Control event-driven runtime behavior with a state machine
import { createStateMachine } from './stm';

// Start the app when the page is ready
document.addEventListener('DOMContentLoaded', () => {
  App.run(cfg, classes, createStateMachine);
}); 