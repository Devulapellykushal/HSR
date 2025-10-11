# Project Checklist

This document tracks the implemented features and setup in this NestJS project. Items with a checkmark are implemented and wired in the application.

## Application Core
- [x] `ConfigModule.forRoot({ isGlobal: true })` configured in `src/app.module.ts`
- [x] TypeORM connection configured via `TypeOrmModule.forRootAsync` using `getCommonDbConfig()` in `src/config/database.config.ts`
- [x] Auto-load entities enabled (`autoLoadEntities: true`)
- [x] `AppController` and `AppService` registered in `src/app.module.ts`

## Modules (in `src/modules/`)
The following modules exist in the repository. Checkmarks indicate they are imported in `AppModule` and thus active.

- [x] `auth/` imported as `AuthModule`
- [x] `api/` imported as `ApiModule`
- [x] `document-types/` imported as `DocumentTypesModule`
- [x] `bloodgroup-types/` imported as `BloodGroupTypesModule`
- [x] `clothingsize-types/` imported as `ClothingSizeTypesModule`
- [x] `shoesize-types/` imported as `ShoesizeTypesModule`
- [x] `relation-types/` imported as `RelationTypesModule`
- [ ] `family-members/` exists, not imported in `AppModule`
- [ ] `users/` exists, not directly imported in `AppModule` (may be used internally by `AuthModule`)

## Configuration & Environment
- [x] Centralized database config in `src/config/database.config.ts`
- [x] TypeORM data source configuration in `src/config/typeorm.config.ts`
- [x] Example environment file `.env.example`

## Database: Migrations & Seeds
Scripts available in `package.json`.

- [x] Generate migration: `bun run migration:generate`
- [x] Create empty migration: `bun run migration:create`
- [x] Run migrations: `bun run migration:run`
- [x] Revert last migration: `bun run migration:revert`
- [x] Seed script: `bun run seed` (entry: `src/database/seeds/seed.ts`)

## Testing
- [x] Unit tests: `bun run test`
- [x] E2E tests: `bun run test:e2e` (config: `test/jest-e2e.json`)
- [x] Coverage: `bun run test:cov`

## Tooling
- [x] ESLint configured (`eslint.config.mjs`)
- [x] Prettier configured (`.prettierrc`)
- [x] TypeScript config (`tsconfig.json`, `tsconfig.build.json`)
- [x] Nest CLI config (`nest-cli.json`)

## API & Docs
- [ ] Swagger setup not confirmed in `src/app.module.ts` (dependencies present: `@nestjs/swagger`, `swagger-ui-express`)

## Auth
- [x] `@nestjs/jwt` and `@nestjs/passport` dependencies present
- [x] `AuthModule` imported into `AppModule`
- [ ] JWT secret configuration: ensure `.env` has `JWT_SECRET` (see guidance in `README.md` lines 121–126)

## Run & Build
- [x] Development: `bun run start:dev`
- [x] Production: `bun run start:prod`
- [x] Lint: `bun run lint`
- [x] Format: `bun run format`

## Next Steps
- [ ] Import and wire `FamilyMembersModule` into `AppModule` if ready
- [ ] Import and wire `UsersModule` into `AppModule` if intended to expose user routes independently of auth
- [ ] Implement and enable Swagger in the bootstrap (e.g., in `main.ts`) to document APIs
- [ ] Populate `dropdown/` module or remove it if not needed
- [ ] Update `README.md` with project-specific description and usage

---
Last updated: 2025-10-11 14:41:16 (+05:30)
