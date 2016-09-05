import { InputEvent, UIEntityProps } from '../types/types.tsx';
import { EnemyCrawlerProps } from '../components/EnemyCrawler/EnemyCrawler.tsx';

export interface AppStoreState {
  testStateProperty: boolean;
  inputQueue: InputEvent[];
  lastRenderedTime: number;
  uiState: {
    player:  UIEntityProps,
    bullets: UIEntityProps[],
    uiBoxes: UIEntityProps[],
    enemies: {
      crawlers: EnemyCrawlerProps[]
    },
    score: number
  };
  uiUpdateReady: boolean;
};

export const initialState: AppStoreState = {
  testStateProperty: false,
  inputQueue: [],
  lastRenderedTime: Date.now(),
  uiState: {
    player: {
      xLeft: 0,
      yTop: 0,
      angle: 270,
      speed: 3,
      width: 20,
      height: 20
    },
    bullets: [],
    uiBoxes: [],
    enemies: {
      crawlers: []
    },
    score: Math.floor(0.001) // help prevent coersion to boolean
  },
  uiUpdateReady: true,
};
