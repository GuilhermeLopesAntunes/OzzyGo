

export type UserRole = "student" | "professor"; 

export interface User {
    id: string;
    email: string;
    name: string;
    username: string;
    role: UserRole;
}

export interface LoginData {
    username: string;
    password: string;
}

export interface RegisterData  {
     email: string; 
     name: string; 
     username: string; 
     password: string
}

export interface LoginResponse {
    acessToken: string; 
    user: User;
}

export interface RegisterResponse {
    message: string;
}

export interface VerifyEmailResponse {
    message: string;
    acessToken: string;
    user: User;
}