import { useAuth, useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useSyncUserMutation } from "@/features/api/authApi.js";

export default function ClerkSync() {
  const { isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const [syncUser] = useSyncUserMutation();

  useEffect(() => {
    if (!isSignedIn) return;

    (async () => {
      const token = await getToken();
      
      await syncUser({
        email: user.primaryEmailAddress.emailAddress,
        token
      });
    })();
  }, [isSignedIn]);

  return null;
}
