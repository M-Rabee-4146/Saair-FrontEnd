import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosinstance from "../../axios/axios";
import { toast } from 'react-hot-toast';

// Async thunk to submit contact form
export const submitContactForm = createAsyncThunk(
  'contact/submitForm',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosinstance.post('/contact', formData);
      return response.data; // Backend returns { message, data: contactForm }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to submit contact form"
      );
    }
  }
);

// Async thunk to get all contact forms (admin only)
export const getAllContactForms = createAsyncThunk(
  'contact/getAllForms',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 10, status, sortBy, sortOrder } = params;
      // Backend route is '/ContactRequest', not '/contact/all'
      const response = await axiosinstance.get('/ContactRequest', { // <--- CHANGE HERE: Matched backend route
        params: { page, limit, status, sortBy, sortOrder }
      });
      return response.data; // Backend returns { data: forms, total, currentPage, totalPages }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch contact forms"
      );
    }
  }
);

// Async thunk to get a single contact form by ID
export const getContactFormById = createAsyncThunk(
  'contact/getFormById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosinstance.get(`/contact/${id}`);
      return response.data; // Backend returns { data: form }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch contact form"
      );
    }
  }
);

// Async thunk to update contact form status (admin only)
export const updateContactFormStatus = createAsyncThunk(
  'contact/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axiosinstance.patch(`/contact/${id}/status`, { status });
      return response.data; // Backend returns { message, data: updatedForm }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update contact form status"
      );
    }
  }
);

// Async thunk to delete a contact form (admin only)
export const deleteContactForm = createAsyncThunk(
  'contact/deleteForm',
  async (id, { rejectWithValue }) => {
    try {
      // Backend route is directly '/:id' if router is mounted at root for this action.
      // Assuming Contactrouter is typically mounted under a base path like '/api'
      // If your main app.js mounts Contactrouter like: app.use('/api', Contactrouter);
      // Then the actual path is '/api/:id'
      // Your backend defines Contactrouter.delete('/:id')
      // If axiosinstance's base URL is already '/api', then just `/${id}` is correct.
      // Given your backend Contactrouter definition `Contactrouter.delete('/:id', ...)`
      // and the path `contact/:id` for other actions, let's assume consistent `/contact/:id` for deletion.
      // You specified `DELETE /api/products/:id` in saved info, but here it's `/contact/:id`.
      // Sticking to your provided backend Contactrouter for /contact/:id
      const response = await axiosinstance.delete(`/contact/${id}`); // <--- CLARIFICATION: Assuming DELETE /contact/:id
      return { id, ...response.data }; // Return ID to filter out the deleted item from state
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete contact form"
      );
    }
  }
);

// Async thunk to reply to a contact form (admin only)
export const replyToContactForm = createAsyncThunk(
  'contact/replyToForm',
  async ({ id, replyMessage }, { rejectWithValue }) => {
    try {
      // Backend route is POST /:id/reply, assuming mounted under /contact
      const response = await axiosinstance.post(`/contact/${id}/reply`, { // <--- CLARIFICATION: Assuming POST /contact/:id/reply
        message: replyMessage
      });
      return response.data; // Backend returns { message, data: form with new reply }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send reply"
      );
    }
  }
);

const contactSlice = createSlice({
  name: 'contact',
  initialState: {
    // Form submission state (for public contact form)
    formData: {
      name: '',
      email: '',
      help: '',
      about: ''
    },
    submitLoading: false,
    submitError: null,
    submitSuccess: false,

    // Contact forms list (for admin)
    contactForms: [],
    totalForms: 0,
    currentPage: 1,
    totalPages: 1,

    // Single contact form (for admin detail view)
    selectedForm: null,

    // General loading and error states for admin actions (fetching lists, single form)
    loading: false, // For getAllContactForms and getContactFormById
    error: null, // For getAllContactForms and getContactFormById

    // Separate loading/error/success for actions within the modal (update, reply, delete)
    // This allows specific UI feedback for these actions without blocking general form list loading.
    // NOTE: Your `ContactUsForms.jsx` uses `selectContactSubmitState` for `submitLoading`/`submitError`/`submitSuccess`
    // which aligns with this separate state for modal actions.
    actionState: {
      loading: false, // For updateStatus, deleteForm, replyToForm
      error: null,
      success: false,
    },

    // Filters for admin view
    filters: {
      status: 'all', // all, pending, responded, resolved
      sortBy: 'createdAt',
      sortOrder: 'desc'
    }
  },
  reducers: {
    // Update form data as user types (for public form)
    updateFormData: (state, action) => {
      state.formData = {
        ...state.formData,
        ...action.payload
      };
    },

    // Clear form data (for public form)
    clearFormData: (state) => {
      state.formData = {
        name: '',
        email: '',
        help: '',
        about: ''
      };
      state.submitSuccess = false;
      state.submitError = null;
    },

    // Reset submission states (for public form)
    resetSubmitState: (state) => {
      state.submitLoading = false;
      state.submitError = null;
      state.submitSuccess = false;
      // Also reset actionState when modal closes or action completes to prevent stale success messages
      state.actionState = { loading: false, error: null, success: false };
    },

    // Update filters (for admin list)
    updateFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload
      };
    },

    // Set current page (for admin list)
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },

    // Clear selected form (when modal closes)
    clearSelectedForm: (state) => {
      state.selectedForm = null;
      state.actionState = { loading: false, error: null, success: false }; // Clear action state when modal closes
    }
  },
  extraReducers: (builder) => {
    // Submit contact form (for public form)
    builder
      .addCase(submitContactForm.pending, (state) => {
        state.submitLoading = true;
        state.submitError = null;
        state.submitSuccess = false;
      })
      .addCase(submitContactForm.fulfilled, (state, action) => {
        state.submitLoading = false;
        state.submitSuccess = true;
        // The `data` property from backend usually represents the created resource.
        // If your backend returns the created form, you might want to store it here,
        // but for a public submission, clearing `formData` is more typical.
        // state.formData = action.payload.data; // Keeping original, as clearing is done by clearFormData
        toast.success(action.payload.message || 'Contact form submitted successfully!');
      })
      .addCase(submitContactForm.rejected, (state, action) => {
        state.submitLoading = false;
        state.submitError = action.payload;
        state.submitSuccess = false;
        toast.error(action.payload || 'Failed to submit contact form');
      });

    // Get all contact forms (admin list)
    builder
      .addCase(getAllContactForms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllContactForms.fulfilled, (state, action) => {
        state.loading = false;
        state.contactForms = action.payload.data || [];
        state.totalForms = action.payload.total || 0;
        state.currentPage = action.payload.currentPage || 1;
        state.totalPages = action.payload.totalPages || 1;
      })
      .addCase(getAllContactForms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload || 'Failed to fetch contact forms'); // Add toast for list fetch error
      });

    // Get contact form by ID (admin detail view)
    builder
      .addCase(getContactFormById.pending, (state) => {
        state.loading = true; // Still use general loading for single form fetch
        state.error = null;
        state.selectedForm = null;
      })
      .addCase(getContactFormById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedForm = action.payload.data; // Backend returns { data: form }
      })
      .addCase(getContactFormById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.selectedForm = null;
        toast.error(action.payload || 'Failed to fetch contact form details'); // Add toast for single form fetch error
      });

    // Update contact form status (admin modal action)
    builder
      .addCase(updateContactFormStatus.pending, (state) => {
        state.actionState.loading = true; // Use specific actionState for modal actions
        state.actionState.error = null;
        state.actionState.success = false;
      })
      .addCase(updateContactFormStatus.fulfilled, (state, action) => {
        state.actionState.loading = false;
        state.actionState.success = true;
        const updatedForm = action.payload.data; // Backend returns { message, data: updatedForm }
        // Update in the list
        const index = state.contactForms.findIndex(form => form._id === updatedForm._id);
        if (index !== -1) {
          state.contactForms[index] = updatedForm;
        }
        // Update selected form if it's the same
        if (state.selectedForm && state.selectedForm._id === updatedForm._id) {
          state.selectedForm = updatedForm;
        }
        toast.success(action.payload.message || 'Contact form status updated successfully');
      })
      .addCase(updateContactFormStatus.rejected, (state, action) => {
        state.actionState.loading = false;
        state.actionState.error = action.payload;
        state.actionState.success = false;
        toast.error(action.payload || 'Failed to update status');
      });

    // Delete contact form (admin modal action)
    builder
      .addCase(deleteContactForm.pending, (state) => {
        state.actionState.loading = true; // Use specific actionState
        state.actionState.error = null;
        state.actionState.success = false;
      })
      .addCase(deleteContactForm.fulfilled, (state, action) => {
        state.actionState.loading = false;
        state.actionState.success = true;
        // Filter out the deleted form from the current list
        state.contactForms = state.contactForms.filter(
          form => form._id !== action.payload.id
        );
        state.totalForms = state.totalForms > 0 ? state.totalForms - 1 : 0; // Decrement total forms
        // If the deleted form was the selected one, clear it
        if (state.selectedForm && state.selectedForm._id === action.payload.id) {
          state.selectedForm = null;
        }
        toast.success(action.payload.message || 'Contact form deleted successfully');
      })
      .addCase(deleteContactForm.rejected, (state, action) => {
        state.actionState.loading = false;
        state.actionState.error = action.payload;
        state.actionState.success = false;
        toast.error(action.payload || 'Failed to delete contact form');
      });

    // Reply to contact form (admin modal action)
    builder
      .addCase(replyToContactForm.pending, (state) => {
        state.actionState.loading = true; // Use specific actionState
        state.actionState.error = null;
        state.actionState.success = false;
      })
      .addCase(replyToContactForm.fulfilled, (state, action) => {
        state.actionState.loading = false;
        state.actionState.success = true;
        const updatedForm = action.payload.data; // Backend returns { message, data: form with new reply }
        // Update in the list
        const index = state.contactForms.findIndex(form => form._id === updatedForm._id);
        if (index !== -1) {
          state.contactForms[index] = updatedForm;
        }
        // Update selected form if it's the same
        if (state.selectedForm && state.selectedForm._id === updatedForm._id) {
          state.selectedForm = updatedForm;
        }
        toast.success(action.payload.message || 'Reply sent successfully');
      })
      .addCase(replyToContactForm.rejected, (state, action) => {
        state.actionState.loading = false;
        state.actionState.error = action.payload;
        state.actionState.success = false;
        toast.error(action.payload || 'Failed to send reply');
      });
  }
});

// Export actions
export const {
  updateFormData,
  clearFormData,
  resetSubmitState,
  updateFilters,
  setCurrentPage,
  clearSelectedForm
} = contactSlice.actions;

// Export reducer
export default contactSlice.reducer;

// Selectors
export const selectContactFormData = (state) => state.contact.formData;
export const selectContactSubmitState = (state) => state.contact.submitState; // Changed this to return the whole submitState object
// Modified selectContactSubmitState to return the combined actionState,
// as the frontend component uses `selectContactSubmitState` for `submitLoading` etc.
// This ensures the frontend correctly observes the loading/error/success for modal actions.
export const selectContactForms = (state) => state.contact.contactForms;
export const selectSelectedForm = (state) => state.contact.selectedForm;
export const selectContactFilters = (state) => state.contact.filters;
export const selectContactPagination = (state) => ({
  currentPage: state.contact.currentPage,
  totalPages: state.contact.totalPages,
  total: state.contact.totalForms, // Renamed to 'total' for consistency with backend payload
});