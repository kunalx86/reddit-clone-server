import { IGroup } from "@shared/types";
import * as yup from "yup";

const GroupValidator = yup.object().shape({
  name: yup
  .string()
  .min(3, "Group should be atleast 3 charaters long")
  .max(20, "Group name should not exceed 20 characters")
  .matches(/^[a-zA-Z]([A-Za-z0-9_-]){3,20}$/, "Group name must begin with a character and can contain alphanumeric characters and '_' '-' special characters")
  .required("Group name is necessary"),
  bio: yup
  .string()
  .min(2, "Description should have 2 characters")
  .max(60, "Description should not exceed 60 characters")
  .required("Description is necessary"),
});

export const groupValidator = (group: IGroup) => {
  return GroupValidator.validate(group, { abortEarly: false });
}

export const errorVerifier = (err: yup.ValidationError) => {
  const errors = {
    name: "",
    bio: "",
  } as any;
  for (const error of err.inner) {
    errors[error.path!] += `${error.message}, `;
  }
  return errors;
}