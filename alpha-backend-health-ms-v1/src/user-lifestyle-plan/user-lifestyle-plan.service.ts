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
                themeId
            });
        }

        await userThemeService.createUserThemes(userThemes);
    }

    async personalizeUserLifeStylePlan(userId: string) {
        const userHealthData = await healthProfileQuestionariesService.findAllHealthQuestionAnswer(userId);
        if (!userHealthData.length) {
            throw new BadRequestException('Health Data not found');
        }

        const { data } = await userThemeService.findAllUserThemes({
            limit: null,
            page: 0
        }, {
            sortField: 'createdAt',
            sortOrder: 'DESC'
        }, {
            userId
        });

        const tags = userHealthData
            .map(data => data.answerTags)
            .reduce((acc, curr) => acc.concat(curr.split(',')), []);

        const lessons = await lessonService.findLessonsByThemeIds(data.map(d => d.themeId));
        const filteredLessons = lessons
            .filter(lesson => {
                const lessonTags: string[] = lesson.lessonTags.reduce((acc: any, curr) => {
                    return acc.concat(Object.values(curr));
                }, []);

                return lessonTags.some(tag => tags.includes(tag));
            })
            .map(lesson => ({
                userId,
                lessonId: lesson.id,
                userPlanId: data.find(d => d.themeId === lesson.themeId).userLifestylePlanId,
                userThemeId: data.find(d => d.themeId === lesson.themeId).id
            }));

        await userLessonService.createUserLessons(filteredLessons);
    }

    async getUserDailyLesson(userId: string) : Promise<UserLesson[]>
    {
        const userThemes = await userThemeService.findUserThemesByUserId(userId);
        const categories = userThemes.map(theme => theme.theme.category);
        const uniqueCategories = [...new Set(categories)];

        const dailyLessons: UserLesson [] = [];
        for (const category of uniqueCategories) {
            const userTheme = userThemes.find(theme => theme.theme.category === category && !theme.isCompleted);
        
            const userLessons = await userLessonService.findUserLessonsByUserThemeId(userTheme.id);
            const userLesson = userLessons.find(lesson => !lesson.isCompleted);

            dailyLessons.push(userLesson);
        }

        return dailyLessons;
    }
}
