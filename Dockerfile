FROM node:20-alpine AS base

# Stage 1: Install dependencies
FROM base AS deps
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
COPY sst-env.d.ts* ./
RUN pnpm install --frozen-lockfile

# Stage 2: Build the application
FROM base AS build
WORKDIR /app
RUN npm install -g pnpm
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG SST_RESOURCE_App
ARG SST_RESOURCE_Postgres
ARG SST_RESOURCE_Redis
ARG SST_RESOURCE_Auth
ARG SST_RESOURCE_STRIPE_PRODUCT_ID
ARG SST_RESOURCE_STRIPE_PUBLISHABLE_KEY
ARG SST_RESOURCE_STRIPE_SECRET_KEY
ARG SST_RESOURCE_STRIPE_WEBHOOK_SECRET
ARG SST_RESOURCE_YAHOO_CLIENT_ID
ARG SST_RESOURCE_YAHOO_CLIENT_SECRET

RUN pnpm build

# Stage 3: Production server
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
