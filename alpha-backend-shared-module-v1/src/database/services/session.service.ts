import { Repository } from "typeorm";
import { DatabaseModule, Session } from "../..";
import { CreateSessionDto } from "../dto";
import { ISessionService } from "../interfaces/ISessionService.interface";

class SessionService implements ISessionService {
    static get sessionRepository(): Repository<Session> {
        return DatabaseModule.getRepository(Session);
    }

    async createSession(sessionData: CreateSessionDto) {
        const sessionRepository = DatabaseModule.getRepository(Session)
        return sessionRepository.save(sessionData);
    }

    async revokeAllSessionsForUser(userId: string): Promise<void> {
        const sessionRepository = DatabaseModule.getRepository(Session)
        await sessionRepository.update(
            {
                userId,
                isInvalidated: false,
            },
            {
                isInvalidated: true,
            }
        );
    }

    async validateSessionByToken(accessToken: string) {
        const sessionRepository = DatabaseModule.getRepository(Session);
        const session = await sessionRepository.findOneBy({
            accessToken,
            isInvalidated: false
        });

        return !!session;
    }
}

export const sessionService = new SessionService();