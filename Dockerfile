FROM node:14
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY tsconfig.json ./
COPY . .
RUN npm run build
EXPOSE 8096
CMD ["npm", "start"]
