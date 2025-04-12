import { toast } from 'sonner';

type ToastOptions = {
  description?: string;
  duration?: number;
};

export const toastSuccess = (
  message: string,
  options?: ToastOptions
) => {
  toast.success(message, {
    style: {
      backgroundColor: "#4BB543",
      color: "white"
    },
    description: options?.description,
    duration: options?.duration ?? 3000,
    position: "top-right"
  });
};


export const toastError = (
  message: string,
  options?: ToastOptions
) => {
  toast.error(message, {
    style: {
      backgroundColor: "#FF2C2C",
      color: "white"
    },
    description: options?.description,
    duration: options?.duration ?? 5000,
    position: "top-right"
  });
};
