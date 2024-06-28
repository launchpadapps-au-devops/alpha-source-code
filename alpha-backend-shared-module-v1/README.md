# 🎭 Alpha Backend Shared Module v1

The `@launchpadapps/shared-module-v1` is a versatile toolkit designed to support the Alpha project's needs for efficient data management and more. Built with TypeScript and leveraging TypeORM, it offers a unified approach to handle database operations, constant enums, shared data, and other reusable utilities, fostering consistency and enhancing code quality across services.

## Highlights

- 🛢 **Unified Database Operations**: Leverages TypeORM for streamlined interactions with PostgreSQL.
- 🗂 **Entity Model Centralization**: Consolidates entity models, promoting a unified database schema approach.
- 🚥 **Enums and Constants**: Provides project-wide enums and constants, ensuring uniformity in data representation.
- 🔧 **Shared Utilities**: A collection of reusable utilities and functions, from data manipulation to common business logic.
- 🔒 **Type Safety**: Ensures robust type checking and enhanced developer experience with TypeScript.

## Module Structure

The shared module is organized into several key directories within the `src` folder, each serving a specific purpose:

- **`database/dto`**: Contains Data Transfer Objects (DTOs) that define the structure for data being sent to and from the database services.
- **`database/entities`**: Hosts the entity definitions used by TypeORM for ORM mapping between TypeScript objects and database tables.
- **`database/interfaces`**: Includes interfaces that define the contract for services and configurations used within the module.
- **`database/services`**: Contains services that encapsulate business logic for database operations, leveraging the defined entities and DTOs.

```
src
└── database
    ├── dto
    │   └── user.dto.ts
    ├── entities
    │   └── user.entity.ts
    ├── interfaces
    │   ├── IDatabaseConfig.interface.ts
    │   └── IUserService.interface.ts
    └── services
        └── user.service.ts
```

## Getting Started

### Prerequisites

Ensure you have the following installed:
- Node.js (version specified in `package.json`)
- TypeORM (as this module uses TypeORM for database interactions)
- A PostgreSQL database instance (local or remote)

### Installation

To integrate this shared module into your microservice, add it as a dependency in your `package.json` and follow the setup instructions for initializing the database connection.

```json
"dependencies": {
  "@launchpadapps-au/alpha-shared": "1.0.0"
}
```

### Usage

#### Initializing the Database Connection

Import and initialize the `DatabaseModule` at the start of your application, providing the necessary database configuration:

```typescript
import { DatabaseModule } from '@launchpadapps-au/alpha-shared';

DatabaseModule.initialize({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'yourUsername',
  password: 'yourPassword',
  database: 'yourDatabase',
});
```

#### Utilizing Services

After initialization, you can use the provided services to perform database operations. For example, to create a new user:

```typescript
import { userService } from '@launchpadapps-au/alpha-shared-db';

async function findUserById(id: number) {
  const user = await userService.findUserById(id);
  console.log(user);
}
```

Certainly! Including a section on how to properly export newly added components through the shared module's `index.ts` is essential for ensuring seamless integration and usage. Here's how you could seamlessly integrate this section into the existing guide for extending the shared module:

---

## Extending the Shared Module

### Adding New Entities

When introducing a new entity to the shared module, follow these steps:

1. **Create the Entity File**: Define your entity in a new file within the `src/database/entities` directory. Use TypeORM decorators to map the entity to a database table.

   Example for a `Product` entity:

   - **src/database/entities/product.entity.ts**
     ```typescript
     import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

     @Entity()
     export class Product {
       @PrimaryGeneratedColumn()
       id: number;

       @Column()
       name: string;

       @Column()
       price: number;
     }
     ```

2. **Register the Entity**: Ensure the new entity is included in the `DataSource` initialization in the `DatabaseModule`. This typically involves adding the entity class to the `entities` array in the database configuration.

### Adding New Operations

To add new operations or methods related to an entity:

1. **Define the Interface**: If the operation is significant or could be used across multiple services, consider defining an interface for it in the `src/database/interfaces` directory.

   Example interface for a product service operation:

   - **src/database/interfaces/IProductService.interface.ts**
     ```typescript
     import { CreateProductDto, ProductDto } from '../dto/product.dto';

     export interface IProductService {
       createProduct(createProductDto: CreateProductDto): Promise<ProductDto>;
       // Additional method signatures
     }
     ```

2. **Create or Update DTOs**: Define any Data Transfer Objects (DTOs) needed for the new operation in the `src/database/dto` directory.

   Example DTOs for creating and transferring product data:

   - **src/database/dto/create-product.dto.ts**
     ```typescript
     export class CreateProductDto {
       name: string;
       price: number;
     }
     ```

   - **src/database/dto/product.dto.ts**
     ```typescript
     export class ProductDto {
       id: number;
       name: string;
       price: number;
     }
     ```

3. **Implement the Operation in the Service**: Add the new operation to the relevant service in the `src/database/services` directory, implementing the interface if you created one.

   Example method in `ProductService`:

   - **src/database/services/product.service.ts**
     ```typescript
     import { IProductService } from '../interfaces/IProductService.interface';
     import { CreateProductDto, ProductDto } from '../dto/product.dto';
     import { Product } from '../entities/product.entity';
     import { DatabaseModule } from '../index';

     class ProductService implements IProductService {
       private get productRepository() {
         return DatabaseModule.getRepository(Product);
       }

       async createProduct(createProductDto: CreateProductDto): Promise<ProductDto> {
         const product = this.productRepository.create(createProductDto);
         await this.productRepository.save(product);
         return { id: product.id, name: product.name, price: product.price };
       }
       // Additional methods
     }

     export const productService = new ProductService();
     ```

### Exporting From the Main Index File

After adding new components (entities, DTOs, interfaces, services), ensure they are properly exported from the shared module's main `index.ts` file. This allows these components to be easily imported and used by the consuming microservices.

- **src/index.ts**
  ```typescript
  /**
   * @module index
   * @description Entry point for the shared module
   * @created 2024-04-01
   * @author <gajanand@launchpadapps.co>
   */

  // Database Connection
  export { DatabaseModule } from './database/index';

  // User Module
  export * from './database/entities/user.entity';
  export * from './database/dto/user.dto';
  export * from './database/services/user.service';

  // Product Module (newly added components example)
  export * from './database/entities/product.entity';
  export * from './database/dto/product.dto';
  export * from './database/services/product.service';
  ```

### Incorporating Changes into the Microservices

After updating the shared module:

- Update the microservices to import and use the new functionalities as needed.
- Ensure microservices are restarted to pick up changes from the shared module if using local linking during development.

Certainly! To incorporate instructions for recompiling the shared module with `npm run build`, and ensuring those changes are reflected in the microservice, here’s an updated section of the `README.md` with added details under the **Local Development and Linking** section:

---

## Local Development and Linking

For local development, especially when testing changes to the shared module within a microservice, you can use `npm link` for a symlink-based integration. This facilitates testing changes immediately without needing to publish the module.

### Step 1: Linking the Shared Module Globally

1. **In the Shared Module Directory**:
   - Open a terminal and navigate to your shared module directory.
   - Ensure your module is compiled:
     ```sh
     npm run build
     ```
   - Create a global symlink:
     ```sh
     npm link
     ```
   This command makes your shared module accessible globally on your machine.

### Step 2: Linking the Shared Module in Your Microservice

1. **In Your Microservice's Directory**:
   - Open a new terminal window and navigate to your microservice directory.
   - Link the globally linked shared module:
     ```sh
     npm link @launchpadapps-au/alpha-shared-db
     ```
   Replace `@launchpadapps-au/alpha-shared-db` with the actual name of your shared module.

### Recompiling After Changes

When you make changes to the shared module:

1. **Recompile the Shared Module**:
   - Return to the shared module directory.
   - Run the build command to recompile:
     ```sh
     npm run build
     ```
   This step is crucial to ensure that the latest changes are compiled into the JavaScript that your microservice will use.

2. **Restart the Microservice** (if necessary):
   - Depending on your microservice setup, you may need to restart the microservice to pick up changes from the shared module.
   - For a typical Node.js application, this could simply be stopping and starting your application again.

### Unlinking

To unlink the shared module and revert to using a version from an npm registry:

1. **Inside the Microservice Directory**:
   ```sh
   npm unlink @launchpadapps-au/alpha-shared-db
   ```

2. **Reinstall Dependencies**:
   ```sh
   npm install
   ```
   This step ensures your `node_modules` directory and `package-lock.json` are correctly updated, removing the symlink.

### Migration Generation Script

The `generate-migration.ts` script generates new database migration files. This ensures that your database schema changes are properly versioned and can be applied consistently across different environments.

```typescript
generateMigration(migrationName).catch((err) => {
  console.error('Error during migration generation:', err);
  process.exit(1);
});
```

### Migration Shell Script

#### Purpose

The `migrate.sh` script is a shell script that automates the execution of the `generate-migration.ts` script to create a new migration file.

#### File: `migrate.sh`

```sh
#!/bin/bash

# Load environment variables from .env file
if [ -f .env ]; then
  export $(cat .env | xargs)
fi

# Path to the migration script
MIGRATION_SCRIPT="./src/database/generate-migration.ts"

# Check if migration name is provided
if [ -z "$1" ]; then
  echo "Please provide a migration name."
  exit 1
fi

MIGRATION_NAME=$1

# Run the migration script with the provided migration name
ts-node $MIGRATION_SCRIPT $MIGRATION_NAME

if [ $? -ne 0 ]; then
  echo "Error generating migration."
  exit 1
fi

echo "Migration generated successfully."
```

#### Making the Shell Script Executable

Make the `migrate.sh` script executable by running:

```sh
chmod +x migrate.sh
```

#### Running the Migration Generation Script

To generate a new migration file, use the following command:

```sh
npm run generate-migration MigrationName
```

Replace `MigrationName` with the name of your migration. This script will:

1. Load environment variables from the `.env` file.
2. Call the `generate-migration.ts` script with the provided migration name.
3. Create a new migration file in the `src/database/migrations` directory with a timestamped filename.
#### Running the Migration

This is handled automatically while creating data source in database/index.ts file

```sh
this.dataSource.initialize()
      .then(() => {
        console.log("Data Source has been initialized!")
        console.log("Running migrations...");
        this.dataSource.runMigrations()
        .then(() => {
          console.log("Migrations have been run.");
        })
        .catch((err) => {
          console.error("Error running migrations:", err);
          throw err;
        });
      })
      .catch((err) => {
        console.error("Error during Data Source initialization:", err);
        throw err;
      });
```

### Future Todos

- **Watching for Changes**: For a more automated workflow, consider implementing a watch mode in your shared module that automatically recompiles on changes. Tools like TypeScript's `tsc -w` or webpack's watch mode can facilitate this.
- **Testing and Validation**: Regularly test the integration between the shared module and microservices to ensure compatibility and correct functionality, especially after making changes.
