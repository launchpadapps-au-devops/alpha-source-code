import { BadRequestException, Injectable } from '@nestjs/common';
import { MessagingService } from '../common/messaging.service';
import {
    UserPlan,
    UserTheme,
    GenericFilterDto,
    PaginationDto,
    planService,
    habitService,
    SortingDto,
    userPlanService,
    userThemeService,
    healthProfileQuestionariesService,
    lessonService,
    userLessonService,
    UserLesson,
    userHabitService,
    Category,
    UserCategory,
    userCategoryService,
    NotificationType,
    userService
} from '@launchpadapps-au/alpha-shared';

@Injectable()
export class UserLifeStylePlanService {
    constructor(
        private readonly messagingService: MessagingService
    ) { }

    async assignUserLifestylePlan(data: Partial<UserPlan>, reqUser = { userId: null }) {
        const userPlan = await userPlanService.createUserPlan({
            ...data,
            createdBy: reqUser.userId,
            updatedBy: reqUser.userId
        });

        const { themes } = await planService.findPlanById(userPlan.planId);
        const categories = themes.map(theme => theme.categoryId).filter((value, index, self) => self.indexOf(value) === index);

        const userCategories: Partial<UserCategory>[] = [];
        for (const category of categories) {
            userCategories.push({
                userId: userPlan.userId,
                categoryId: category,
                userLifestylePlanId: userPlan.id,
                createdBy: reqUser.userId,
                updatedBy: reqUser.userId
            });
        }

        const createdUserCategories = await userCategoryService.createUserCategories(userCategories);

        if (!themes?.length) {
            throw new BadRequestException('Themes not found');
        }

        const themeIds = themes.map(theme => theme.id);
        const userThemes: Partial<UserTheme>[] = [];

        for (const themeId of themeIds) {
            userThemes.push({
                themeId,
                userId: userPlan.userId,
                userLifestylePlanId: userPlan.id,
                userCategoryId: createdUserCategories.find(category => category.categoryId === themes.find(theme => theme.id === themeId).categoryId).id,
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
                userLifeStylePlanId: data.find(d => d.themeId === lesson.themeId).userLifestylePlanId,
                userCategoryId: data.find(d => d.themeId === lesson.themeId).userCategoryId,
                userThemeId: data.find(d => d.themeId === lesson.themeId).id,
                createdBy: reqUser.userId,
                updatedBy: reqUser.userId
            }));

        await userLessonService.createUserLessons(filteredLessons);
    }

    async getUserDailyLesson(userId: string): Promise<UserLesson[]> {
        try {
            const userCategories = await userCategoryService.findUserCategoriesByUserId(userId);
            const userThemes = await userThemeService.findUserThemesByUserCategoryIds(userCategories.map(category => category.id));
            const userLessons = await userLessonService.findUserLessonsByUserThemeIds(userThemes.map(theme => theme.id));

            const userDailyLessons = [];
            for (const userCategory of userCategories) {
                userDailyLessons.push({ userCategory });
                if (userCategory.isCompleted) continue;

                const lessonCompletedOnThatDay = userLessons.find((l) => {
                    const completedDate = new Date(l.completedAt);
                    const today = new Date();

                    return completedDate.getFullYear() === today.getFullYear() &&
                        completedDate.getMonth() === today.getMonth() &&
                        completedDate.getDate() === today.getDate();
                });

                if (lessonCompletedOnThatDay) {
                    userDailyLessons[userDailyLessons.length - 1] = {
                        ...userDailyLessons[userDailyLessons.length - 1],
                        ...lessonCompletedOnThatDay
                    };

                    continue;
                }

                const firstUnCompletedUserTheme = userThemes.find(theme => theme.userCategoryId === userCategory.id && !theme.isCompleted);
                if (firstUnCompletedUserTheme) {
                    const firstUnCompletedUserLessson = userLessons.find(lesson => lesson.userThemeId === firstUnCompletedUserTheme.id && !lesson.isCompleted);
                    if (firstUnCompletedUserLessson) {
                        userDailyLessons[userDailyLessons.length - 1] = {
                            ...userDailyLessons[userDailyLessons.length - 1],
                            ...firstUnCompletedUserLessson
                        }
                    }
                }
            }

            return userDailyLessons;
        } catch (error) {
            throw new BadRequestException('User Daily Lesson not found');
        }
    }

    async completeUserDailyLesson(userLessonId: string, reqUser = { userId: null }) {
        const response = {
            userLesson: {
                id: null,
                isCompleted: false,
                completedAt: null,
                progress: 0,
                totalPoints: 0
            },
            userTheme: {
                id: null,
                isCompleted: false,
                completedAt: null,
                progress: 0,
                totalPoints: 0
            },
            userCategory: {
                id: null,
                isCompleted: false,
                completedAt: null,
                progress: 0,
                totalPoints: 0
            },
            userPlan: {
                id: null,
                isCompleted: false,
                completedAt: null,
                progress: 0,
                totalPoints: 0
            }
        };

        const userLesson = await userLessonService.findUserLessonById(userLessonId);
        const user = await userService.findUserById(userLesson.userId);

        if (!userLesson) {
            throw new BadRequestException('User Lesson not found');
        }

        if (userLesson.isCompleted) {
            throw new BadRequestException('Lesson already completed');
        }

        const userLessonsInTheme = await userLessonService.findUserLessonsByUserThemeIds([userLesson.userThemeId]);
        const totalUserLessonsInTheme = userLessonsInTheme.length;
        const completedUserLessonsInTheme = userLessonsInTheme.filter(lesson => lesson.isCompleted).length + 1; // +1 for the current lesson

        const userLessonInCategory = await userLessonService.findUserLessonsByUserCategoryIds([userLesson.userCategoryId]);
        const totalUserLessonsInCategory = userLessonInCategory.length;
        const completedUserLessonsInCategory = userLessonInCategory.filter(lesson => lesson.isCompleted).length + 1; // +1 for the current lesson

        const userLessonInPlan = await userLessonService.findUserLessonsByLifeStylePlanId(userLesson.userLifeStylePlanId);
        const totalUserLessonsInPlan = userLessonInPlan.length;
        const completedUserLessonsInPlan = userLessonInPlan.filter(lesson => lesson.isCompleted).length + 1; // +1 for the current lesson


        userLesson.isCompleted = true;
        userLesson.pointsEarned = userLesson.lesson.points;
        userLesson.completedAt = new Date();
        userLesson.updatedBy = userLesson.userId as any;

        await userLessonService.updateUserLesson(userLesson.id, userLesson);

        /** User Theme Update */
        const userTheme = await userThemeService.findUserThemeById(userLesson.userThemeId);
        userTheme.progress = Math.floor((completedUserLessonsInTheme / totalUserLessonsInTheme) * 100);
        userTheme.totalPoint = userLessonsInTheme.reduce((acc, curr) => acc + curr.pointsEarned, 0) + userLesson.pointsEarned;

        if (completedUserLessonsInTheme === totalUserLessonsInTheme) {
            userTheme.isCompleted = true;
            userTheme.completedAt = new Date();
            userTheme.updatedBy = reqUser.userId;

            this.messagingService.publishToNotification(
                'notification.register',
                {
                    userId: userTheme.userId,
                    recipients: [userTheme.userId],
                    type: NotificationType.PUSH,
                    categoryId: 5, // PROGRESS_MILESTONE
                    subcategoryId: 16, // THEME_COMPLETED
                    data: {
                        themeId: userTheme.themeId,
                        themeName: userTheme.theme.name,
                        themeCode: userTheme.theme.themeCode,
                        points: userTheme.totalPoint,
                        firstName: user.firstName || user.name,
                    }
                }
            )
        }

        await userThemeService.updateUserTheme(userTheme.id, userTheme);

        /** User Category Update */
        const userCategory = await userCategoryService.findUserCategoryById(userLesson.userCategoryId);
        userCategory.progress = Math.floor((completedUserLessonsInCategory / totalUserLessonsInCategory) * 100);
        userCategory.totalPoint = userLessonInCategory.reduce((acc, curr) => acc + curr.pointsEarned, 0) + userLesson.pointsEarned;

        if (completedUserLessonsInCategory === totalUserLessonsInCategory) {
            userCategory.isCompleted = true;
            userCategory.completedAt = new Date();
            userCategory.updatedBy = reqUser.userId;
        }

        const userPlan = await userPlanService.findUserPlanById(userTheme.userLifestylePlanId);
        userPlan.progress = Math.floor((completedUserLessonsInPlan / totalUserLessonsInPlan) * 100);
        userPlan.totalPoint = userLessonInPlan.reduce((acc, curr) => acc + curr.pointsEarned, 0) + userLesson.pointsEarned;

        if (completedUserLessonsInPlan === totalUserLessonsInPlan) {
            userPlan.isCompleted = true;
            userPlan.completedAt = new Date();
            userPlan.updatedBy = reqUser.userId;
        }

        await userPlanService.updateUserPlan(userPlan.id, userPlan);

        response.userLesson = {
            id: userLesson.id,
            isCompleted: userLesson.isCompleted,
            completedAt: userLesson.completedAt,
            progress: 100,
            totalPoints: userLesson.pointsEarned
        };

        response.userTheme = {
            id: userTheme.id,
            isCompleted: userTheme.isCompleted,
            completedAt: userTheme.completedAt,
            progress: userTheme.progress,
            totalPoints: userTheme.totalPoint
        };

        response.userCategory = {
            id: userCategory.id,
            isCompleted: userCategory.isCompleted,
            completedAt: userCategory.completedAt,
            progress: userCategory.progress,
            totalPoints: userCategory.totalPoint
        };

        response.userPlan = {
            id: userPlan.id,
            isCompleted: userPlan.isCompleted,
            completedAt: userPlan.completedAt,
            progress: userPlan.progress,
            totalPoints: userPlan.totalPoint
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

        const userCategoryIds = data.data.map((l) => l.userCategoryId);
        const userCategories = await userCategoryService.findUserCategoryByIds(userCategoryIds);
        
        data.data = data.data.map((l) => ({
            ...l,
            userCategory: userCategories.find((c) => c.id === l.userCategoryId)
        }));

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
        if(!userPlans) {
            throw new BadRequestException('User Plan not found');
        }
        
        const userThemes = await userThemeService.findUserThemesByUserLifestylePlanId(userPlans.id);

        response.totalThemes = userThemes.length;
        response.themesCompleted = userThemes.filter(theme => theme.isCompleted).length;
        response.themeProgress = Math.floor((response.themesCompleted / response.totalThemes) * 100);

        const userLessons = await userLessonService.findUserLessonsByUserId(userId);
        response.totalLessons = userLessons.length;
        response.lessonsCompleted = userLessons.filter(lesson => lesson.isCompleted).length;
        response.totalPoints = userLessons.reduce((acc, curr) => acc + curr.pointsEarned, 0);

        response.planProgress = !isNaN(response.totalLessons) && response.totalLessons > 0 
            ? Math.floor((response.lessonsCompleted / response.totalLessons) * 100)
            : 0;

        return response;
    }
}