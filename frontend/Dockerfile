# Multi-stage build for Angular SPA
FROM node:20-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml* ./
COPY pnpm-workspace.yaml* ./

# Install all dependencies (including devDependencies for build)
RUN pnpm install --frozen-lockfile

# Copy configuration files first
COPY angular.json ./
COPY tsconfig*.json ./
COPY tailwind.config.js ./
COPY postcss.config.js ./
COPY .eslintrc.json ./

# Copy source code
COPY src ./src

# Build Angular app
RUN pnpm exec ng build --configuration production

# Production stage with nginx
FROM nginx:alpine

# Copy built application (Angular outputs to browser subdirectory)
COPY --from=builder /app/dist/fletnix-frontend/browser /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 4200

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
