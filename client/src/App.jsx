import { SignedIn, SignedOut, SignInButton, UserButton,SignIn, SignUp } from '@clerk/clerk-react';
import Account from './components/pages/Account';
import Home from './components/pages/Home';
import Footer from './components/pages/Footer';
import Navbar from './components/pages/Navbar';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/pages/Layout';
import Marketplace from './components/pages/Marketplace';
import MyProducts from './components/pages/MyProducts';
import RegisterCrop from './components/pages/RegisterCrop';
import Profile from './components/pages/Profile';
import EditProfile from './components/pages/EditProfile';
import UpdateUserCrop from './components/pages/UpdateUserCrop';
import MyOrders from './components/pages/MyOrders';
import SingleCrop from './components/pages/SingleCrop';
import Cart from './components/pages/Cart';
import LandingPage from './components/pages/LandingPage';
import SignUpPage from './components/pages/SignUpPage';
import SignInPage from './components/pages/SignInPage';
import AdminUsersPage from './components/pages/AdminUsersPage';
import AdminOrdersPage from './components/pages/AdminOrdersPage';
import FarmerOnboardingPage from './components/pages/Farmer';
import BuyerOnboardingPage from './components/pages/Buyer';
export default function App() {
  return (
    <>
    <Routes>
      <Route path='/' element={<Layout/>}>
        <Route index element={<Home/>}/>
        <Route path="farmer" element={<FarmerOnboardingPage/>}/>
        <Route path="buyer" element={<BuyerOnboardingPage/>}/>
        <Route path="sign-in" element={<SignInPage/>}/>
        <Route path="sign-up" element={<SignUpPage/>}/>
        <Route path="create-account" element={<Account/>}/>
        <Route path="marketplace" element={<Marketplace/>}/>
        <Route path="marketplace/:cropId" element={<SingleCrop/>}/>
        <Route path="my-products" element={<MyProducts/>}/>
        <Route path="register-crop" element={<RegisterCrop/>}/>
        <Route path="profile" element={<Profile/>}/>
        <Route path="edit-profile" element={<EditProfile/>}/>
        <Route path="updateCrop/:cropId" element={<UpdateUserCrop/>}/>
        <Route path="my-orders" element={<MyOrders/>}/>
        <Route path="cart-items" element={<Cart/>}/>
        <Route path="landing-page" element={<LandingPage/>}/>
        <Route path="getAllUsers" element={<AdminUsersPage/>}/>
        <Route path="getAllOrders" element={<AdminOrdersPage/>}/>

        <Route/>
      </Route>
    </Routes>
    </>

  );
}