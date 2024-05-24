import { checkSchema } from "express-validator";

const adminActionValidation = () => {
  return checkSchema({
    id: {
      notEmpty: true,
      errorMessage: "Admin id is required.",
    },
    process: {
      notEmpty: {
        errorMessage: "Process name is required.",
      },
    },
    data: {
      optional: true,
    },
  });
};

const adminTransactionValidation = () => {
  return checkSchema({
    id: {
      notEmpty: true,
      errorMessage: "Admin id is required.",
    },
    process: {
      notEmpty: true,
      errorMessage: "Transfer type if required.",
    },
    data: {
      notEmpty: true,
      errorMessage: "Data is required.",
    },
    "data.userEmail": {
      optional: true,
      isEmail: {
        errorMessage: "Invalid email.",
      },
    },
    "data.senderEmail": {
      optional: true,
      isEmail: {
        errorMessage: "Invalid email",
      },
    },
    "data.receiverEmail": {
      optional: true,
      isEmail: {
        errorMessage: "Invalid email",
      },
    },
    "data.transferAmount": {
      isDecimal: {
        errorMessage: "Invalid transfer amount. It must be decimal.",
      },
    },
    "data.note": {
      optional: true,
      default: "",
    },
  });
};

export { adminActionValidation, adminTransactionValidation };
