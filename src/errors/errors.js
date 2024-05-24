export function newError(name, message) {
  const error = new Error(message);
  error.name = name;
  error.isError = true;
  return error;
}
