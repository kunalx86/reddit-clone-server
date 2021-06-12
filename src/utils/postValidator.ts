import { IPost } from "@shared/types";
import * as yup from "yup";

const PostSchema = yup.object().shape({
  title: yup
  .string()
  .min(2, "Title should be minimum 5 characters")
  .max(35, "Title cannot exceed 35 characters")
  .required("Title is a necessary field"),
})

export const validatePost = (post: IPost) => {
  return PostSchema.validate(post, { abortEarly: false });
}

export const errorVerifier = (err: yup.ValidationError) => {
  const errors = {
    title: "",
    media: {
      type: "",
      text: ""
    }
  } as any;
  for (const error of err.inner) {
    errors[error.path!] += `${error.message}, `;
  }
  return errors;
}