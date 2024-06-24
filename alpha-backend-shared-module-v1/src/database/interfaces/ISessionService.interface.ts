import { CreateSessionDto } from "../dto";
import { Session } from "../entities";

export interface ISessionService {
    createSession(sessionData: CreateSessionDto): Promise<Session>;
    revokeAllSessionsForUser(userId: string): Promise<void>;
    validateSessionByToken(accessToken: string): Promise<boolean>;
}