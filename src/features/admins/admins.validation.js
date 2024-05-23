import { checkSchema } from "express-validator";

const adminActionValidation = () => {
  return checkSchema({
    id: {
      notEmpty: true,
      errorMessage: "Admin id is required.",
    },
    data: {
      notEmpty: true,
      errorMessage: "Data is required.",
    },
    "data.name": {
      notEmpty: true,
      errorMessage: "Action name is required.",
    },
  });
};

const adminTransactionValidation = () => {
  return checkSchema({
    id: {
      notEmpty: true,
      errorMessage: "Admin id is required.",
    },
    type: {
      notEmpty: true,
      errorMessage: "Transfer type if required.",
    },
    data: {
      notEmpty: true,
      errorMessage: "Data is required.",
    },
    "data.senderEmail": {
      isEmail: {
        errorMessage: "Invalid email",
      },
    },
    "data.receiverEmail": {
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
