import { Image, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";

import AppForm from "../components/forms/AppForm";
import AppFormField from "../components/forms/AppFormField";
import SubmitButton from "../components/forms/SubmitButton";
import colors from "../config/colors";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .required("Email is required.")
    .email("Enter a valid email address."),
  password: Yup.string()
    .required("Password is required.")
    .min(6, "Password must be at least 6 characters."),
});

function LoginScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <Image source={require("../assets/logo-red.png")} style={styles.logo} />

        <AppForm
          initialValues={{ email: "", password: "" }}
          onSubmit={(values) => console.log("Login", values)}
          validationSchema={validationSchema}
        >
          <AppFormField
            autoCapitalize="none"
            autoCorrect={false}
            icon="email"
            keyboardType="email-address"
            name="email"
            placeholder="Email"
            textContentType="emailAddress"
          />
          <AppFormField
            autoCapitalize="none"
            autoCorrect={false}
            icon="lock"
            name="password"
            placeholder="Password"
            secureTextEntry
            textContentType="password"
          />
          <SubmitButton title="Login" />
        </AppForm>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  logo: {
    width: 90,
    height: 90,
    alignSelf: "center",
    marginTop: 36,
    marginBottom: 40,
  },
  screen: {
    flex: 1,
    backgroundColor: colors.light,
  },
});

export default LoginScreen;
