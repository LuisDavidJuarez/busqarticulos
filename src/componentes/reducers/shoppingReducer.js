import { TYPES } from "../actions/shoppingActions";

export const shoppinInitialState = {
   car:[],
};

export function shoppingReducer(state, action){
  switch(action.type){
    case TYPES.ADD_TO_CAR: {
      return {
        ...state, 
        car: [
          ...state.car,action.payload
        ],
      }
    }
    case TYPES.REMOVE_ONE_FROM_CAR: {
    }
    case TYPES.REMOVE_ALL_FROM_CAR: {
    }
    case TYPES.CLEAR_CAR: {
    }
    default: {
      return state;
    }
  }
}