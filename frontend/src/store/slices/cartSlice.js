import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import cartService from '../../services/cartService';
import { logout } from './authSlice';

const initialState = {
  items: JSON.parse(localStorage.getItem('cart')) || [],
  totalItems: 0,
  totalAmount: 0,
  loading: false,
  error: null,
  showPopup: false,
  lastAddedItem: null,
};

const calculateTotals = (items) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return { totalItems, totalAmount };
};

// Async thunks for backend sync
export const fetchCart = createAsyncThunk(
  'cart/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartService.getCart();
      return response.data || { items: [], totalItems: 0, totalAmount: 0 };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
    }
  }
);

export const addToCartAsync = createAsyncThunk(
  'cart/add',
  async (product, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const isAuthenticated = state.auth.isAuthenticated;
      
      if (isAuthenticated) {
        // Sync with backend
        const quantity = product.quantity || 1;
        const response = await cartService.addToCart(product._id, quantity);
        return response.data;
      } else {
        // Use local storage for guest users
        return product;
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to cart');
    }
  }
);

export const updateQuantityAsync = createAsyncThunk(
  'cart/updateQuantity',
  async ({ productId, quantity }, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const isAuthenticated = state.auth.isAuthenticated;
      
      if (isAuthenticated) {
        // Sync with backend
        await cartService.updateQuantity(productId, quantity);
      }
      return { productId, quantity };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update quantity');
    }
  }
);

export const removeFromCartAsync = createAsyncThunk(
  'cart/remove',
  async (productId, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const isAuthenticated = state.auth.isAuthenticated;
      
      if (isAuthenticated) {
        // Sync with backend
        await cartService.removeFromCart(productId);
      }
      return productId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove from cart');
    }
  }
);

export const clearCartAsync = createAsyncThunk(
  'cart/clear',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const isAuthenticated = state.auth.isAuthenticated;
      
      if (isAuthenticated) {
        // Sync with backend
        await cartService.clearCart();
      }
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to clear cart');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Sync local storage with state (for guest users)
    syncFromLocalStorage: (state) => {
      const localItems = JSON.parse(localStorage.getItem('cart')) || [];
      state.items = localItems;
      const totals = calculateTotals(localItems);
      state.totalItems = totals.totalItems;
      state.totalAmount = totals.totalAmount;
    },
    // Set cart items (used when syncing from backend)
    setCartItems: (state, action) => {
      state.items = action.payload.items || action.payload;
      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalAmount = totals.totalAmount;
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    // Control cart popup visibility
    setCartPopupVisible: (state, action) => {
      state.showPopup = action.payload.show;
      state.lastAddedItem = action.payload.item;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.totalItems = action.payload.totalItems || 0;
        state.totalAmount = action.payload.totalAmount || 0;
        localStorage.setItem('cart', JSON.stringify(state.items));
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add to cart
      .addCase(addToCartAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.loading = false;
        const product = action.payload;
        const existingItem = state.items.find(item => item._id === product._id);
        
        let addedItem;
        if (existingItem) {
          existingItem.quantity += product.quantity || 1;
          addedItem = existingItem;
        } else {
          const cleanProduct = {
            ...product,
            category: typeof product.category === 'object' 
              ? product.category?.name 
              : product.category,
            quantity: product.quantity || 1,
          };
          state.items.push(cleanProduct);
          addedItem = cleanProduct;
        }
        
        const totals = calculateTotals(state.items);
        state.totalItems = totals.totalItems;
        state.totalAmount = totals.totalAmount;
        localStorage.setItem('cart', JSON.stringify(state.items));
        
        // Show popup with the added item
        state.showPopup = true;
        state.lastAddedItem = addedItem;
      })
      .addCase(addToCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update quantity
      .addCase(updateQuantityAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateQuantityAsync.fulfilled, (state, action) => {
        state.loading = false;
        const { productId, quantity } = action.payload;
        const productIdStr = String(productId);
        const item = state.items.find(item => String(item._id) === productIdStr);
        
        if (item) {
          if (quantity <= 0) {
            state.items = state.items.filter(item => String(item._id) !== productIdStr);
          } else {
            item.quantity = quantity;
          }
          
          const totals = calculateTotals(state.items);
          state.totalItems = totals.totalItems;
          state.totalAmount = totals.totalAmount;
          localStorage.setItem('cart', JSON.stringify(state.items));
        }
      })
      .addCase(updateQuantityAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove from cart
      .addCase(removeFromCartAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        state.loading = false;
        const productId = String(action.payload);
        state.items = state.items.filter(item => String(item._id) !== productId);
        const totals = calculateTotals(state.items);
        state.totalItems = totals.totalItems;
        state.totalAmount = totals.totalAmount;
        localStorage.setItem('cart', JSON.stringify(state.items));
      })
      .addCase(removeFromCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // Even if API fails, remove from local state for better UX
        const productId = String(action.meta.arg);
        state.items = state.items.filter(item => String(item._id) !== productId);
        const totals = calculateTotals(state.items);
        state.totalItems = totals.totalItems;
        state.totalAmount = totals.totalAmount;
        localStorage.setItem('cart', JSON.stringify(state.items));
      })
      // Clear cart
      .addCase(clearCartAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCartAsync.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        state.totalItems = 0;
        state.totalAmount = 0;
        localStorage.removeItem('cart');
      })
      .addCase(clearCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // Even if API fails, clear local state for better UX
        state.items = [];
        state.totalItems = 0;
        state.totalAmount = 0;
        localStorage.removeItem('cart');
      })
      // Clear cart when user logs out
      .addCase(logout, (state) => {
        state.items = [];
        state.totalItems = 0;
        state.totalAmount = 0;
        state.loading = false;
        state.error = null;
        state.showPopup = false;
        state.lastAddedItem = null;
        localStorage.removeItem('cart');
      });
  },
});

export const { syncFromLocalStorage, setCartItems, setCartPopupVisible } = cartSlice.actions;
export default cartSlice.reducer;

