import { useFormikContext } from "formik";

import ErrorMessage from "./ErrorMessage";

function FormStatusError() {
  const { status } = useFormikContext();
  return <ErrorMessage error={status} visible={Boolean(status)} />;
}

export default FormStatusError;
