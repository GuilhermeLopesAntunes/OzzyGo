import { useContext } from "react";
import { ToastContext, type ToastContextData } from "../contexts/ToastContext";


export function useToast(): ToastContextData {
  const context = useContext(ToastContext);


  if (!context.addToast) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
}