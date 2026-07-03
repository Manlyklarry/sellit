import { useFormikContext } from "formik";

import AppPicker from "../AppPicker";
import ErrorMessage from "./ErrorMessage";

function AppFormPicker({ items, name, placeholder, title }) {
  const { errors, setFieldTouched, setFieldValue, touched, values } =
    useFormikContext();

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
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </>
  );
}

export default AppFormPicker;
