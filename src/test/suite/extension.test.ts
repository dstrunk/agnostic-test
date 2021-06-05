export const waitToAssertInSeconds: number = 5;

// This is a little helper function to promisify setTimeout, so we can "await" setTimeout.
export const timeout = (seconds: number, callback: CallableFunction) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      callback();
      resolve();
    }, seconds * waitToAssertInSeconds);
  });
};
