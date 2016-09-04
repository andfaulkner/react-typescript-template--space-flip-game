import Action from './action.tsx';
import { Direction } from '../types/types.tsx';

export const CHANGE_DIRECTION = 'CHANGE_DIRECTION';
export type CHANGE_DIRECTION = { direction: Direction };

export const changeDirection = (direction: Direction): Action<CHANGE_DIRECTION> => ({
  type: CHANGE_DIRECTION,
  payload: { direction }
});
