import { BadRequestException, Injectable } from '@nestjs/common';
import {
    UserPlan,
    UserTheme,
    GenericFilterDto,
    PaginationDto,
    planService,
    SortingDto,
    userPlanService,
    userThemeService,
    healthProfileQuestionariesService,
    lessonService,
    userLessonService,
    UserLesson
} from '@launchpadapps-au/alpha-shared';

@Injectable()
export class UserLifeStylePlanService {
    constructor() { }

    async assignUserLifestylePlan(data: Partial<UserPlan>, reqUser = { userId: null }) {
        const userPlan = await userPlanService.createUserPlan({
            ...data,
            createdBy: reqUser.userId,
            updatedBy: reqUser.userId
        });

        const { themes } = await planService.findPlanById(userPlan.planId);
        if (!themes?.length) {
            throw new BadRequestException('Themes not found');
        }

        const themeIds = themes.map(theme => theme.id);
        const userThemes: Partial<UserTheme>[] = [];

        for (const themeId of themeIds) {
            userThemes.push({
                userId: userPlan.userId,
                userLifestylePlanId: userPlan.id,
                themeId,
                createdBy: reqUser.userId,
                updatedBy: reqUser.userId
            });
        }

        await userThemeService.createUserThemes(userThemes);
    }

    async personalizeUserLifeStylePlan(userId: string, reqUser = { userId: null }) {
        const userHealthData = await healthProfileQuestionariesService.findAllHealthQuestionAnswer(userId);
        if (!userHealthData.length) {
            throw new BadRequestException('Health Data not found');
        }

        let data = [];
        try {
            data = await userThemeService.findUserThemesByUserId(userId);
        } catch (error) {
            throw new BadRequestException('User Themes not found');
        }

        const tags = userHealthData
            .map(data => data.answerTags || [])
            .reduce((acc, curr) => [...acc, ...curr], []);

        const lessons = await lessonService.findLessonsByThemeIds(data.map(d => d.themeId));
        const filteredLessons = lessons
            .filter(lesson => {
                const lessonTags: string[] = lesson.lessonTags.reduce((acc: any, curr) => {
                    return acc.concat(Object.values(curr));
                }, []);

                // TODO: remove true || when tags are available
                return true || lessonTags.some(tag => tags.includes(tag));
            })
            .map(lesson => ({
                userId,
                lessonId: lesson.id,
                userPlanId: data.find(d => d.themeId === lesson.themeId).userLifestylePlanId,
                userThemeId: data.find(d => d.themeId === lesson.themeId).id,
                createdBy: reqUser.userId,
                updatedBy: reqUser.userId
            }));

        await userLessonService.createUserLessons(filteredLessons);
    }

    async getUserDailyLesson(userId: string): Promise<UserLesson[]> {
        try {
            const userThemes = await userThemeService.findUserThemesByUserId(userId);
        const categories = userThemes.map(theme => theme.theme.categoryId);
        const uniqueCategories = [...new Set(categories)];

        const dailyLessons: UserLesson[] = [];
        for (const category of uniqueCategories) {
            const userTheme = userThemes.find(theme => theme.theme.categoryId === category && !theme.isCompleted);

            if (!userTheme) {
                continue;
            }

            const userLessons = await userLessonService.findUserLessonsByUserThemeId(userTheme.id);

            if(!userLessons.length) {
                continue;
            }

            const userLesson = userLessons.find(lesson => !lesson.isCompleted);

            if (!userLesson) {
                continue;
            }
            
            dailyLessons.push(userLesson);
        }

        return dailyLessons;
        } catch (error) {
            console.log(error);
        }
    }

    async completeUserDailyLesson(userLessonId: string, reqUser = { userId: null }) {
        const response = {
            userLesson: {
                id: null,
                isCompleted: false,
                completedAt: null,
                progress: 0
            },
            userTheme: {
                id: null,
                isCompleted: false,
                completedAt: null,
                progress: 0
            },
            userPlan: {
                id: null,
                isCompleted: false,
                completedAt: null,
                progress: 0
            }
        };

        const userLesson = await userLessonService.findUserLessonById(userLessonId);

        if (userLesson.isCompleted) {
            //throw new BadRequestException('Lesson already completed');
        }

        const userLessonsInTheme = await userLessonService.findUserLessonsByUserThemeId(userLesson.userThemeId);

        const totalUserLessonsInTheme = userLessonsInTheme.length;
        const completedUserLessonsInTheme = userLessonsInTheme.filter(lesson => lesson.isCompleted).length + 1; // +1 for the current lesson

        userLesson.isCompleted = true;
        userLesson.pointsEarned = userLesson.lesson.points;
        userLesson.completedAt = new Date();
        userLesson.updatedBy = userLesson.userId as any;

        await userLessonService.updateUserLesson(userLesson.id, userLesson);

        const userTheme = await userThemeService.findUserThemeById(userLesson.userThemeId);
        userTheme.progress = Math.floor((completedUserLessonsInTheme / totalUserLessonsInTheme) * 100);

        if (completedUserLessonsInTheme === totalUserLessonsInTheme) {
            userTheme.isCompleted = true;
            userTheme.completedAt = new Date();
            userTheme.updatedBy = reqUser.userId;
        }
        await userThemeService.updateUserTheme(userTheme.id, userTheme);

        const userPlan = await userPlanService.findUserPlanById(userTheme.userLifestylePlanId);
        const userThemes = await userThemeService.findUserThemeByIds(userPlan.userThemes.map(theme => theme.id));

        const totalThemes = userThemes.length;
        const completedThemes = userThemes.filter(theme => theme.isCompleted).length;

        userPlan.progress = Math.floor((completedThemes / totalThemes) * 100);

        if (completedThemes === totalThemes) {
            userPlan.isCompleted = true;
            userPlan.completedAt = new Date();
            userPlan.updatedBy = reqUser.userId;
        }

        await userPlanService.updateUserPlan(userPlan.id, userPlan);

        response.userLesson = {
            id: userLesson.id,
            isCompleted: userLesson.isCompleted,
            completedAt: userLesson.completedAt,
            progress: 100
        };

        response.userTheme = {
            id: userTheme.id,
            isCompleted: userTheme.isCompleted,
            completedAt: userTheme.completedAt,
            progress: userTheme.progress
        };

        response.userPlan = {
            id: userPlan.id,
            isCompleted: userPlan.isCompleted,
            completedAt: userPlan.completedAt,
            progress: userPlan.progress
        };

        return response;
    }

    async addUserLessonFeedback(userLessonId: string, feedback: string, isPositiveFeedback: boolean, reqUser = { userId: null }) {
        const userLesson = await userLessonService.findUserLessonById(userLessonId);

        if (userLesson.isFeedbackGiven) {
            throw new BadRequestException('Feedback already given');
        }

        userLesson.feedback = feedback;
        userLesson.isFeedbackGiven = true;
        userLesson.isPositiveFeedback = isPositiveFeedback;
        userLesson.feedbackDate = new Date();
        userLesson.updatedBy = reqUser.userId;

        await userLessonService.updateUserLesson(userLessonId, userLesson);
    }

    async getUserLessonFeedback(userLessonId: string) {
        const userLesson = await userLessonService.findUserLessonById(userLessonId);

        if (!userLesson.isFeedbackGiven) {
            throw new BadRequestException('Feedback not given');
        }

        return {
            feedback: userLesson.feedback,
            isPositiveFeedback: userLesson.isPositiveFeedback,
            feedbackDate: userLesson.feedbackDate
        };
    }

    async toggleBookmarkUserLesson(userLessonId: string, reqUser = { userId: null }) {
        const userLesson = await userLessonService.findUserLessonById(userLessonId);

        userLesson.isBookmarked = !userLesson.isBookmarked;
        userLesson.bookmarkUpdatedAt = new Date();
        userLesson.updatedBy = reqUser.userId;

        await userLessonService.updateUserLesson(userLessonId, userLesson);
    }

    async getUserBookmarkedLessons(userId: string, pagination: PaginationDto, filter: GenericFilterDto = {}, sorting: SortingDto = {}) {
        const data = await userLessonService.findAllUserLessons(
            pagination,
            sorting,
            {
                ...filter,
                userId,
                isBookmarked: true
            },
        );

        return data;
    }

    async getUserPlanProgress(userId: string) {
        const response = {
            //totalRewards: 0,
            //totalBadges: 0,
            totalThemes: 0,
            themesCompleted: 0,
            themeProgress: 0,
            lessonsCompleted: 0,
            totalLessons: 0,
            totalPoints: 0,
            planProgress: 0
        }

        const userPlans = await userPlanService.findUserPlansByUserId(userId);
        const userThemes = await userThemeService.findUserThemesByUserLifestylePlanId(userPlans.id);

        response.totalThemes = userThemes.length;
        response.themesCompleted = userThemes.filter(theme => theme.isCompleted).length;
        response.themeProgress = Math.floor((response.themesCompleted / response.totalThemes) * 100);

        const userLessons = await userLessonService.findUserLessonsByUserId(userId);
        response.totalLessons = userLessons.length;
        response.lessonsCompleted = userLessons.filter(lesson => lesson.isCompleted).length;
        response.totalPoints = userLessons.reduce((acc, curr) => acc + curr.pointsEarned, 0);

        response.planProgress = Math.floor((response.lessonsCompleted / response.totalLessons) * 100);

        return response;
    }
}
