import { Image, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";

import AppForm from "../components/forms/AppForm";
import AppFormField from "../components/forms/AppFormField";
import SubmitButton from "../components/forms/SubmitButton";
import colors from "../config/colors";

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required.")
    .min(2, "Name must be at least 2 characters."),
  email: Yup.string()
    .required("Email is required.")
    .email("Enter a valid email address."),
  password: Yup.string()
    .required("Password is required.")
    .min(6, "Password must be at least 6 characters."),
});

function RegisterScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <Image source={require("../assets/logo-red.png")} style={styles.logo} />

        <AppForm
          initialValues={{ name: "", email: "", password: "" }}
          onSubmit={(values) => console.log("Register", values)}
          validationSchema={validationSchema}
        >
          <AppFormField
            autoCapitalize="words"
            autoCorrect={false}
            icon="account"
            name="name"
            placeholder="Name"
            textContentType="name"
          />
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
            textContentType="newPassword"
          />
          <SubmitButton title="Register" />
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
    marginTop: 28,
    marginBottom: 36,
  },
  screen: {
    flex: 1,
    backgroundColor: colors.light,
  },
});

export default RegisterScreen;
