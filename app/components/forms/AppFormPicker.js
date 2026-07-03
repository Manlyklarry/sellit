import { useFormikContext } from "formik";

import AppPicker from "../AppPicker";
import ErrorMessage from "./ErrorMessage";

function AppFormPicker({ items, name, placeholder, title }) {
  const { errors, setFieldTouched, setFieldValue, submitCount, touched, values } =
    useFormikContext();
  const showError = touched[name] || submitCount > 0;

  return (
    <>
      <AppPicker
        items={items}
        selectedItem={values[name]}
        onSelectItem={(item) => {
          setFieldValue(name, item);
          setFieldTouched(name, true);
        }}
        placeholder={placeholder}
        title={title}
      />
      <ErrorMessage error={errors[name]} visible={showError} />
    </>
  );
}

export default AppFormPicker;
