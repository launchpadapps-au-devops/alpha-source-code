import * as path from 'path';
import * as fs from 'fs';
import { Project } from 'ts-morph';

const generateMigration = async (migrationName: string) => {
  const migrationsDir = path.resolve(__dirname, 'migrations');
  if (!fs.existsSync(migrationsDir)) {
    fs.mkdirSync(migrationsDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
  const className = `${migrationName}${timestamp}`;
  const migrationFilePath = path.join(migrationsDir, `${timestamp}-${migrationName}.ts`);

  const project = new Project();
  const sourceFile = project.createSourceFile(migrationFilePath, '', { overwrite: true });

  sourceFile.addImportDeclaration({
    namedImports: ['MigrationInterface', 'QueryRunner'],
    moduleSpecifier: 'typeorm',
  });

  sourceFile.addClass({
    name: className,
    implements: ['MigrationInterface'],
    methods: [
      {
        name: 'up',
        isAsync: true,
        parameters: [{ name: 'queryRunner', type: 'QueryRunner' }],
        statements: [
          '// Add your SQL commands here, e.g., "await queryRunner.query(`CREATE TABLE example ...`);"',
        ],
      },
      {
        name: 'down',
        isAsync: true,
        parameters: [{ name: 'queryRunner', type: 'QueryRunner' }],
        statements: [
          '// Add your SQL commands to reverse the migration here, e.g., "await queryRunner.query(`DROP TABLE example ...`);"',
        ],
      },
    ],
  });

  await project.save();
  console.log(`Migration ${className} has been generated at ${migrationFilePath}.`);
};

const migrationName = process.argv[2];

if (!migrationName) {
  console.error('Please provide a migration name.');
  process.exit(1);
}

generateMigration(migrationName).catch((err) => {
  console.error('Error during migration generation:', err);
  process.exit(1);
});
