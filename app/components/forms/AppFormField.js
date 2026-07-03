import { useFormikContext } from "formik";

import AppTextInput from "../AppTextInput";
import ErrorMessage from "./ErrorMessage";

function AppFormField({ name, width = "100%", ...otherProps }) {
  const { errors, handleBlur, handleChange, submitCount, touched, values } =
    useFormikContext();
  const showError = touched[name] || submitCount > 0;

  return (
    <>
      <AppTextInput
        onBlur={handleBlur(name)}
        onChangeText={handleChange(name)}
        value={values[name]}
        width={width}
        {...otherProps}
      />
      <ErrorMessage error={errors[name]} visible={showError} />
    </>
  );
}

export default AppFormField;
