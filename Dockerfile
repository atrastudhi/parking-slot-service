FROM node:alpine

WORKDIR /app
COPY package*json /app/
RUN npm install --production --silent
COPY . .
CMD ["npm", "run", "start"]

EXPOSE 8080