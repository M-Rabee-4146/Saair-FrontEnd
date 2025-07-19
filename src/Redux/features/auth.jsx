import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosinstance from "../../axios/axios";

export const SignupUser = createAsyncThunk('Register', async (user, { rejectWithValue }) => {
    try {
        const response = await axiosinstance.post('/Signup', user)
        // console.log(response)
        return response.data;

    } catch (error) {
        return rejectWithValue(error.response?.data?.message)
    }
})

export const Loginuser = createAsyncThunk('login ', async (user, { rejectWithValue }) => {
    try {

        const response = await axiosinstance.post('/login', user)
        // console.log(response.data)
        localStorage.setItem('id', (response.data.user._id));
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', (response.data.user.role))
        axiosinstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

        return response.data;
    } catch (error) {
        console.log(error)
        return rejectWithValue(error.response?.data.message || "Something went wrong");
    }
})

export const OtpVerification = createAsyncThunk('OtpVerification', async (data, { rejectWithValue }) => {
    try {
        const response = await axiosinstance.post('/OTP-Verification', data)
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
})

export const ResendOtp = createAsyncThunk('ResendOtp', async (data, { rejectWithValue }) => {
    try {
        const response = await axiosinstance.post('/Resend', data)
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
})

export const ForgotPassword = createAsyncThunk('ForgotPassword', async (data, { rejectWithValue }) => {
    try {
        const response = await axiosinstance.post('/forgot-Password', data)
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
})

export const resetPassword = createAsyncThunk('ResetPassword', async (data, { rejectWithValue }) => {
    try {
        const response = await axiosinstance.post('/Reset-Password', data)
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
})
export const GetOneUser = createAsyncThunk('GetUserById', async (id, { rejectWithValue }) => {
    try {
        const response = await axiosinstance.get(`/user/${id}`)
        // console.log(response.data)
        return response.data;
    } catch (error) {
        console.log(error)
        return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
})
const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        role: null,
        token: null,
        error: null,
        loading: false,
        authenticated: false,
    },
    reducers: {
        Logout(state) {
            state.token = null;
            state.user = null;
            state.role = null;
            state.authenticated = false;
            // Clear localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('id');
            localStorage.removeItem('role');
            // Clear axios header
            delete axiosinstance.defaults.headers.common['Authorization'];
        }
    },
    extraReducers: (builder) => {
        builder.addCase(SignupUser.pending, (state) => {
            state.loading = true,
                state.error = null
        }),
            builder.addCase(SignupUser.fulfilled, (state, action) => {
                state.loading = false,
                    state.user = action.payload,
                    state.authenticated = true
            }),
            builder.addCase(SignupUser.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload
            }),
            builder.addCase(Loginuser.pending, (state) => {
                state.loading = true,
                    state.error = null
            }),
            builder.addCase(Loginuser.fulfilled, (state, action) => {
                state.loading = false,
                    state.user = action.payload.user,
                    state.token = action.payload.token,
                    state.authenticated = true,
                    state.role = action.payload.user.role
            }),
            builder.addCase(Loginuser.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload
            }),
            builder.addCase(OtpVerification.pending, (state) => {
                state.loading = true,
                    state.error = null
            }),
            builder.addCase(OtpVerification.fulfilled, (state, action) => {
                state.loading = false,
                    state.authenticated = true
            }),
            builder.addCase(OtpVerification.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload
            }),
            builder.addCase(ResendOtp.pending, (state) => {
                state.loading = true,
                    state.error = null
            }),
            builder.addCase(ResendOtp.fulfilled, (state, action) => {
                state.loading = false,
                    state.error = null
            }),
            builder.addCase(ResendOtp.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload
            }),
            builder.addCase(ForgotPassword.pending, (state) => {
                state.loading = true,
                    state.error = null
            }),
            builder.addCase(ForgotPassword.fulfilled, (state, action) => {
                state.loading = false,
                    state.error = null
            }),
            builder.addCase(ForgotPassword.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload
            }),
            builder.addCase(resetPassword.pending, (state) => {
                state.loading = true,
                    state.error = null
            }),
            builder.addCase(resetPassword.fulfilled, (state, action) => {
                state.loading = false,
                    state.error = null
            }),
            builder.addCase(resetPassword.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload
            }),
            builder.addCase(GetOneUser.pending, (state) => {
                state.loading = true,
                    state.error = null
            }),
            builder.addCase(GetOneUser.fulfilled, (state, action) => {
                state.loading = false,
                    state.error = null,
                    state.user = action.payload.data
            }),
            builder.addCase(GetOneUser.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload
            })
    }
})
export default authSlice.reducer;
export const { Logout } = authSlice.actions;