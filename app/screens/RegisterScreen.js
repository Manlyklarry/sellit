import { Alert } from "react-native";

import { signUp } from "../api/auth";
import { updateProfile } from "../api/users";
import { getCurrentUser } from "../auth/session";
import { saveSellingType } from "../auth/onboarding";
import AuthScreenLayout from "../components/auth/AuthScreenLayout";
import AppForm from "../components/forms/AppForm";
import AppFormField from "../components/forms/AppFormField";
import FormStatusError from "../components/forms/FormStatusError";
import SubmitButton from "../components/forms/SubmitButton";
import { AUTH_ROUTES, ROOT_ROUTES } from "../navigation/routes";
import { registerValidationSchema } from "../validation/authSchemas";

function RegisterScreen({ navigation, route }) {
  return (
    <AuthScreenLayout title="Create account">
        <AppForm
          initialValues={{ name: "", username: "", email: "", password: "" }}
          onSubmit={async (values, { setStatus }) => {
            try {
              setStatus(null);
              await signUp(values);
              if (values.username.trim()) {
                try {
                  await updateProfile({
                    name: values.name,
                    user: await getCurrentUser(),
                    username: values.username,
                  });
                } catch (profileError) {
                  Alert.alert(
                    "Account created",
                    `${profileError.message} You can update your profile from the Account tab.`
                  );
                }
              }
              if (route.params?.onboarding) {
                if (route.params.sellingType) {
                  await saveSellingType(route.params.sellingType);
                }
                navigation.replace(AUTH_ROUTES.ONBOARDING_SUCCESS, {
                  sellingType: route.params.sellingType,
                });
              } else {
                navigation.getParent()?.replace(ROOT_ROUTES.APP);
              }
            } catch (error) {
              setStatus(error.message);
            }
          }}
          validationSchema={registerValidationSchema}
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
            icon="at"
            name="username"
            placeholder="Username"
            textContentType="username"
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
          <FormStatusError />
          <SubmitButton title="Register" />
        </AppForm>
    </AuthScreenLayout>
  );
}

export default RegisterScreen;
