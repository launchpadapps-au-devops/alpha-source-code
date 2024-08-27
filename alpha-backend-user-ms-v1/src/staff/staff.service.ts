import { Injectable } from '@nestjs/common';
import { GenericFilterDto, PaginationDto, SortingDto, User, userService } from '@launchpadapps-au/alpha-shared';
import { CreateStaffDto } from './staff.dto';
import { platform } from 'os';

@Injectable()
export class StaffService {
    constructor() { }

    #formatStaffProfile(staff: Partial<User>) {
        return ({
            id: staff.id,
            email: staff.email,
            firstName: staff.firstName,
            lastName: staff.lastName,
            phone: staff.phone,
            role: staff.role
                ? { id: staff.role.id, name: staff.role.name }
                : null,
            permissions: staff.permissions?.length
                ? staff.permissions.map(permission => ({
                    id: permission.id,
                    name: permission.name,
                })) : [],
            userType: staff.userType
        });
    }

    async createStaffUserProfile(payload: CreateStaffDto, reqUser = { userId: null }) {
        const staff = await userService.createUser({
            ...payload,
            userType: payload.userType || 'staff',
            platform: 'alpha-admin-web',
            createdBy: reqUser.userId
        });

        return this.getStaffProfile(staff.id);
    }

    async updateStaffUserProfile(staffId: string, payload: Partial<CreateStaffDto>, reqUser = { userId: null }) {
        const staff = await userService.updateUser(staffId, {
            ...payload,
            updatedBy: reqUser.userId
        });

        return this.getStaffProfile(staff.id);
    }

    async getStaffProfile(staffId: string) {
        const staff = await userService.findUserById(staffId);
        return this.#formatStaffProfile(staff);
    }

    async getStaffProfiles(
        page: PaginationDto = { page: 1, limit: 10 },
        sorting: SortingDto = { sortField: 'updatedAt', sortOrder: 'DESC' },
        filters: GenericFilterDto
    ) {
        const response = await userService.findAllUsers(
            page,
            sorting,
            {
                ...filters,
                userType: 'staff'
            }
        );
        const staffProfiles = response.data.map(staff => this.#formatStaffProfile(staff));

        return {
            data: staffProfiles,
            totalRecords: response.totalRecords,
            page: response.page,
            limit: response.limit,
        };
    }

    async updateStaffPermission(staffId: string, permissionIds: number[], reqUser = { userId: null }) {
        const staff = await userService.findUserById(staffId);

        const removePermissionIds = staff.permissions.map(permission => permission.id).filter(id => !permissionIds.includes(id));
        await userService.removePermissionsFromUser(staffId, removePermissionIds);

        const addPermissionIds = permissionIds.filter(id => !staff.permissions.map(permission => permission.id).includes(id));
        await userService.addPermissionsToUser(staffId, addPermissionIds);

        return this.getStaffProfile(staffId);
    }
}
