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

export { adminActionValidation };
