import { IUser } from "@shared/types";
import * as yup from "yup";

const RegisterSchema = yup.object().shape({
  email: yup
  .string()
  .email("Email is not valid")
  .required("Email is a necessary field"),
  username: yup
  .string()
  .min(3, "Username should be 3 characters at least")
  .max(15, "Username should not exceed 15 characters")
  .matches(/^[a-zA-Z0-9]([_]|[a-zA-Z0-9]){2,15}[a-zA-Z0-9]$/, "Username must begin with alphanumberic character, can have _ and must end with alphanumeric character")
  .required("Username is a necessary field"),
  password: yup
  .string()
  .min(8, "Password should be 8 characters at least")
  .max(150, "Password should not exceed 150 characters")
  .matches(/^[a-zA-Z](?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&-+=()]).{3,15}$/, "Password must begin with an alphanumeric character and should include numeric, lower, upper case characters and one special character")
  .required("Password is a necessary field")
})

export const registerValidator = async (user: IUser) => {
  return await RegisterSchema.validate(user, { abortEarly: false });
}

export const errorVerifier = (err: yup.ValidationError) => {
  const errors = {
    username: "",
    password: "",
    email: "",
  } as any;
  for (const error of err.inner) {
    errors[error.path!] += `${error.message}, `;
  }
  return errors;
}