FROM node:18-alpine3.14 as base-image

# update packages
# RUN apk update

ENV NODE_ENV=development

WORKDIR /app

# copy package lists to run install next step
COPY ["package.json", "package-lock.json*", "tsconfig.json", "tsoa.json", "./"]

# Install dependencies into image
# RUN npm install --production
RUN npm install

COPY src src

FROM base-image as production-image

ENV NODE_PATH=./dist

RUN npm run build
