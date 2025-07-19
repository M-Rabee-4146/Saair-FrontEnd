import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosinstance from "../../axios/axios";

export const uploadproduct = createAsyncThunk('postproduct', async (formData, thunkAPI) => {
    try {
        // console.log(formData)
        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }
        const response = await axiosinstance.post('/postproduct', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (err) {
        console.log(err)
        return thunkAPI.rejectWithValue(err.response?.data || 'Upload failed');
    }
}
);

export const getallproducts = createAsyncThunk('getproducts', async (data,{rejectWithValue}) => {
    try {
        const response = await axiosinstance.get('/products') 
        // console.log(response.data)
        return response.data;
    } catch (err) {
        console.log(err)
        return rejectWithValue(err.response?.data || 'Upload failed');
    }
}
);

export const getsingleproduct = createAsyncThunk('getproductbyid', async (id,{rejectWithValue}) => {
    try {
        const response = await axiosinstance.get(`/getproduct/${id}`) 
        // console.log(response.data)
        return response.data;
    } catch (err) {
        console.log(err)
        return rejectWithValue(err.response?.data || 'Upload failed');
    }
}
);
export const deleteproductbyid = createAsyncThunk('deleteproductbyid', async (id,{rejectWithValue}) => {
    try {
        const response = await axiosinstance.delete(`/delete/${id}`) 
        console.log(response.data)
         return {id, message: response.data.message || 'Product deleted successfully'};
    } catch (err) {
        console.log(err)
        return rejectWithValue(err.response?.data || 'Upload failed');
    }
}
);
export const updateproductbyid = createAsyncThunk(
    'product/updateProductById',
    async ({ id, productData }, { rejectWithValue }) => {
        try {
            const response = await axiosinstance.put(`/update/${id}`, productData, { // Use PUT method
            });
            return response.data; // Expecting { success: true, message: '...', product: { ...updatedProduct } }
        } catch (err) {
            console.error("Error in updateproductbyid thunk:", err);
            return rejectWithValue(err.response?.data?.message || 'Failed to update product.');
        }
    }
);

const productSlice = createSlice({
    name: 'product',
    initialState: {
        products: [],
        selectedProduct: null,
        loading: false,
        deleteLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(uploadproduct.pending, (state) => {
            state.loading = true;
            state.error = null;
        }),
            builder.addCase(uploadproduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products = [...state.products, action.payload]
                // state.selectedProduct=action.payload.product;
            }),
            builder.addCase(uploadproduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            }),
            builder.addCase(getallproducts.pending, (state) => {
                state.loading = true;
                state.error = null;

            }),
            builder.addCase(getallproducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload.products;

            }),
            builder.addCase(getallproducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            }),
            builder.addCase(getsingleproduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            }),
            builder.addCase(getsingleproduct.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedProduct = action.payload.product;

            }),
            builder.addCase(getsingleproduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            }),
             builder.addCase(deleteproductbyid.pending, (state) => {
                state.deleteLoading = true; // Set delete specific loading to true
                state.error = null;
            })
            .addCase(deleteproductbyid.fulfilled, (state, action) => {
                state.deleteLoading = false; // Set delete specific loading to false on success
                state.products = state.products.filter((product) => product._id !== action.payload.id);
                state.selectedProduct = null; // Clear the selected product after it's deleted
            })
            .addCase(deleteproductbyid.rejected, (state, action) => {
                state.deleteLoading = false; // Set delete specific loading to false on failure
                state.error = action.payload;
            }),
             // --- New: Reducers for updateproductbyid ---
           builder.addCase(updateproductbyid.pending, (state) => {
                state.loading = true; 
                state.error = null;
            })
            .addCase(updateproductbyid.fulfilled, (state, action) => {
                state.loading = false;
                const updatedProduct = action.payload.product;

                // Update the product in the 'products' array if it exists
                const index = state.products.findIndex(p => p._id === updatedProduct._id);
                if (index !== -1) {
                    state.products[index] = updatedProduct;
                }
                // Also update selectedProduct if this was the product being viewed/edited
                state.selectedProduct = { product: updatedProduct }; // Ensure structure matches getsingleproduct
            })
            .addCase(updateproductbyid.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
})
export default productSlice.reducer;