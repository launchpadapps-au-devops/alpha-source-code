import { Any, Repository } from "typeorm";
import { DatabaseModule } from "../index";
import { IUserService } from "../interfaces/IUserService.interface";
import { User } from "../entities/user.entity";
import { UserDto } from "../dto/user.dto";
import { TimeStamp } from "../interface/base.interface";
import { PaginationUtil } from "../utils/pagination.util";
import { PaginationDto } from "../dto/pagination.dto";
import { SortingDto } from "../dto/sorting.dto";
import { GenericFilterDto } from "../dto/filter.dto";

class UserService implements IUserService {
  static get userRepository(): Repository<User> {
    return DatabaseModule.getRepository(User);
  }

  static get relations() {
    return ['role', 'permission']
  }

  async createUser(data: UserDto): Promise<UserDto & TimeStamp> {
    const user = new User();

    Object.assign(user, data);
    await UserService.userRepository.save(user);
    return this.findUserById(user.id);
  }
  
  async findUserById(id: string): Promise<UserDto & TimeStamp | null> {
    return UserService.userRepository.findOne({
      relations: UserService.relations,
      where: { id }
    });
  }

  async findUsersByIds(ids: string[]): Promise<(UserDto & TimeStamp)[]> {
    return UserService.userRepository.find({
      relations: UserService.relations,
      where: {
        id: Any(ids)
      }
    });
  }

  async findUserBy(key: string, value: any): Promise<UserDto & TimeStamp | null> {
    return UserService.userRepository.findOne({ 
      relations: UserService.relations, 
      where: { [key]: value } 
    });
  }

  async findAllUsers(
    pagination: PaginationDto = { page: 1, limit: 10 },
    sortOptions: SortingDto = { sortField: 'updatedAt', sortOrder: 'DESC' },
    filters: GenericFilterDto = {},
  ): Promise<(UserDto & TimeStamp)[]> {
    
    const queryBuilder = UserService.userRepository.createQueryBuilder('users');
    PaginationUtil.applyFilters(queryBuilder, filters);
    PaginationUtil.sort(queryBuilder, sortOptions);
    PaginationUtil.paginate(queryBuilder, pagination);

    return queryBuilder.getMany();
  }

  async updateUser(id: string, data: UserDto): Promise<UserDto & TimeStamp | null> {
    await UserService.userRepository.update(id, data);
    return this.findUserById(id);
  }

  async isPasswordMatched(email: string, password: string): Promise<boolean> {
    const user = await UserService.userRepository.findOne({ where: { email } });
    if (!user) return false;

    return user.validatePassword(password);
  }

  async findUserByEmailOrFail(email: string): Promise<UserDto> {
    return UserService.userRepository.findOneByOrFail({ email });
  }

  async updatePassword(userId: string, password: string) {
    // Note that we do not use the updateUser method for this functionality because to trigger the
    // hashPassword hook in the user entity, we must call the .save method!!
    const user = await this.findUserById(userId);
    user.password = password;
    await UserService.userRepository.save(user);
    return this.findUserById(userId);
  }
}

export const userService = new UserService();