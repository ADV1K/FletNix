FROM node:20-alpine

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml* ./
COPY pnpm-workspace.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile --prod

# Copy source code
COPY src ./src

# Copy CSV file (we will use a volume mount for this)
# COPY ./netflix_titles.csv ./netflix_titles.csv

# Expose port
EXPOSE 3000

# Copy health check script
COPY healthcheck.js ./healthcheck.js

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node healthcheck.js

# Start application
CMD ["node", "src/app.js"]

