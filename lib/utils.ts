export const validateString = (value: unknown, maxLength: number) => {
  if (typeof value !== "string") {
    return false;
  }
  if (value.length > maxLength) {
    return false;
  }
  return true;
};

export const getErrorMessage = (error: unknown): string => {
  let message: string;
  if (error instanceof Error) {
    message = error.message;
  } else if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    error
  ) {
    message = String(error.message);
  } else if (typeof error === "string") {
    message = error;
  } else {
    message = "something went wrong";
  }
  return message;
};
