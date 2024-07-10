import { In, Repository } from 'typeorm';
import { Permission } from '../entities/permission.entity';
import { DatabaseModule } from '..';

export class PermissionService {

  static get permissionRepository(): Repository<Permission> {
    return DatabaseModule.getRepository(Permission);
  }

  async findAllPermissions(): Promise<Permission[]> {
    return PermissionService.permissionRepository.find();
  }

  async findPermissionByIds(permissionIds: number[]): Promise<Permission[]> {
    return PermissionService.permissionRepository.find({
      where: { id: In(permissionIds) },
    });
  }
}

export const permissionService = new PermissionService();