import { SignedIn, SignedOut, SignInButton, UserButton,SignIn, SignUp } from '@clerk/clerk-react';
import Account from './components/pages/Account';
import Home from './components/pages/Home';
import Footer from './components/pages/Footer';
import Navbar from './components/pages/Navbar';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/pages/Layout';
export default function App() {
  return (
    <>
    <Routes>
      <Route path='/' element={<Layout/>}>
        <Route index element={<Home/>}/>
        <Route path="sign-in" element={<SignIn/>}/>
        <Route path="sign-up" element={<SignUp/>}/>
        <Route path="create-account" element={<Account/>}/>
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