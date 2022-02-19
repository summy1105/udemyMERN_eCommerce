import { CART_ADD_ITEM, CART_REMOVE_ITEM, CART_SAVE_PAYMENT_METHOD, CART_SAVE_SHIPPING_ADDRESS } from '../constants/cartConstants';
import { ORDER_PAY_SUCCESS } from '../constants/orderConstants';
import { USER_LOGOUT } from '../constants/userConstants';

export const cartReducer = (state = { cartItems: [] }, action) => {
  switch (action.type) {
    case CART_ADD_ITEM:
      const item = action.payload;

      const existItems = state.cartItems.find(x => x.product === item.product);
      if (existItems) {
        return {
          ...state,
          cartItems: state.cartItems.map(x => x.product === existItems.product ? item : x)
        }
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, item]
        }
      }
    case CART_REMOVE_ITEM:
      const removeId = action.payload;
      return {
        ...state,
        cartItems: state.cartItems.filter(x => x.product !== removeId)
      }
    case CART_SAVE_SHIPPING_ADDRESS:
      return {
        ...state,
        shhippingAddress: action.payload,
      }
    case CART_SAVE_PAYMENT_METHOD:
      return {
        ...state,
        paymentMethod: action.payload,
      }
    case USER_LOGOUT:
    case ORDER_PAY_SUCCESS:
      return { cartItems: [] }
    default:
      return state;
  }
}