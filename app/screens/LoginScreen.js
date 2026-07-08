import { Image, StyleSheet, Text, View } from "react-native";
import { useFormikContext } from "formik";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";

import { signIn } from "../api/auth";
import AppForm from "../components/forms/AppForm";
import AppFormField from "../components/forms/AppFormField";
import ErrorMessage from "../components/forms/ErrorMessage";
import SubmitButton from "../components/forms/SubmitButton";
import ThemeToggle from "../components/ThemeToggle";
import { useAppTheme } from "../config/theme";
import { ROOT_ROUTES } from "../navigation/routes";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .required("Email is required.")
    .email("Enter a valid email address."),
  password: Yup.string()
    .required("Password is required.")
    .min(6, "Password must be at least 6 characters."),
});

function LoginScreen({ navigation }) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.screen} edges={["bottom"]}>
      <View style={styles.themeRow}>
        <ThemeToggle compact />
      </View>
      <View style={styles.container}>
        <Image source={require("../assets/logo-red.png")} style={styles.logo} />
        <Text style={styles.heading}>Welcome back</Text>

        <AppForm
          initialValues={{ email: "", password: "" }}
          onSubmit={async (values, { setStatus }) => {
            try {
              setStatus(null);
              await signIn(values);
              navigation.getParent()?.replace(ROOT_ROUTES.APP);
            } catch (error) {
              setStatus(error.message);
            }
          }}
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
          <FormStatusError />
          <SubmitButton title="Login" />
        </AppForm>
      </View>
    </SafeAreaView>
  );
}

function FormStatusError() {
  const { status } = useFormikContext();

  return <ErrorMessage error={status} visible={Boolean(status)} />;
}

const createStyles = (theme) =>
  StyleSheet.create({
  container: {
    padding: 20,
  },
  heading: {
    color: theme.foreground,
    fontSize: 30,
    fontWeight: "900",
    marginBottom: 24,
    textAlign: "center",
  },
  logo: {
    width: 90,
    height: 90,
    alignSelf: "center",
    marginTop: 36,
    marginBottom: 18,
  },
  screen: {
    flex: 1,
    backgroundColor: theme.background,
  },
  themeRow: {
    alignItems: "flex-end",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
});

export default LoginScreen;
