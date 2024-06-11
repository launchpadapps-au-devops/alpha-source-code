import { Request } from "express";

export interface UserPayload {
    userId: string;
    email: string;
    tokenType: string;
    iat: number;
    exp: number;
}

export interface RequesterDetails {
    userId: string;
    email: string;
}

export interface AuthenticatedRequest extends Request {
    user: RequesterDetails;
}