import { SignedIn, SignedOut, SignInButton, UserButton,SignIn } from '@clerk/clerk-react';
import Account from './components/account';
import Home from './components/Home';
export default function App() {
  return (
    <header>
      <SignedOut>
        <SignIn />
      </SignedOut>
      <SignedIn>
      <Account/>
    <Home/>
        <UserButton />
      </SignedIn>
    </header>
  );
}