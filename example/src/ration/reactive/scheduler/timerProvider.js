// setTimeout
export const timeoutProvider = {
  setTimeout(...args) {
    return setTimeout(...args);
  },
  clearTimeout(handle) {
    return clearTimeout(handle);
  },
};

// setInterval
export const intervalProvider = {
  setInterval(...args) {
    return setInterval(...args);
  },
  clearInterval(handle) {
    return clearInterval(handle);
  },
};
