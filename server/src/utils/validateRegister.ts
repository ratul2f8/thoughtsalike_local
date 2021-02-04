import { UsernamePasswordInput } from "src/resolvers/users";
import { UserResponse } from "./FieldError";

export function validateEmail(email: string): boolean {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email.toLowerCase());
}

export function checkRequirements(
  options: UsernamePasswordInput
): UserResponse {
  if (options.username.length <= 2) {
    return {
      errors: [
        {
          field: "username",
          message: "Length of the username must be greater than 2!",
        },
      ],
    };
  }
  if (validateEmail(options.username)) {
    return {
      errors: [
        {
          field: "username",
          message: "Username not in correct form![@,.com]",
        },
      ],
    };
  }
  if (options.password.length <= 2) {
    return {
      errors: [
        {
          field: "password",
          message: "Length of the password must be greater than 2!",
        },
      ],
    };
  }
  if (!validateEmail(options.email)) {
    return {
      errors: [
        {
          field: "email",
          message: "Email is not in correct form!",
        },
      ],
    };
  }
  return {
    errors: [],
  };
}
