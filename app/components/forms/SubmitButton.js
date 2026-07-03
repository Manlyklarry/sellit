import { useFormikContext } from "formik";

import AppButton from "../AppButton";

function SubmitButton({ title }) {
  const { handleSubmit, isSubmitting } = useFormikContext();

  return (
    <AppButton
      title={isSubmitting ? "Please wait..." : title}
      onPress={handleSubmit}
    />
  );
}

export default SubmitButton;
