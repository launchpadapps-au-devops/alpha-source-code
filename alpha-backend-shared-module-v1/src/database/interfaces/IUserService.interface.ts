import { UserDto } from "../dto/user.dto";
import { User } from "../entities";

export interface IUserService {
  createUser(data: UserDto): Promise<UserDto | null>;
  findUserById(id: string): Promise<UserDto | null>;
  findUsersByIds(ids: string[]): Promise<UserDto[]>;
  findUserBy(key: string, value: any): Promise<UserDto | null>;
  findAllUsers(): Promise<{
    data: User[],
    totalRecords: number
    limit?: number,
    page?: number
  }>;
  updateUser(id: string, data: UserDto): Promise<UserDto | null>;
  isPasswordMatched(email: string, password: string): Promise<boolean>;
  findUserByEmailOrFail(email: string): Promise<UserDto>;
}
