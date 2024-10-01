import { Any, Between, FindManyOptions, FindOneOptions, ILike, Raw, Repository } from "typeorm";
import { DatabaseModule } from "../index";
import { IUserService } from "../interfaces/IUserService.interface";
import { User } from "../entities/user.entity";
import { PaginationDto } from "../dto/pagination.dto";
import { SortingDto } from "../dto/sorting.dto";
import { GenericFilterDto } from "../dto/filter.dto";
import { permissionService } from "./permission.service";

class UserService implements IUserService {
  static get userRepository(): Repository<User> {
    return DatabaseModule.getRepository(User);
  }

  static get relations() {
    return ['role', 'permissions', 'createdBy', 'updatedBy']
  }

  async createUser(data: Partial<User>): Promise<User> {
    const user = new User();

    Object.assign(user, data);
    await UserService.userRepository.save(user);
    return this.findUserById(user.id);
  }

  async findUserById(id: string): Promise<User> {
    return UserService.userRepository.findOne({
      relations: UserService.relations,
      where: { id }
    });
  }

  async findUsersByIds(ids: string[]): Promise<User[]> {
    return UserService.userRepository.find({
      relations: UserService.relations,
      where: {
        id: Any(ids)
      }
    });
  }

  async findUserBy(key: string, value: any): Promise<User> {
    return UserService.userRepository.findOne({
      relations: UserService.relations,
      where: { [key]: value }
    });
  }

  async findOne(options: FindOneOptions): Promise<User> {
    return UserService.userRepository.findOne(options);
  }

  async find(options: FindManyOptions): Promise<User[]> {
    return UserService.userRepository.find(options);
  }

  async findAllUsers(
    pagination: PaginationDto = { page: 1, limit: 10 },
    sortOptions: SortingDto = { sortField: 'updatedAt', sortOrder: 'DESC' },
    filters: GenericFilterDto = {},
  ): Promise<{
    data: User[],
    totalRecords: number,
    limit?: number,
    page?: number
  }> {
    const { searchText, searchKey, searchValue, fromAgeDate, toAgeDate, ...restFilters } = filters;

    const userEntityMetadata = UserService.userRepository.metadata;
    const searchColumn = searchKey ? userEntityMetadata.findColumnWithPropertyPath(searchKey) : null;

    if (searchKey && !searchColumn) {
      throw new Error(`Invalid search key: ${searchKey}`);
    }

    // Build the query options dynamically
    const queryOptions: any = {
      where: {
        ...(searchKey && searchValue
          ? searchColumn.type === 'date'
            ? {
              [searchKey]: Raw(
                () => `"${searchKey}"::DATE = :searchValue::DATE`,
                { searchValue }
              ),
            }
            : searchColumn.type === 'varchar'
              ? { [searchKey]: ILike(`%${searchValue}%`) }
              : { [searchKey]: searchValue } // Direct comparison for numbers and other types
          : {}
        ),
        ...(fromAgeDate ? { dob: Raw(alias => `${alias} <= :fromAgeDate`, { fromAgeDate }) } : {}),
        ...(toAgeDate ? { dob: Raw(alias => `${alias} >= :toAgeDate`, { toAgeDate }) } : {}),
        ...restFilters,
        ...(searchText ? { firstName: ILike(`%${searchText}%`) } : {}),
      },
      relations: UserService.relations,
      order: {
        [sortOptions.sortField]: sortOptions.sortOrder,
      },
    };

    // Apply pagination if it's provided, otherwise return all records
    if (pagination?.page && pagination?.limit) {
      queryOptions.skip = (pagination.page - 1) * pagination.limit;
      queryOptions.take = pagination.limit;
    }

    // Fetch data and total count
    const [data, totalRecords] = await UserService.userRepository.findAndCount(queryOptions);

    return {
      data,
      totalRecords,
      limit: pagination?.limit, // Pass limit only if pagination is provided
      page: pagination?.page,   // Pass page only if pagination is provided
    };
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const user = await this.findUserById(id);
    Object.assign(user, data);
    await UserService.userRepository.save(user);
    return this.findUserById(id);
  }

  async isPasswordMatched(email: string, password: string): Promise<boolean> {
    const user = await UserService.userRepository.findOne({ where: { email } });
    if (!user) return false;

    return await user.validatePassword(password);
  }

  async findUserByEmailOrFail(email: string): Promise<User> {
    return UserService.userRepository.findOneByOrFail({ email });
  }

  async updatePassword(userId: string, password: string) {
    // Note that we do not use the updateUser method for this functionality because to trigger the
    // hashPassword hook in the user entity, we must call the .save method!!
    const user = await this.findUserById(userId);
    user.password = password;
    user.isPasswordSet = true;
    await UserService.userRepository.save(user);
    return this.findUserById(userId);
  }

  async addPermissionsToUser(userId: string, permissionIds: number[]): Promise<User> {
    const user = await this.findUserById(userId);

    const permissions = await permissionService.findPermissionByIds(permissionIds);

    user.permissions = [...user.permissions, ...permissions];

    return UserService.userRepository.save(user);
  }

  async removePermissionsFromUser(userId: string, permissionIds: number[]): Promise<User> {
    const user = await UserService.userRepository.findOne({
      where: { id: userId },
      relations: ['permissions'],
    });

    user.permissions = user.permissions.filter(
      (permission) => !permissionIds.includes(permission.id),
    );

    return UserService.userRepository.save(user);
  }

  async getRecentEnrollements(
    fromDate: Date = new Date(new Date().setDate(new Date().getDate() - 5)),
    toDate: Date = new Date(),
    filters: GenericFilterDto = {},
  ): Promise<{
    users: Partial<User>[],
    count: number
  }> {
    const [users, count] = await UserService.userRepository.findAndCount({
      where: {
        userType: 'patient',
        onboardingCompletedAt: Between(fromDate, toDate),
        ...filters,
      },
    });

    return { users, count };
  }

  async findUserBetweenDates(
    fromDateKey: string,
    fromDate: Date,
    toDateKey: string,
    toDate: Date,
  ): Promise<User[]> {
    return UserService.userRepository.find({
      where: {
        ...(fromDateKey && fromDate ? { [fromDateKey]: Raw(alias => `${alias} >= :fromDate`, { fromDate }) } : {}),
        ...(toDateKey && toDate ? { [toDateKey]: Raw(alias => `${alias} <= :toDate`, { toDate }) } : {}),
      }
    });
  }
}

export const userService = new UserService();