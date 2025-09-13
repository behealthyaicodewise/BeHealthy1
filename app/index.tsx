import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    console.log("Auth object:", auth); // Debugging line
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    // Optional: Show a loading screen while checking auth
    return null;
  }

  if (user) {
    // If user is logged in, redirect to main tabs
    return <Redirect href="/(tabs)" />;
  } else {
    // If user is not logged in, redirect to login screen
    return <Redirect href="/login" />;
  }
}