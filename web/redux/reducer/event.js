import { SET_EVENTS } from '../types';

const initialState = {
  events: [],
};

export default (state = initialState, action) => {
  switch(action.type) {
    case SET_EVENTS:
      return { events: action.payload }
    default:
      return state;
  }
};
