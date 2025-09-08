import React, { useEffect } from "react";
import { Button, Alert, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";

WebBrowser.maybeCompleteAuthSession();

export default function GoogleSignInButton() {
  // Configure request with useProxy here
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "391610925993-5o0ip7v21nt8mrb40l3u2inlkj6rd0js.apps.googleusercontent.com",
    webClientId: "391610925993-p689s8oqup1qpkc2700roj7iuauqv2hs.apps.googleusercontent.com",
    scopes: ["profile", "email"],
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      fetchUserInfo(authentication?.accessToken);
    }
  }, [response]);

  const fetchUserInfo = async (accessToken?: string) => {
    if (!accessToken) return;

    try {
      const res = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const user = await res.json();
      console.log("User Info:", user);
      Alert.alert("Logged in!", `Hello ${user.name}`);
    } catch (err) {
      console.error("Failed to fetch user info:", err);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button
        title="Sign in with Google"
        disabled={!request}
        onPress={() => promptAsync()} // no useProxy here
      />
    </View>
  );
}
