# # ─────────────────────────────────────────
# # Stage 1: Install dependencies
# # ─────────────────────────────────────────
# FROM node:20-alpine AS deps

# WORKDIR /app

# COPY package*.json ./

# RUN npm install

# # ─────────────────────────────────────────
# # Stage 2: Development
# # ─────────────────────────────────────────
# FROM node:20-alpine AS development

# WORKDIR /app

# # Copy only node_modules from deps stage
# # avoids reinstalling in final image
# COPY --from=deps /app/node_modules ./node_modules

# COPY . .

# EXPOSE 5173

# CMD ["npm", "run", "dev"]

# --------------------------

# ─────────────────────────────────────────
# Stage 1: Build
# ─────────────────────────────────────────
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ─────────────────────────────────────────
# Stage 2: Production (Nginx)
# ─────────────────────────────────────────
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]