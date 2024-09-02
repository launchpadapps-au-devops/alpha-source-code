import { User } from "./user.entity";
import { Permission } from "./permission.entity";
import { Notification, NotificationType } from "./notification.entity";
import { NotificationPreference } from "./notificationPreference.entity";
import { Session } from "./session.entity";
import { Policy } from "./policy.entity";
import { HealthProfileQuestionaries } from "./HealthProfileQuestionaries.entity";

import { Category } from "./category.entity";
import { Theme } from "./theme.entity";
import { Habit } from "./habit.entity";
import { Lesson } from "./lesson.entity";
import { Plan } from "./plan.entity";
import { DailyTips } from "./dailyTips.entity";

import { UserPlan } from "./userPlan.entity";
import { UserCategory } from "./userCategories.entity";
import { UserTheme } from "./userTheme.entity";
import { UserLesson } from "./userLesson.entity";
import { UserHabit } from "./userHabit.entity";
import { UserHabitProgress } from "./userHabitProgress.entity";

import { UserMealLog } from "./userMeal.entity";
import { UserHealthData } from "./userHealthData.entity";
import { SurveyQuestions } from "./surveyQuestions.entity";

// Export all entities
export { 
  User,
  Permission,

  Notification,
  NotificationPreference,
  NotificationType,

  Session,
  Policy,

  HealthProfileQuestionaries,

  Category,
  Theme,
  Plan,
  Lesson,
  DailyTips,

  UserPlan,
  UserCategory,
  UserTheme,
  Habit,
  UserLesson,
  UserHabit,
  UserHabitProgress,

  UserMealLog,
  UserHealthData,
  SurveyQuestions
};