export interface Message {
    _id: string;
    groupId: string;
    sentBy: string;
    message: string;
    createdAt: Date;
    likes?: string[];
}