import { User } from "./user.model";

export interface LoginResponse {
    success : boolean;
    message: string;
    token? : string;
    user : User
}