import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: JSON.parse(localStorage.getItem('cart')) || [],
  totalItems: 0,
  totalAmount: 0,
};

const calculateTotals = (items) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return { totalItems, totalAmount };
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find(item => item._id === action.payload._id);
      
      if (existingItem) {
        existingItem.quantity += action.payload.quantity || 1;
      } else {
        // Clean the product data - extract category name if it's an object
        const cleanProduct = {
          ...action.payload,
          category: typeof action.payload.category === 'object' 
            ? action.payload.category?.name 
            : action.payload.category,
          quantity: action.payload.quantity || 1,
        };
        state.items.push(cleanProduct);
      }
      
      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalAmount = totals.totalAmount;
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item._id !== action.payload);
      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalAmount = totals.totalAmount;
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    updateQuantity: (state, action) => {
      const item = state.items.find(item => item._id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
        const totals = calculateTotals(state.items);
        state.totalItems = totals.totalItems;
        state.totalAmount = totals.totalAmount;
        localStorage.setItem('cart', JSON.stringify(state.items));
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalAmount = 0;
      localStorage.removeItem('cart');
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

