import { FindManyOptions, FindOneOptions } from "typeorm";
import { UserDto } from "../dto/user.dto";
import { UserLesson } from "../entities";

export interface IUserLessonService {
  createUserLesson(data: Partial<UserLesson>): Promise<UserLesson>;
  updateUserLesson(id: string, data: Partial<UserLesson>): Promise<UserLesson>;
  findUserLessonById(id: string): Promise<UserLesson>;
  findUserLessonByIds(ids: string[]): Promise<UserLesson[]>;
  createUserLessons(data: Partial<UserLesson>[]): Promise<UserLesson[]>;
  findUserLessonsByUserThemeIds(userThemeIds: string[]): Promise<UserLesson[]>;
  findAllUserLessons(): Promise<{
    data: UserLesson[],
    totalRecords: number
  }>;
}