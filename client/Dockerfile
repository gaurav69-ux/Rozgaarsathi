# ─────────────────────────────────────────
# Stage 1: Install dependencies
# ─────────────────────────────────────────
FROM node:20-alpine AS deps

WORKDIR /app

COPY package*.json ./

RUN npm install

# ─────────────────────────────────────────
# Stage 2: Development
# ─────────────────────────────────────────
FROM node:20-alpine AS development

WORKDIR /app

# Copy only node_modules from deps stage
# avoids reinstalling in final image
COPY --from=deps /app/node_modules ./node_modules

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]