import { checkSchema, matchedData } from "express-validator";

const validationForDeactivate = () => {
  return checkSchema({
    managerId: {
      notEmpty: true,
      errorMessage: "Manager ID is required.",
    },
    process: {
      notEmpty: true,
      errorMessage: "Process name is required.",
    },
    data: {
      notEmpty: true,
      errorMessage: "Data field is required.",
    },
    "data.adminCode": {
      notEmpty: true,
      errorMessage: "Admin's personal code is required to deactivate.",
    },
  });
};

const adminActionValidation = async (req, res, next) => {
  const { process } = matchedData(req);
  switch (process) {
    case "deactivate":
      await validationForDeactivate().run(req);
      break;
    case "search":
      await validationForDeactivate().run(req);
      break;
  }
  next();
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
      custom: {
        options: (value) => {
          return value > 0;
        },
        errorMessage: "Invalid amount",
      },
    },
    "data.note": {
      optional: true,
      default: "",
    },
  });
};

const validationForListOfTransaction = () => {
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
      notEmpty: true,
      isEmail: {
        errorMessage: "Invalid email",
      },
    },
  });
};

const validationForWithdrawOrDeposit = () => {
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
      notEmpty: true,
      isEmail: {
        errorMessage: "Invalid email",
      },
    },
    "data.amount": {
      notEmpty: true,
      isDecimal: true,
      custom: {
        options: (value) => {
          return value > 0;
        },
        errorMessage: "Invalid amount",
      },
      errorMessage: "Invalid amount",
    },
  });
};

const transactionValidation = async (req, res, next) => {
  const { process } = matchedData(req);
  switch (process) {
    case "transfer":
      await validationForTransfer().run(req);
      break;
    case "withdraw":
      await validationForWithdrawOrDeposit().run(req);
      break;
    case "list":
      await validationForListOfTransaction().run(req);
      break;
  }
  next();
};

export { adminActionValidation, transactionValidation };
