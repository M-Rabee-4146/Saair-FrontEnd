import React from 'react'
import Home from './Pages/Home'
import Login from './Pages/Login'
import Signup from './Pages/Signup'
import './fonts.css'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import ResetPassword from './Pages/ResetPassword'
import { Toaster } from 'react-hot-toast'
import { store, persistor } from './Redux/Store/Store'
import { Provider } from 'react-redux'
import LoginChecker from './Protector/LoginChecker'
import Shop from './Pages/Shop'
import ContactUs from './Pages/ContactUs'
import AuthGuard from './Protector/AuthGuard'
import UploadProduct from './Dashboard/UploadProduct'
import DashboardLayout from './Dashboard/DashboardLayout'
import Services from './Dashboard/Services'
import AdminDashboard from './Dashboard/AdminDashboard'
import DashboardOverview from './Dashboard/DashboardOverview'
import ManageProducts from './Dashboard/ManageProducts'
import { PersistGate } from 'redux-persist/integration/react'
import AdminProductDetails from './Dashboard/AdminProductDetails'
import AdminOrders from './Dashboard/AdminOrders'
import AdminSales from './Dashboard/AdminSales'
import AdminEditProduct from './Dashboard/AdminProductEdit'
import AboutUsPage from './Pages/AboutUsPage'
import ContactUsForms from './Dashboard/ContactUsForms'
import ProductDetailPage from './Pages/Product-detail'
import CartPage from './Pages/CartPage'
import CheckoutPage from './Pages/Checkoutpage'
import OrderConfirmation from './Pages/OrderConfirmation'
import AdminOrderDetail from './Dashboard/AdminOrderDetails'
import AIChat from 'utils/Ai_chat'

const App = () => {
  return (
    <div>
      <Toaster />
      <BrowserRouter>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/Signup" element={<Signup />} />
              <Route path="/Login" element={<Login />} />
              <Route path='/Reset/:Token' element={<ResetPassword />} />
              <Route path="/Shop" element={<Shop />} />
              <Route path="/Shop/:initialSearchTerm?" element={<Shop />} />
              <Route path="/Contact-Us" element={<ContactUs />} />
              <Route path="/About" element={<AboutUsPage />} />
              <Route path="/AI" element={<AIChat />} />
              <Route path="/Cart" element={<AuthGuard requireAdmin={false}><CartPage /></AuthGuard>} />
              <Route path="/Checkout" element={<AuthGuard requireAdmin={false}><CheckoutPage /></AuthGuard>} />
              <Route path="/Product/:id" element={<ProductDetailPage />} />
              <Route path="/Order-confirmation/:id" element={<OrderConfirmation />} />

              <Route path="/Dashboard/" element={<AuthGuard requireAdmin={true}> <DashboardLayout /></AuthGuard>}>
                <Route index element={<AdminDashboard />} />
                <Route path="overview" element={<DashboardOverview />} />
                <Route path="services" element={<Services />} />
                <Route path="manage-products" element={<ManageProducts />} />
                <Route path="upload-product" element={<UploadProduct />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="order-details/:id" element={<AdminOrderDetail />} />
                <Route path="sales" element={<AdminSales />} />
                <Route path="contact-forms" element={<ContactUsForms />} />
                <Route path="product-detail/:id" element={<AdminProductDetails />} />
                <Route path="product-edit/:id" element={<AdminEditProduct />} />
              </Route>

            </Routes>
          </PersistGate>
        </Provider>
      </BrowserRouter>
    </div>
  )
}

export default App
