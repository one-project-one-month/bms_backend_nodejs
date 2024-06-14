import { checkSchema, matchedData } from "express-validator";

const createAdminValidation = () => {
  return checkSchema({
    name: {
      notEmpty: true,
    },
    password: {
      notEmpty: true,
    },
    role: {
      notEmpty: true,
    },
  });
};

const adminActionsValidation = () => {
  return checkSchema({
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

const validationForTransfer = () => {
  return checkSchema({
    process: {
      notEmpty: true,
      errorMessage: "Transfer type if required.",
    },
    data: {
      notEmpty: true,
      errorMessage: "Data is required.",
    },
    "data.sender": {
      notEmpty: {
        errorMessage: "Sender is required.",
      },
    },
    "data.receiver": {
      notEmpty: {
        errorMessage: "Receiver is required.",
      },
    },
    "data.transferAmount": {
      isDecimal: {
        errorMessage: "Invalid transfer amount. It must be decimal.",
      },
      custom: {
        options: (value) => {
          return value > 0;
        },
        errorMessage: "Amount must be greater than 0.",
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
    process: {
      notEmpty: true,
      errorMessage: "Transfer type if required.",
    },
    data: {
      notEmpty: true,
      errorMessage: "Data is required.",
    },
    "data.username": {
      notEmpty: true,
      errorMessage: "Username is required.",
    },
  });
};

const validationForWithdrawOrDeposit = () => {
  return checkSchema({
    process: {
      notEmpty: true,
      errorMessage: "Transfer type if required.",
    },
    data: {
      notEmpty: true,
      errorMessage: "Data is required.",
    },
    "data.username": {
      notEmpty: true,
      errorMessage: "Username is required.",
    },
    "data.amount": {
      notEmpty: true,
      isDecimal: true,
      custom: {
        options: (value) => {
          return value > 0;
        },
        errorMessage: "Amount must be greater than 0.",
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
    case "deposit":
      await validationForWithdrawOrDeposit().run(req);
      break;
    case "list":
      await validationForListOfTransaction().run(req);
      break;
  }
  next();
};

const validationForUserRegistration = () => {
  return checkSchema({
    name: {
      notEmpty: true,
      errorMessage: "User name is required.",
    },
    email: {
      notEmpty: {
        errorMessage: "User email is required.",
      },
      isEmail: {
        errorMessage: "Invalid email",
      },
    },
    stateCode: {
      notEmpty: true,
      errorMessage: "StateCode must not empty.",
    },
    townshipCode: {
      notEmpty: true,
      errorMessage: "TownshipCode must not empty.",
    },
    balance: {
      optional: true,
    },
  });
};

const validationForLogin = () => {
  return checkSchema({
    adminCode: {
      notEmpty: true,
      errorMessage: "Admin code is required.",
    },
    password: {
      notEmpty: true,
      errorMessage: "Password is required.",
    },
  });
};

export {
  createAdminValidation,
  adminActionsValidation,
  transactionValidation,
  validationForUserRegistration,
  validationForLogin,
};
