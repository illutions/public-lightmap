import { type AnyStateMachine, setup } from 'xstate';
import type { App, SceneReadyEvent } from 'illutions';

import { classes } from './classes';
import type { BakeMode } from './objs/furniture';

// Define rendering-mode switching, scene lighting, and orbit control behavior with a state machine
export function createStateMachine(app: App<typeof classes>): AnyStateMachine {
  const { comps, envCtrls, objs3D, orbitCtrls } = app;
  const envIntensity = envCtrls.get().environmentIntensity ?? 0;

  const setCombinedLighting = (): void => {
    objs3D.Spot.obj.visible = false;
    envCtrls.set({ environmentIntensity: 0 });
  };

  const setLightmapLighting = (): void => {
    objs3D.Spot.obj.visible = true;
    envCtrls.set({ environmentIntensity: envIntensity });
  };

  return setup({
    types: {} as {
      events: SceneReadyEvent | { type: 'Toggle_Mode_Changed'; mode: BakeMode };
    },
    actions: {
      // Synchronize the selected unused-material workflow with the scene and switch
      setBakeMode: ({ event }) => {
        if (event.type !== 'Toggle_Mode_Changed') return;

        objs3D.Backdrop.setBakeMode(event.mode);
        objs3D.Furniture.setBakeMode(event.mode);
        objs3D.Fruitbowl.setBakeMode(event.mode);
        comps.Toggle[0]?.setMode(event.mode);

        if (event.mode === 'combined')
          setCombinedLighting();
        else
          setLightmapLighting();
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
      Toggle_Mode_Changed: { actions: 'setBakeMode' },
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
