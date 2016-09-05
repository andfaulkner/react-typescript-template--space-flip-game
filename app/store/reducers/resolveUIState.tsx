/// <reference path="../../../typings/index.d.ts" />

import { UIState, UIEntityProps } from '../../types/types.tsx';

import { bulletToUIEntityCollisions } from '../../logic/collisionHandler.tsx';
import { updateBulletPositions } from '../../logic/resolveBulletMovement.tsx';
import { createUIBox, createEnemy } from '../../logic/npcFactories.tsx';
import { EnemyCrawler, EnemyCrawlerProps } from '../../components/EnemyCrawler/EnemyCrawler.tsx';

interface UIStateDataHandlers {
  (uiState: UIState): UIStateDataHandlerFunctions;
};

interface UIStateDataHandlerFunctions {
  curUI: UIState;
  generateNPCs: (odds: number) => UIStateDataHandlerFunctions;
  moveNPCs: () => UIStateDataHandlerFunctions;
  bulletUIEntityCollisions: () => UIStateDataHandlerFunctions;
  updateBulletPos: () => UIStateDataHandlerFunctions;
}

let uiDataHandlers: UIStateDataHandlers = function uiDataHandlers(uiState: UIState): UIStateDataHandlerFunctions {
  let curUI: UIState = uiState;

  const generateNPCs = function(odds: number = 20): UIStateDataHandlerFunctions {
    // create NPC at random - approximately once / 40 ticks (every 4s). Don't create more than 10.
    if ((this.curUI.uiBoxes.length <= 10) && (_.random(0, 20) === 20)) {
      switch (_.sample(['uiBox', 'enemy.crawler'])) {
        case('uiBox'):
          this.curUI.uiBoxes = createUIBox(this.curUI);
          break;
        case('enemy.crawler'):
          this.curUI.enemies = createEnemy(this.curUI, this.curUI.enemies, 'crawler');
          break;
      }
    }
    return this;
  };

  const moveNPCs = function(): UIStateDataHandlerFunctions {
    this.curUI.enemies.crawlers = _.map(this.curUI.enemies.crawlers, (crawler: EnemyCrawlerProps) => {
      crawler.xLeft -= 1;
      if ((crawler.xLeft - crawler.width) < -300) {
        crawler.xLeft = -300 + crawler.width;
        crawler.reachedEnd = true;
      }
      return crawler;
    });
    return this;
  };

  const bulletUIEntityCollisions = function(): UIStateDataHandlerFunctions {
    this.curUI = bulletToUIEntityCollisions(this.curUI);
    return this;
  };

  const updateBulletPos = function(): UIStateDataHandlerFunctions {
    this.curUI.bullets = updateBulletPositions(this.curUI.bullets);
    return this;
  };

  return {
    curUI,
    generateNPCs,
    moveNPCs,
    bulletUIEntityCollisions,
    updateBulletPos,
  };
};

export const resolveUIState = (time: number, state: UIState) =>
  uiDataHandlers(state)
    .updateBulletPos()
    .moveNPCs()
    .generateNPCs(20)
    .bulletUIEntityCollisions()
    .curUI;
