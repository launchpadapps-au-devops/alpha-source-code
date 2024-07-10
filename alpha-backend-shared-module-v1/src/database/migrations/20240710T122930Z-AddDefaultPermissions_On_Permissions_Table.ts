import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDefaultPermissions_On_Permissions_Table20240710T122930Z implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const permissions = [
            { id: 1, name: 'Super Admin' },
            { id: 2, name: 'Create Team Member' },
        ];

        const values = permissions.map(permission => `(${permission.id}, '${permission.name}')`).join(', ');

        await queryRunner.query(
            `INSERT INTO permissions (id, name)
             VALUES ${values}
             ON CONFLICT (id) DO NOTHING`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const permissionIds = [1, 2];

        await queryRunner.query(
            `DELETE FROM permissions WHERE id IN (${permissionIds.join(', ')})`
        );
    }
}