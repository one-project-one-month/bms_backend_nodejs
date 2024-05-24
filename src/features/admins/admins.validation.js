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

const validationForTransfer = () => {
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
    "data.senderEmail": {
      notEmpty: true,
      isEmail: {
        errorMessage: "Invalid email",
      },
    },
    "data.receiverEmail": {
      notEmpty: true,
      isEmail: {
        errorMessage: "Invalid email",
      },
    },
    "data.transferAmount": {
      notEmpty: true,
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

const transactionValidation = async (req, res, next) => {
  await validationForTransfer().run(req);
  next();
};

export { adminActionValidation, transactionValidation };
