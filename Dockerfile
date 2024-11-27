FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

RUN npx prisma generate

COPY . .

RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY --from=build /app/src /app/src
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/package*.json /app/
COPY --from=build /app/dist /app/dist
COPY --from=build /app/prisma /app/prisma

RUN npm install -g tsx

# Run prisma generate again in production
RUN npx prisma generate

EXPOSE 8080

CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db seed && npm run start"]
