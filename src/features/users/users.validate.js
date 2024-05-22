import { checkSchema } from "express-validator";

const createUserValidation = () => {
  return checkSchema({
    name: {
      notEmpty: true,
      isAlpha: true,
      errorMessage: "Name must contain only alphabet.",
    },
    password: {
      notEmpty: true,
      isStrongPassword: true,
      isLength: {
        options: { min: 8 },
        errorMessage: "Password must be at least 8 characters.",
      },
      errorMessage:
        "Password must be strong. At least one uppercase letter, one lowercase letter, one digit and one special character.",
    },
    email: {
      notEmpty: {
        errorMessage: "Email must not empty.",
      },
      isEmail: true,
      errorMessage: "Invalid email",
    },
    stateCode: {
      notEmpty: true,
      errorMessage: "StateCode must not empty.",
    },
    townshipCode: {
      notEmpty: true,
      errorMessage: "TownshipCode must not empty.",
    },
    adminId: {
      notEmpty: true,
      errorMessage: "AdminId must not empty.",
    },
  });
};

export { createUserValidation };
