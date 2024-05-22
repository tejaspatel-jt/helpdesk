import { toast } from "react-toastify";

export const SuccessToastMessage = (message) => {
  toast.success(message, { autoClose: 2000, position: "top-right" });
};

export const ErrorToastMessage = (message) => {
  toast.error(message, {
    position: "top-right",
  });
};
