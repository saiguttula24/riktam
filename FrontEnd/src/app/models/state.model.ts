import { User } from "./user.model";

export interface State {
    username: string;
    email: string;
    id: string;
    isAdmin: boolean;
    isVerified: boolean;
    users: User[] | [];
}