import * as Yup from "yup";

import {
  PROFILE_LIMITS,
  validateUsername,
} from "../../shared/profileValidation";

const PASSWORD_MIN_LENGTH = 8;

const email = Yup.string()
  .required("Email is required.")
  .email("Enter a valid email address.");

const password = Yup.string()
  .required("Password is required.")
  .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`);

export const loginValidationSchema = Yup.object({ email, password });

export const registerValidationSchema = Yup.object({
  email,
  name: Yup.string()
    .required("Name is required.")
    .min(
      PROFILE_LIMITS.displayNameMin,
      `Name must be at least ${PROFILE_LIMITS.displayNameMin} characters.`
    )
    .max(
      PROFILE_LIMITS.displayNameMax,
      `Name must be ${PROFILE_LIMITS.displayNameMax} characters or less.`
    ),
  password,
  username: Yup.string().test("username-format", function validate(value) {
    const message = validateUsername(value);
    return message ? this.createError({ message }) : true;
  }),
});
