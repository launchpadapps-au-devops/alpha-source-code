import { Between, In, LessThan, MoreThan, Repository } from "typeorm";
import { DatabaseModule, Session, User } from "../..";
import { CreateSessionDto } from "../dto";
import { ISessionService } from "../interfaces/ISessionService.interface";
import { create } from "domain";

class SessionService implements ISessionService {
    static get sessionRepository(): Repository<Session> {
        return DatabaseModule.getRepository(Session);
    }

    async createSession(sessionData: CreateSessionDto) {
        this.revokeAllSessionsForUser(sessionData.userId);
        
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

    async validateRefreshToken(refreshToken: string) {
        const sessionRepository = DatabaseModule.getRepository(Session);
        const session = await sessionRepository.findOneBy({
            refreshToken,
            isInvalidated: false
        });

        return session;
    }


    async findAllLoggedInSessionForUsers(
        fromDate: Date = new Date(new Date().setDate(new Date().getDate() - 5)),
        toDate: Date = new Date(),
        userTypes: string[] = ["patient"]
    ) {
        const sessions = await SessionService.sessionRepository.find({
            where: {
                createdAt: Between(fromDate, toDate),
                user: {
                    userType: In(userTypes),
                }
            },
            relations: ["user"],
        });
    
        const uniqueUsersMap = new Map<string, User>();
        sessions.forEach(session => {
            uniqueUsersMap.set(session.userId, session.user);
        });
    
        const uniqueUsers = Array.from(uniqueUsersMap.values());
    
        return uniqueUsers;
    }
}

export const sessionService = new SessionService();