const USER_NOT_FOUND_ERR = 0;
const USER_DEACTIVATION_ERR = 1;
const USER_ACTIVATION_ERR = 3;

const ADMIN_NOT_FOUND_ERR = 5;

const INTERNAL_ERR = 10;

const INSUFFICIENT_AMOUNT_ERR = 11;

export default function newError(name, message) {
  const error = new Error(message);
  error.name = name;
  error.isError = () => true;
  return error;
}

export {
  USER_NOT_FOUND_ERR,
  USER_DEACTIVATION_ERR,
  USER_ACTIVATION_ERR,
  ADMIN_NOT_FOUND_ERR,
  INTERNAL_ERR,
  INSUFFICIENT_AMOUNT_ERR,
};
