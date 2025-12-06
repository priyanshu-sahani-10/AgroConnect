import { SignedIn, SignedOut, SignInButton, UserButton,SignIn } from '@clerk/clerk-react';

export default function App() {
  return (
    <header>
      <SignedOut>
        <SignIn />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
  );
}