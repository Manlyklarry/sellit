import { signIn } from "../api/auth";
import AuthScreenLayout from "../components/auth/AuthScreenLayout";
import AppForm from "../components/forms/AppForm";
import AppFormField from "../components/forms/AppFormField";
import FormStatusError from "../components/forms/FormStatusError";
import SubmitButton from "../components/forms/SubmitButton";
import { ROOT_ROUTES } from "../navigation/routes";
import { loginValidationSchema } from "../validation/authSchemas";

function LoginScreen({ navigation }) {
  return (
    <AuthScreenLayout title="Welcome back">
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
          validationSchema={loginValidationSchema}
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
    </AuthScreenLayout>
  );
}

export default LoginScreen;
