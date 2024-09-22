import { User } from "./user.model";

export interface UsersResponse {
    success: boolean;
    users?: User[];
    message?: string;
}