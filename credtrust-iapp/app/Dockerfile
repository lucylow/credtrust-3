# credtrust-iapp/app/Dockerfile - Production TEE iApp
FROM node:20-alpine AS builder

WORKDIR /app
COPY package.json .
RUN npm ci --only=production

# Copy ZKP circuits (precompiled) + app sources
COPY zkp/ zkp/
COPY credtrust.js ./

# Multi-stage: Production runtime
FROM node:20-alpine AS runtime
WORKDIR /app

# Install iExec tooling and minimal deps
RUN apk add --no-cache bash curl \
    && npm install -g @iexec/sdk @iexec/web3mail @iexec/dataprotector \
    && npm cache clean --force

COPY --from=builder /app .

# TEE Entrypoint
ENTRYPOINT ["node", "credtrust.js"]
