FROM node:23-alpine

RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package.json .

RUN npm i

COPY . .

EXPOSE 3000

CMD ["sh", "-c", "npm run gen && npx prisma generate && npx prisma migrate dev && npm run dev"]
