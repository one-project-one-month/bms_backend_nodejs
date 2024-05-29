import { checkSchema } from "express-validator";

const updateUserValidation = () => {
  return checkSchema({
    username: {
      notEmpty: {
        errorMessage: "Username is required.",
      },
    },
    data: {
      notEmpty: true,
      errorMessage: "Data is required.",
    },
    "data.name": {
      optional: true,
    },
    "data.password": {
      optional: true,
      isStrongPassword: true,
      isLength: {
        options: { min: 8 },
        errorMessage: "Password must be at least 8 characters.",
      },
      errorMessage:
        "Password must contain 1 uppercase, 1 lowercase, 1 digit and 1 special character.",
    },
    "data.balance": {
      notEmpty: true,
      isDecimal: true,
      custom: {
        options: (value) => {
          return value > 0;
        },
        errorMessage: "Balance must be greater than 0.",
      },
      errorMessage: "Invalid amount",
    },
    "data.email": {
      optional: true,
      isEmail: true,
      errorMessage: "Invalid email",
    },
    "data.stateCode": {
      optional: true,
    },
    "data.townshipCode": {
      optional: true,
    },
    "data.adminId": {
      optional: true,
    },
  });
};

const createUserValidation = () => {
  return checkSchema({
    name: {
      notEmpty: true,
      errorMessage: "User name is required.",
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
    adminCode: {
      notEmpty: true,
      errorMessage: "Admin code is required.",
    },
  });
};

const userActionsValidation = () => {
  return checkSchema({
    username: {
      notEmpty: {
        errorMessage: "Username is required.",
      },
    },
    process: {
      notEmpty: true,
      errorMessage: "Process name is required.",
    },
    data: {
      optional: true,
    },
  });
};

export { createUserValidation, updateUserValidation, userActionsValidation };
