# Stage 1 — Install Dependencies
FROM node:20-alpine AS backend-builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .


# Stage 2 — Production Image
FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=backend-builder /app .


EXPOSE 3000

CMD ["npm", "run", "dev"]