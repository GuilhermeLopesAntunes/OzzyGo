// LoadingContext.ts
import { createContext } from "react";

export interface LoadingContextData {
    showLoading: () => void;
    hideLoading: () => void;
}


export const LoadingContext = createContext<LoadingContextData>({} as LoadingContextData);