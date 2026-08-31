import { type AnyStateMachine, setup } from 'xstate';
import type { App, SceneReadyEvent } from 'illutions';

import { classes } from './classes';
import type { Mode } from './objs/furniture';

// Define rendering-mode switching, scene lighting, and orbit control behavior with a state machine
export function createStateMachine(app: App<typeof classes>): AnyStateMachine {
  const { comps, envCtrls, objs3D, orbitCtrls } = app;
  const envIntensity = envCtrls.get().environmentIntensity ?? 0;

  const setCombinedLighting = (): void => {
    objs3D.Spot.obj.visible = false;
    envCtrls.set({ environmentIntensity: 0 });
  };

  const setStandardLighting = (): void => {
    objs3D.Spot.obj.visible = true;
    envCtrls.set({ environmentIntensity: envIntensity });
  };

  return setup({
    types: {} as {
      events: SceneReadyEvent | { type: 'Mode_Changed'; mode: Mode };
    },
    actions: {
      // Synchronize the selected rendering workflow with the scene and mode control
      setMode: ({ event }) => {
        if (event.type !== 'Mode_Changed') return;

        objs3D.Backdrop.setMode(event.mode);
        objs3D.Furniture.setMode(event.mode);
        objs3D.Fruitbowl.setMode(event.mode);
        comps.Toggle[0]?.setMode(event.mode);

        if (event.mode === 'combined')
          setCombinedLighting();
        else
          setStandardLighting();
      },

      // Apply the initial combined-lighting setup
      setCombinedLighting: () => setCombinedLighting(),

      // Enable camera interaction after the first scene is ready
      enableOrbitCtrls: () => orbitCtrls.enable(),
    },
  }).createMachine({
    id: 'App',
    initial: 'INIT',
    on: {
      Mode_Changed: { actions: 'setMode' },
    },
    states: {
      INIT: {
        on: {
          Scene_Ready: {
            actions: ['enableOrbitCtrls', 'setCombinedLighting'],
          },
        },
      },
    },
  });
}
