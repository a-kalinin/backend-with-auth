# Backend boilerplate

## Included:
- authentication endpoints and logic, including tokens processing
- auto-generating endpoints and OpenAPI specification (swagger) via **tsoa**
- Typescript
- Eslint
- Jest tests, including endpoints' tests
- error handling
- mail service
- sessions
- Postgre database in Docker container for development


## Note
After initialization:
- Remember to change database settings in docker files and
in `src/db/AppDataSource.ts`
- You have to create `.env` file with settings
 you can find in `.env.example`


## TODO:
- use TypeORM session storage
- add cleaning outdated records from DB
