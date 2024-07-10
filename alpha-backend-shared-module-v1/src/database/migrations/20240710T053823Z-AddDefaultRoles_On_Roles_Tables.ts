import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDefaultRoles_On_Roles_Tables20240710T053823Z implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const roles = [
            { id: 1, name: 'Nurse', description: 'Nurse role' },
            { id: 2, name: 'MPA', description: 'Medical Practitioner Assistant role' },
            { id: 3, name: 'Content Creator', description: 'Content Creator role' },
            { id: 4, name: 'GP', description: 'General Practitioner role' },
        ];

        const values = roles.map(role => `(${role.id}, '${role.name}', '${role.description}', now(), now())`).join(', ');

        await queryRunner.query(
            `INSERT INTO roles (id, name, description, "createdAt", "updatedAt")
             VALUES ${values}
             ON CONFLICT (id) DO NOTHING`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const roleIds = [1, 2, 3, 4, 5];

        await queryRunner.query(
            `DELETE FROM roles WHERE id IN (${roleIds.join(', ')})`
        );
    }
}
