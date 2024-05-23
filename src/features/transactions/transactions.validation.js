import { checkSchema } from "express-validator";

const createTransactionValidation = () => {
  return checkSchema({
    senderId: {
      notEmpty: true,
    },
    receiverId: {
      notEmpty: true,
    },
    adminId: {
      notEmpty: true,
    },
    transferAmount: {
      notEmpty: true,
      isDecimal: true,
    },
    note: {
      optional: true,
    },
  });
};

export { createTransactionValidation };
