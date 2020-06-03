FROM node:13.12.0-alpine

ENV APP_ROOT /src


RUN mkdir ${APP_ROOT}
WORKDIR ${APP_ROOT}
ADD . ${APP_ROOT}

COPY package.json .
COPY package-lock.json .
RUN npm install --silent
RUN npm install react-scripts -g --silent
COPY . .

ENV HOST 0.0.0.0
CMD ["npm", "start"]
