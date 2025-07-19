// src/Redux/store.js
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

// Import your reducers (assuming these paths are correct)
import authReducer from "../features/auth.jsx";
import productReducer from "../features/product.jsx";
import navigationReducer from "../features/NavigationSlice.jsx";
import orderReducer from '../features/order&sales.jsx'
import contactReducers from '../features/contactSlice.jsx'
import  {cartReducer}  from "../features/cart.jsx";

// 1. Configuration for redux-persist
const persistConfig = {
  key: 'root', // The key for the localStorage object
  version: 1,  // Version of your persisted state
  storage,     // The storage medium (localStorage)
  // Optionally, you can whitelist/blacklist specific reducers if you don't want to persist everything.
  // For example, to persist only 'auth' and 'product':
  // whitelist: ['auth', 'product'],
  // If you want to persist everything, you can remove 'whitelist' or 'blacklist'.
};

// 2. Combine your reducers
const rootReducer = combineReducers({
  auth: authReducer,
  product: productReducer,
  navigation: navigationReducer,
    order: orderReducer, 
    contact: contactReducers,
    cart:cartReducer
});

// 3. Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 4. Configure your store with the persisted reducer
export const store = configureStore({
  reducer: persistedReducer, // Use the persisted reducer here
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types to prevent warnings about non-serializable values
        // when using redux-persist (especially with actions like FLUSH, REHYDRATE, etc.)
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// 5. Create a persistor
export const persistor = persistStore(store);

// Note: You no longer need `export default store;` if you are using named exports (`export const store`).
// If other files are currently importing it as `import store from '...'`, you'll need to change
// them to `import { store, persistor } from '...'`.