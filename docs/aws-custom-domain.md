# AWS custom domain checklist

## Goal

- Public API domain: `http://api.appacompuv.xyz`
- API base path: `/api/v1`
- Final mobile API URL: `http://api.appacompuv.xyz/api/v1`

## Frontend values

Use these values for Expo and EAS builds:

```env
API_URL=http://api.appacompuv.xyz/api/v1
BASE_URL=http://api.appacompuv.xyz
ALLOW_CLEARTEXT_TRAFFIC=true
```

Notes:

- `API_URL` is used by the app for all REST calls.
- `BASE_URL` is used for full file URLs such as assistant images.
- `ALLOW_CLEARTEXT_TRAFFIC=true` allows Android to connect over `http://`.

## Backend values

Use these values in Elastic Beanstalk environment variables:

```env
NODE_ENV=production
API_URL=/api/v1
BASE_URL_PROD=http://api.appacompuv.xyz
```

Keep `BASE_URL_DEV=http://localhost:3001` for local development.

Notes:

- `BASE_URL_PROD` is used to build verification links, password reset links, and upload URLs.
- `API_URL` should stay as a path such as `/api/v1`, not a full domain.

## Elastic Beanstalk

1. Confirm the environment is healthy and answering on its Elastic Beanstalk URL.
2. Point Route 53 `api.appacompuv.xyz` to the Elastic Beanstalk environment.
3. Set the production environment variables in Elastic Beanstalk and redeploy.
4. When you move to HTTPS later, attach an ACM certificate and switch the URLs back to `https://`.

## Build and validation

1. Run `npx expo config` inside `Frontend/` and confirm the resolved `extra.API_URL` and `extra.BASE_URL`.
2. Build the app with the desired EAS profile.
3. Test:
   - login
   - register
   - email verification link
   - forgot password flow
   - assistant image loading
   - mood registration

## Recommended production URLs

- API root: `http://api.appacompuv.xyz/`
- Health/manual check: `http://api.appacompuv.xyz/`
- Login endpoint: `http://api.appacompuv.xyz/api/v1/auth/login`
- Email verification endpoint: `http://api.appacompuv.xyz/api/v1/auth/verificar`
