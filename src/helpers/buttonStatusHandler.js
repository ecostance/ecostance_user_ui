const buttonStatusHandler = async (setState, func) => {
  setState(true);
  return new Promise(async (resolve, reject) => {
    try {
      await func();
      setState(false);
      resolve();
      return;
    } catch (err) {
      reject(err.message);
    }
  });
};

export default buttonStatusHandler;
