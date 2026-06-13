# Authentication Module

This backend implements password-based authentication for the Mechanic Setu platform with customers, mechanics, and administrators. The module uses Express.js, PostgreSQL, bcrypt password hashing, JWT access tokens, JWT refresh tokens with rotation, and role-based authorization.

## Architecture

The project already uses CommonJS and feature folders under `src/features`, so authentication follows that convention while keeping routes, controllers, services, and repositories separated.

```text
src/
  config/env.js
  features/auth/
    constants/auth.constants.js
    controllers/auth.controller.js
    dtos/auth.dto.js
    interfaces/auth.interfaces.js
    repositories/
      refreshToken.repository.js
      user.repository.js
    routes/auth.routes.js
    services/
      auth.service.js
      token.service.js
    validators/auth.validator.js
    auth.types.js
  infrastructure/
    database/
      migrate.js
      migrations/
        20260613184500_create_auth_schema.sql
      postgres.js
      schema.sql
  middleware/
    authenticate.js
    authorize.js
    errorHandler.js
  shared/
    constants/httpStatus.js
    exceptions/ValidationError.js
    responses/apiResponse.js
    utils/
      asyncHandler.js
      date.js
      hash.js
      validateRequest.js
```

Routes declare HTTP paths and middleware. Controllers stay thin and call services. Services enforce business rules such as registration, login, account locks, refresh-token rotation, and logout. Repositories own all SQL. Shared utilities provide validation, response envelopes, hashing, date helpers, and async error forwarding.

## Database

Run migrations with:

```bash
npm run migrate
```

The migration runner creates `schema_migrations` and applies SQL files in filename order.

### Tables

`roles`

Stores role definitions. `CUSTOMER`, `MECHANIC`, and `ADMIN` are seeded as system roles. More roles can be added later without changing the user table.

`users`

Stores phone number, bcrypt password hash, account status, failed login counters, lock expiry, timestamps, and `deleted_at` for soft deletion. Passwords are never stored in plain text.

`user_roles`

Maps users to one or more roles. This keeps RBAC extensible and avoids locking the platform to a single role column.

`refresh_tokens`

Stores hashed JWT refresh tokens, token IDs, token-family IDs, parent/replacement token links, expiry, revocation timestamps, IP address, user agent, and soft deletion metadata.

### Schema Optimization

The schema includes:

- Unique active phone numbers.
- Unique active role names.
- Foreign keys from `user_roles` and `refresh_tokens`.
- Lookup indexes for user roles, refresh-token families, token expiry, revocation state, and soft deletes.
- `created_at`, `updated_at`, and `deleted_at` fields on auth tables.
- PostgreSQL triggers to keep `updated_at` current.
- Check constraints for phone number format, account status, and failed-login counters.

## Authentication Flows

### Register

```text
Client -> POST /api/v1/auth/register
API -> validate phoneNumber, password, role
API -> reject duplicate phone numbers
API -> hash password with bcrypt
API -> create ACTIVE user
API -> assign CUSTOMER or MECHANIC role
API -> return public user data
```

### Login

```text
Client -> POST /api/v1/auth/login
API -> load user by phone number
API -> reject disabled or temporarily locked accounts
API -> compare password with bcrypt
API -> increment failed login counter on failure
API -> lock account after configured failures
API -> reset failed login state on success
API -> issue JWT access token
API -> issue JWT refresh token and store hash
API -> return user and tokens
```

### Refresh Token

```text
Client -> POST /api/v1/auth/refresh-token
API -> verify refresh JWT signature, issuer, and audience
API -> hash presented refresh token
API -> load persisted token record
API -> reject expired or revoked tokens
API -> revoke token family if reuse is detected
API -> create replacement refresh token in same family
API -> revoke previous refresh token
API -> return new access and refresh tokens
```

### Logout

```text
Client -> POST /api/v1/auth/logout
API -> hash presented refresh token
API -> revoke matching token if it exists
API -> return success
```

### Get Current User

```text
Client -> GET /api/v1/auth/me
API -> verify Bearer access token
API -> load active user and roles
API -> return public user profile
```

## API Endpoints

All endpoints are mounted under `/api/v1/auth`.

### POST `/register`

Registers a customer or mechanic.

Request:

```json
{
  "phoneNumber": "+94771234567",
  "password": "Passw0rd!",
  "role": "CUSTOMER"
}
```

Response `201`:

```json
{
  "success": true,
  "message": "User registered successfully.",
  "data": {
    "user": {
      "id": "uuid",
      "phoneNumber": "+94771234567",
      "status": "ACTIVE",
      "roles": ["CUSTOMER"],
      "createdAt": "2026-06-13T00:00:00.000Z",
      "updatedAt": "2026-06-13T00:00:00.000Z"
    }
  }
}
```

### POST `/login`

Authenticates with phone number and password.

Request:

```json
{
  "phoneNumber": "+94771234567",
  "password": "Passw0rd!"
}
```

Response `200`:

```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "user": {
      "id": "uuid",
      "phoneNumber": "+94771234567",
      "status": "ACTIVE",
      "roles": ["CUSTOMER"],
      "createdAt": "2026-06-13T00:00:00.000Z",
      "updatedAt": "2026-06-13T00:00:00.000Z"
    },
    "tokens": {
      "accessToken": "access-jwt",
      "refreshToken": "refresh-jwt",
      "tokenType": "Bearer",
      "expiresIn": 900
    }
  }
}
```

### POST `/refresh-token`

Rotates a refresh token and returns a new token pair.

Request:

```json
{
  "refreshToken": "refresh-jwt"
}
```

Response `200`:

```json
{
  "success": true,
  "message": "Token refreshed.",
  "data": {
    "tokens": {
      "accessToken": "new-access-jwt",
      "refreshToken": "new-refresh-jwt",
      "tokenType": "Bearer",
      "expiresIn": 900
    }
  }
}
```

### POST `/logout`

Revokes the current refresh token.

Request:

```json
{
  "refreshToken": "refresh-jwt"
}
```

Response `200`:

```json
{
  "success": true,
  "message": "Logout successful."
}
```

### GET `/me`

Requires `Authorization: Bearer <accessToken>`.

Response `200`:

```json
{
  "success": true,
  "message": "Current user loaded.",
  "data": {
    "user": {
      "id": "uuid",
      "phoneNumber": "+94771234567",
      "status": "ACTIVE",
      "roles": ["CUSTOMER"],
      "createdAt": "2026-06-13T00:00:00.000Z",
      "updatedAt": "2026-06-13T00:00:00.000Z"
    }
  }
}
```

## JWT Strategy

Access tokens are signed with `JWT_ACCESS_SECRET`. They include `sub`, `phoneNumber`, and `roles`, and are validated with issuer and audience checks.

The `authenticate` middleware reloads the user from PostgreSQL before allowing protected requests. This prevents deleted, disabled, locked, or otherwise inactive accounts from continuing to use old access tokens.

Recommended production settings:

```text
JWT_ACCESS_EXPIRES_IN=15m
JWT_ACCESS_SECRET=<strong random secret>
JWT_REFRESH_SECRET=<strong random secret>
JWT_ISSUER=mechanic-setu-api
JWT_AUDIENCE=mechanic-setu-clients
```

## Refresh Token Strategy

Refresh tokens are signed JWTs using `JWT_REFRESH_SECRET`. They include `sub`, `jti`, `familyId`, and `type: "refresh"`. The database stores only the SHA-256 hash of the refresh token plus metadata required for rotation and reuse detection.

During refresh, the presented token is revoked and replaced by a new token in the same family. If a revoked or replaced refresh token is presented again, the entire family is revoked.

## RBAC

Roles live in the `roles` table and assignments live in `user_roles`.

Example:

```js
const { authenticate } = require('./src/middleware/authenticate');
const { authorize } = require('./src/middleware/authorize');

router.get('/admin-only', authenticate, authorize('ADMIN'), handler);
```

Self-registration allows `CUSTOMER` and `MECHANIC`. `ADMIN` should be assigned through a controlled administrative workflow or migration.

## Security Considerations

- Passwords are hashed with bcrypt using `BCRYPT_ROUNDS`.
- Plain-text passwords and refresh tokens are never stored.
- Public DTOs exclude password hashes and token hashes.
- Request validators reject unknown fields to reduce mass-assignment risk.
- Auth endpoints are rate limited, with stricter limits for credential endpoints.
- Login failures are counted and accounts are temporarily locked after repeated failures.
- Access tokens are short lived.
- Refresh tokens rotate on every use and detect reuse.
- User status is checked during access-token authentication and refresh.
- Centralized error handling avoids exposing raw internals in production.

## Environment Variables

```text
DB=postgresql://...
JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
JWT_ACCESS_EXPIRES_IN=15m
JWT_ISSUER=mechanic-setu-api
JWT_AUDIENCE=mechanic-setu-clients
BCRYPT_ROUNDS=12
REFRESH_TOKEN_DAYS=30
ACCOUNT_LOCK_MINUTES=15
MAX_FAILED_LOGIN_ATTEMPTS=5
AUTH_RATE_LIMIT_WINDOW_MS=900000
AUTH_RATE_LIMIT_MAX=50
CREDENTIAL_RATE_LIMIT_MAX=10
```

Production startup rejects missing JWT secrets. Rotate secrets through the deployment platform and redeploy services that issue or verify tokens together.

## Development Guidelines

- Put auth business rules in services, not routes or controllers.
- Keep SQL in repositories.
- Add a migration for every schema change.
- Use `authenticate` before `authorize`.
- Return public DTOs only.
- Keep access tokens short-lived and refresh-token rotation enabled.
- Add tests around validation, token rotation, authorization, and account lock behavior when extending the module.
