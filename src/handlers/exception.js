export function exceptionHandler(handlerFn) {
  return async (...params) => {
    try {
      const data = await handlerFn(...params);
      return data;
    } catch (error) {
      return new Error(error.message);
    }
  };
}
