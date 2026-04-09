import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import HomeScreen from "./src/screens/HomeScreen";
import SignInScreen from "./src/screens/SignInScreen";
import SecurityQuestionsScreen from "./src/screens/SecurityQuestionsScreen";
import LogInScreen from "./src/screens/LogInScreen";
import ForgotPasswordScreen from "./src/screens/ForgotPasswordScreen";
import BookDetailsScreen from "./src/screens/BookDetailsScreen";
import MyLibraryScreen from "./src/screens/MyLibraryScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Login" component={LogInScreen} />

          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen
            name="SecurityQuestions"
            component={SecurityQuestionsScreen}
          />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
          />
          <Stack.Screen name="BookDetails" component={BookDetailsScreen} />
          <Stack.Screen name="MyLibrary" component={MyLibraryScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
