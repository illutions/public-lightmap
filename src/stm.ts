import { type AnyStateMachine, setup } from 'xstate';

import type { SceneReadyEvent } from 'illutions';

import type { MyApp } from './index';
import type { Mode } from './scene/furniture';

// Define rendering-mode switching, scene lighting, and orbit control behavior with a state machine
export const stm = (app: MyApp): AnyStateMachine => {
  const { comps, envCtrls, orbitCtrls } = app;
  const envIntensity = envCtrls.get().environmentIntensity ?? 0;

  const setCombinedLighting = (): void => {
    comps.scene.spot.obj.visible = false;
    envCtrls.set({ environmentIntensity: 0 });
  };

  const setStandardLighting = (): void => {
    comps.scene.spot.obj.visible = true;
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

        comps.scene.backdrop.setMode(event.mode);
        comps.scene.furniture.setMode(event.mode);
        comps.scene.fruitbowl.setMode(event.mode);
        comps.web.toggle[0]?.setMode(event.mode);

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
};
