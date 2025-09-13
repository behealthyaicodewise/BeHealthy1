import React, { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View, ImageBackground, Image } from "react-native";
import { GoogleSignin, GoogleSigninButton, isSuccessResponse } from "@react-native-google-signin/google-signin";
import { auth, db } from "../app/firebaseConfig"; 
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { router } from "expo-router";

export default function GoogleLoginScreen() {
  useEffect(() => {
    GoogleSignin.configure({
      iosClientId: "977288697284-8bp0gmqob1f2s4hg64demnuie7u1b6tk.apps.googleusercontent.com",
      webClientId: "977288697284-lom6b9709omif2dk9ajjoeq92k0tvnc3.apps.googleusercontent.com",
      profileImageSize: 150,
    });
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response)) {
        console.log("Google Sign-In successful, User ID:", response);
        const { idToken } = await GoogleSignin.getTokens();
        console.log("Google Sign-In successful, ID Token:", idToken);
        const googleCredential = GoogleAuthProvider.credential(idToken);
        const userCredential = await signInWithCredential(auth, googleCredential);
        const user = userCredential.user;

        await setDoc(
          doc(db, "users", user.uid),
          {
            name: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            createdAt: serverTimestamp(),
          },
          { merge: true }
        );
      }
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/images/bg.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>

        {/* Body */}
        <View style={styles.body}>
          <Text style={styles.welcome}>Welcome back!</Text>
            <TouchableOpacity style={{borderColor:'#000' , borderWidth:1,flexDirection:'row' , width:'100%', justifyContent:'center', paddingVertical:14,borderRadius:50}} onPress={handleGoogleSignIn}>
              <Image
                source={require("../assets/images/google.jpg")}
                style={{ width: 24, height: 24, marginRight: 10 }}
              />
              <Text style={styles.googleButtonText}>Sign in with Google</Text>
            </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "rgba(0,0,0,0.3)", // optional overlay for readability
    paddingHorizontal: 30,
  },
  logoText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 60,
  },
  body: {
    width: "100%",
    alignItems: "center",
    position: "absolute",
    bottom :250
  },
  welcome: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 40,
    color: "#000",
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 14,
    borderRadius: 30,
    width: "80%",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  googleIcon: {
    width: 22,
    height: 22,
    marginRight: 10,
  },
  googleButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
});