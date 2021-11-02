import { TYPES } from "../actions/shoppingActions";

export const shoppinInitialState = {
  car: [],
};

export function shoppingReducer(state, action) {
  switch (action.type) {
    case TYPES.ADD_TO_CAR: {
      let newItem = action.payload;
      let itemInCar = state.car.find(
        (item) => item.Articulo === newItem.Articulo
      );
      return itemInCar
        ? {
            ...state,
            car: state.car.map((item) =>
              item.Articulo === newItem.Articulo
                ? { ...item, Cantidad: item.Cantidad + 1 }
                : item
            ),
          }
        : {
            ...state,
            car: [...state.car, { ...newItem, Cantidad: 1 }],
          };
    }
    case TYPES.REMOVE_ONE_FROM_CAR: {
      let itemToDelete = state.car.find(
        (item) => item.Articulo === action.payload
      );

      return itemToDelete.Cantidad > 1
        ? {
            ...state,
            car: state.car.map((item) =>
              item.Articulo === action.payload
                ? { ...item, Cantidad: item.Cantidad - 1 }
                : item
            ),
          }
        : {
            ...state,
            car: state.car.filter((item) => item.Articulo !== action.payload),
          };
    }
    case TYPES.REMOVE_ALL_FROM_CAR: {
      return {
        ...state,
        car: state.car.filter((item) => item.Articulo !== action.payload),
      };
    }

    case TYPES.CLEAR_CAR:
      return shoppinInitialState;
    default: {
      return state;
    }
  }
}
