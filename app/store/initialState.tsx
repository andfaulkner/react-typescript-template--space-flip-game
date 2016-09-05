import { InputEvent } from '../types/types.tsx';

export interface AppStoreState {
  testStateProperty: boolean;
  inputQueue: InputEvent[];
  lastRenderedTime: number;
};

export const initialState: AppStoreState = {
  testStateProperty: false,
  inputQueue: [],
  lastRenderedTime: Date.now()
};

