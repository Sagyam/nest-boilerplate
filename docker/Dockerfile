# Arguments for versions
ARG NODE_VERSION=20.18.0
ARG PNPM_VERSION=9.12.2
ARG ALPINE_VERSION=3.20

################################################################################
# Base stage: Build the application
FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS builder

# Set working directory
WORKDIR /usr/src/app

# Install pnpm globally with cache
RUN --mount=type=cache,target=/root/.npm \
    npm install -g pnpm@${PNPM_VERSION}

# Copy package.json and pnpm-lock.yaml to install dependencies
COPY ../package.json pnpm-lock.yaml ./

# Install dependencies with cache
RUN --mount=type=cache,target=/root/.pnpm-store \
    pnpm install --frozen-lockfile

# Copy the all application code
COPY .. .

# Setup prisma
RUN pnpm prisma generate

# Build the application
RUN pnpm run build

# Runner Stage
FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS runner

# Set working directory
WORKDIR /usr/src/app

# Copy the built application from the builder stage
COPY --from=builder /usr/src/app/dist ./dist
COPY ../package.json pnpm-lock.yaml ./
COPY ../prisma/schema.prisma ./prisma/schema.prisma

# Install pnpm globally
RUN --mount=type=cache,target=/root/.npm \
    npm install -g pnpm@${PNPM_VERSION}

# Install dependencies with cache
RUN --mount=type=cache,target=/root/.pnpm-store \
    pnpm install --frozen-lockfile --prod

# Set NODE_ENV to production
ENV NODE_ENV=production

# Run the application
CMD ["pnpm", "run", "start:prod"]
