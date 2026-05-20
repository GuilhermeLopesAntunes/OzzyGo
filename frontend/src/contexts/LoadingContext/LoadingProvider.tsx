import { useLottie } from "lottie-react";
import { useState, type ReactNode } from "react";
import animationDataJson from "./lotties/loadingLottie.json";
import { LoadingContext } from "./LoadingContext";


function LottiePlayer() {
    const options = {
        animationData: animationDataJson,
        loop: true,
    };

    const { View } = useLottie(options);

    return <div className="w-64 h-64">{View}</div>;
}

export function LoadingProvider({ children }: { children: ReactNode }) {
    const [isLoading, setIsLoading] = useState(false);

    const showLoading = () => setIsLoading(true);
    const hideLoading = () => setIsLoading(false);

    return (
        <LoadingContext.Provider value={{ showLoading, hideLoading }}>
            {children}
            
            {isLoading && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/30 backdrop-blur-sm">

                        <LottiePlayer />
                  
                </div>
            )}
        </LoadingContext.Provider>
    );
}