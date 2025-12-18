import { SignedIn, SignedOut, SignInButton, UserButton,SignIn, SignUp } from '@clerk/clerk-react';
import Account from './components/pages/Account';
import Home from './components/pages/Home';
import Footer from './components/pages/Footer';
import Navbar from './components/pages/Navbar';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/pages/Layout';
import Marketplace from './components/pages/Marketplace';
import MyProducts from './components/pages/MyProducts';
import Orders from './components/pages/Orders';
import Chats from './components/pages/Chats';
import RegisterCrop from './components/pages/RegisterCrop';
import Profile from './components/pages/Profile';
import EditProfile from './components/pages/EditProfile';
import UpdateUserCrop from './components/pages/UpdateUserCrop';
import MyOrders from './components/pages/MyOrders';
import SingleCrop from './components/pages/SingleCrop';
import Cart from './components/pages/Cart';
export default function App() {
  return (
    <>
    <Routes>
      <Route path='/' element={<Layout/>}>
        <Route index element={<Home/>}/>
        <Route path="sign-in" element={<SignIn/>}/>
        <Route path="sign-up" element={<SignUp/>}/>
        <Route path="create-account" element={<Account/>}/>
        <Route path="marketplace" element={<Marketplace/>}/>
        <Route path="marketplace/:cropId" element={<SingleCrop/>}/>
        <Route path="my-products" element={<MyProducts/>}/>
        <Route path="orders" element={<Orders/>}/>
        <Route path="chat" element={<Chats/>}/>
        <Route path="register-crop" element={<RegisterCrop/>}/>
        <Route path="profile" element={<Profile/>}/>
        <Route path="edit-profile" element={<EditProfile/>}/>
        <Route path="updateCrop/:cropId" element={<UpdateUserCrop/>}/>
        <Route path="my-orders" element={<MyOrders/>}/>
        <Route path="cart-items" element={<Cart/>}/>

        <Route/>
      </Route>
    </Routes>
    </>
    // <header>
    //   {/* <SignedOut>
    //     <SignIn />
    //   </SignedOut> */}
    //   {/* <SignedIn> */}
    //     <Navbar/>
    //   <Account/>
    //   <Home/>
    //   <Footer/>
    //     <UserButton />
    //   {/* </SignedIn> */}
    // </header>
  );
}