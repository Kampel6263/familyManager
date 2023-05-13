import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export type ToastsHandlerType = {
  text: string;
  type: "error" | "success" | "info" | "warning";
};
const useNotify = () => {
  const notify = (data: ToastsHandlerType) => {
    const { text, type } = data;
    toast[type](text, { position: toast.POSITION.BOTTOM_RIGHT });
  };
  return { notify };
};

export default useNotify;
