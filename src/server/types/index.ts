export interface User {
    id: number;
    email: string;
    password: string;
    role: string;
    created_at: Date;
}

export interface Category {
    id: number;
    name: string;
}

export interface Book {
    id: number;
    categoryid: Category["id"];
    title: string;
    author: string;
    price: number;
    created_at: Date;
}

export interface Payload {
    id: User["id"];
    email: User["email"];
    role: User["role"];
}

declare global {
    namespace Express {
        export interface Request {
            user: Payload;
        }
    }
}

export interface UserPayload {
    id: number;
    username: string;
    email: string;
}