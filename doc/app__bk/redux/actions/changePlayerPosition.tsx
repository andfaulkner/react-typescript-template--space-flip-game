import Action from './action.tsx';

export const CHANGE_PLAYER_POSITION = 'CHANGE_PLAYER_POSITION';
export type CHANGE_PLAYER_POSITION = { xPos: number, yPos: number};

export const changePlayerPosition = (xPos: number, yPos: number): Action<CHANGE_PLAYER_POSITION> =>
  ({
    type: CHANGE_PLAYER_POSITION,
    payload: { xPos, yPos }
  });
