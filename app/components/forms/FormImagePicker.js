import { useFormikContext } from "formik";

import ImageInputList from "../ImageInputList";
import ErrorMessage from "./ErrorMessage";

function FormImagePicker({ name }) {
  const { errors, setFieldTouched, setFieldValue, touched, values } =
    useFormikContext();
  const imageUris = values[name] || [];

  const handleAdd = (uri) => {
    setFieldValue(name, [...imageUris, uri]);
    setFieldTouched(name, true);
  };

  const handleRemove = (uri) => {
    setFieldValue(
      name,
      imageUris.filter((imageUri) => imageUri !== uri)
    );
    setFieldTouched(name, true);
  };

  return (
    <>
      <ImageInputList
        imageUris={imageUris}
        onAddImage={handleAdd}
        onRemoveImage={handleRemove}
      />
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </>
  );
}

export default FormImagePicker;
