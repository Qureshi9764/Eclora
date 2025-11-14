import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import orderService from '../../services/orderService';

const initialState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
};

export const fetchOrders = createAsyncThunk(
  'orders/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await orderService.getAllOrders(params);
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'orders/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await orderService.getOrderById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch order');
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await orderService.updateOrderStatus(id, status);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update order status');
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Order By ID
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Order Status
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.orders.findIndex((o) => o._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        if (state.currentOrder?._id === action.payload._id) {
          state.currentOrder = action.payload;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentOrder, clearError } = orderSlice.actions;
export default orderSlice.reducer;

