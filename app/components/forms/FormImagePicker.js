import { useFormikContext } from "formik";

import ImageInputList from "../ImageInputList";
import ErrorMessage from "./ErrorMessage";

function FormImagePicker({ imageLimit = 6, name }) {
  const {
    errors,
    setFieldError,
    setFieldTouched,
    setFieldValue,
    submitCount,
    touched,
    validateField,
    values,
  } = useFormikContext();
  const imageUris = values[name] || [];
  const showError = touched[name] || submitCount > 0;
  const imageCountIsValid =
    imageUris.length > 0 && imageUris.length <= imageLimit;
  const error = imageCountIsValid ? null : errors[name];

  const updateImages = async (nextImageUris) => {
    await setFieldValue(name, nextImageUris, true);
    setFieldTouched(name, true, false);

    if (nextImageUris.length > 0) setFieldError(name, undefined);
    await validateField(name);
  };

  const handleAdd = async (uri) => {
    if (imageUris.length >= imageLimit) {
      setFieldTouched(name, true, false);
      setFieldError(name, `You can add up to ${imageLimit} photos.`);
      return;
    }

    await updateImages([...imageUris, uri]);
  };

  const handleRemove = async (uri) => {
    await updateImages(imageUris.filter((imageUri) => imageUri !== uri));
  };

  return (
    <>
      <ImageInputList
        imageUris={imageUris}
        imageLimit={imageLimit}
        onAddImage={handleAdd}
        onRemoveImage={handleRemove}
      />
      <ErrorMessage error={error} visible={showError} />
    </>
  );
}

export default FormImagePicker;
