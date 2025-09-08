import React, { useEffect } from "react";
import { Button, Alert } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";

// Required for Expo Auth
WebBrowser.maybeCompleteAuthSession();

export default function GoogleSignInButton() {
  // Initialize Google OAuth
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "391610925993-5o0ip7v21nt8mrb40l3u2inlkj6rd0js.apps.googleusercontent.com"
  });

  // Handle OAuth response
  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      fetchUserInfo(authentication?.accessToken);
    }
  }, [response]);

  // Fetch Google user info
  const fetchUserInfo = async (accessToken?: string) => {
    if (!accessToken) return;

    try {
      const res = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const user = await res.json();
      Alert.alert("Logged in!", `Hello ${user.name}`);
      console.log(user);
    } catch (err) {
      console.error("Failed to fetch user info:", err);
    }
  };

  return (
    <Button
      title="Sign in with Google"
      disabled={!request}
      onPress={() => promptAsync()}
    />
  );
}
