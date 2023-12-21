// web 977580317228-b1b042s4k7nqb1i6t56ll7ktb3mhdhgm.apps.googleusercontent.com
// secret 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
// android 977580317228-ddeu8gl50ookphclcf5nikch31n6dj8a.apps.googleusercontent.com

import * as React from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button } from "react-native-web";




WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [userInfo, setUserInfo] = React.useState(null);
  const [request, response, promptAsync]= Google.useAuthRequest({
    androidClientId: 
      "977580317228-ddeu8gl50ookphclcf5nikch31n6dj8a.apps.googleusercontent.com",
    webClientId:
      "977580317228-b1b042s4k7nqb1i6t56ll7ktb3mhdhgm.apps.googleusercontent.com"
  })

  React.useEffect(() => {
    handleSignInWithGoogle();
  }, [response]);

  async function handleSignInWithGoogle() {
    const user = await AsyncStorage.getItem("@user");
    if (!user) {
      if(response?.type === "sucess") {
        await getUserInfo(response.authentication.acessToken);
      }
    } else {
      setUserInfo(JSON.parse(user));
    }
  }

  const getUserInfo = async (token) => {
    if (!token) return;
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const user = await response.json();
      await AsyncStorage.setItem("@user", JSON.stringify(user));
      setUserInfo(user);
    } catch (error) {

    }
  };

  return (
    <View style={styles.container}>
    {!userInfo ? (
      <Button
        title="Sign in With Google"
        disabled={!request}
        onPress={()=> {
          promptAsync();
        }}
      />
    ) : (
      <View style={styles.card}>
        {userInfo?.picture && (
          <Image source={{ uri: userInfo?.picture }} style={styles.image} />
        )};
      <Text style={styles.text}>Email: {userInfo.email}</Text>
      <Text style={styles.text}>Name: {userInfo.name}</Text>
      </View>
    )}
      <Button 
        title="remove local Storage" 
        onPress={async () => await AsyncStorage.removeItem("@user")}
         />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
  card: {
    borderWidth: 1,
    borderRadius: 15,
    padding: 15,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});
