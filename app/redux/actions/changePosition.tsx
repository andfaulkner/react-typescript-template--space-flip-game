import Action from './action.tsx';

export const CHANGE_POSITION = 'CHANGE_POSITION';
export type CHANGE_POSITION = { xPos: number, yPos: number};

export const changePosition = (xPos: number, yPos: number): Action<CHANGE_POSITION> => ({
  type: CHANGE_POSITION,
  payload: { xPos, yPos }
});
