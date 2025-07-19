// Redux/features/orderSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosinstance from "../../axios/axios"; // Assuming this path is correct for your axios instance

const API_BASE_URL = "http://localhost:3200/api";

export const createOrder = createAsyncThunk(
    'orders/createOrder',
    async (orderData, { rejectWithValue, dispatch }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axiosinstance.post(`/orders`, orderData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data; // Should return the created order object
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to create order');
        }
    }
);

export const getAllOrders = createAsyncThunk(
    'orders/getAllOrders',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axiosinstance.get(`/orders`, { // Changed to axiosinstance
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            // console.log(response.data)
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const getSingleOrder = createAsyncThunk(
    'orders/getSingleOrder',
    async (orderId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axiosinstance.get(`/orders/${orderId}`, { // Changed to axiosinstance
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const updateOrderStatus = createAsyncThunk(
    'orders/updateOrderStatus',
    async ({ orderId, status }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axiosinstance.put(`/orders/${orderId}/status`, { status }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
                
            });
            console.log(response)
            return response.data; // Should return the updated order
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);
// New: Delete Order Thunk
export const deleteOrder = createAsyncThunk(
    'orders/deleteOrder',
    async (orderId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axiosinstance.delete(`/dlt-order/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return { message: response.data?.message || 'Order deleted successfully', orderId };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Async Thunks for Sales (could be in a separate salesSlice if it grows)
export const getSalesOverview = createAsyncThunk(
    'sales/getSalesOverview',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axiosinstance.get(`/sales/overview`, { // Changed to axiosinstance
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data; // Expected: { totalSales: number, totalOrders: number, averageOrderValue: number, salesByMonth: [] etc. }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const orderSlice = createSlice({
    name: 'order',
    initialState: {
        orders: [],
        selectedOrder: null,
        salesOverview: null, // For sales data
        loading: false, // General loading for fetching existing orders or sales overview
        error: null,
        updateLoading: false, // For order status update
        deleteLoading: false, // Keeping for consistency, though not used by Checkout
        createLoading: false, // Specific loading for order creation
        createdOrder: null, // To store the newly created order upon success
    },
    reducers: {
        // Reducer to clear the state of the newly created order, e.g., after navigating
        clearCreatedOrder: (state) => {
            state.createdOrder = null;
        },
        // Reducer to clear any order-related errors
        clearOrderError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // --- createOrder lifecycle ---
            .addCase(createOrder.pending, (state) => {
                state.createLoading = true;
                state.error = null; // Clear previous errors
                state.createdOrder = null; // Clear previous created order
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.createLoading = false;
                state.createdOrder = action.payload; // Store the newly created order
                // Optionally, add to the list of all orders if you fetch them later
                state.orders?.push(action.payload);
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.createLoading = false;
                state.error = action.payload; // Store the error message
            })
             // --- getAllOrders lifecycle ---
            .addCase(getAllOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllOrders.fulfilled, (state, action) => {
                state.loading = false;
                // Ensure the payload is an array before assigning.
                // This guards against backend sending non-array data.
                state.orders = Array.isArray(action.payload.orders) ? action.payload.orders : [];
                // console.log(action.payload.orders)
            })
            
            .addCase(getAllOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.orders = []; // Crucial: Reset to empty array on error to prevent non-array state
            })

            // --- getSingleOrder lifecycle ---
            .addCase(getSingleOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.selectedOrder = null;
            })
            .addCase(getSingleOrder.fulfilled, (state, action) => {
                state.loading = false;
                // Backend returns { order: ... } for single order, so use action.payload.order
                state.selectedOrder = action.payload.order;
            })
            .addCase(getSingleOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.selectedOrder = null; // Clear selected order on error
            })

            // --- updateOrderStatus lifecycle ---
            .addCase(updateOrderStatus.pending, (state) => {
                state.updateLoading = true;
                state.error = null;
            })
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                state.updateLoading = false;
                state.error = null;

                const updatedOrder = action.payload.order;

                // Ensure state.orders is an array before mapping.
                // If by some chance it became non-array (e.g., from an old persisted state),
                // this ensures it's treated as an array.
                if (Array.isArray(state.orders)) {
                    state.orders = state.orders.map((order) =>
                        order._id === updatedOrder._id ? updatedOrder : order
                    );
                } else {
                    // This case should ideally not happen if `getAllOrders` is robust,
                    // but it acts as a safeguard.
                    console.warn("state.orders was not an array, initializing with updated order.");
                    state.orders = [updatedOrder];
                }

                // Update the selected order if it's the one being updated
                if (state.selectedOrder?._id === updatedOrder._id) {
                    state.selectedOrder = updatedOrder;
                }
            })
            .addCase(updateOrderStatus.rejected, (state, action) => {
                state.updateLoading = false;
                state.error = action.payload;
            })
              // --- deleteOrder lifecycle ---
            .addCase(deleteOrder.pending, (state) => {
                state.deleteLoading = true;
                state.error = null;
            })
            .addCase(deleteOrder.fulfilled, (state, action) => {
                state.deleteLoading = false;
                // Remove the deleted order from the orders array
                state.orders = state.orders.filter(order => order._id !== action.payload.orderId);
                // If the deleted order was the selected one, clear it
                if (state.selectedOrder?._id === action.payload.orderId) {
                    state.selectedOrder = null;
                }
            })
            .addCase(deleteOrder.rejected, (state, action) => {
                state.deleteLoading = false;
                state.error = action.payload;
            })
            // --- getSalesOverview lifecycle ---
            .addCase(getSalesOverview.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getSalesOverview.fulfilled, (state, action) => {
                state.loading = false;
                state.salesOverview = action.payload;
            })
            .addCase(getSalesOverview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    },
});

export const { clearCreatedOrder, clearOrderError } = orderSlice.actions;
export default orderSlice.reducer;