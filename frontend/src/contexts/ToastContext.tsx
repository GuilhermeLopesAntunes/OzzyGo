import React, { createContext, useContext, useState, useCallback } from 'react';
import { Toast } from "../components/Toast"
import type { ToastType } from '../components/Toast';


export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

export interface ToastContextData {
  addToast(message: Omit<ToastMessage, 'id'>): void;
  removeToast(id: string): void;
}

export const ToastContext = createContext<ToastContextData>({} as ToastContextData);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const addToast = useCallback(({ type, title, description }: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const toast = { id, type, title, description };

    setMessages((state) => [...state, toast]);

  }, []);

  const removeToast = useCallback((id: string) => {
    setMessages((state) => state.filter((message) => message.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      

      <div className="fixed top-5 right-5 flex flex-col gap-4 z-50">
        {messages.map((message) => (
          <Toast 
            key={message.id}
            type={message.type}
            title={message.title}
            description={message.description}
            onClose={() => removeToast(message.id)} 
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};