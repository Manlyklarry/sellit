import { useFormikContext } from "formik";

import AppTextInput from "../AppTextInput";
import ErrorMessage from "./ErrorMessage";

function AppFormField({ name, width = "100%", ...otherProps }) {
  const { errors, handleBlur, handleChange, touched, values } =
    useFormikContext();

  return (
    <>
      <AppTextInput
        onBlur={handleBlur(name)}
        onChangeText={handleChange(name)}
        value={values[name]}
        width={width}
        {...otherProps}
      />
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </>
  );
}

export default AppFormField;
