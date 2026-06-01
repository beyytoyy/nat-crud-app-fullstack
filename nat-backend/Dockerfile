FROM node:18-alpine

WORKDIR /app

# COPY PACKAGE FILES
COPY package*.json ./

# INSTALL DEPENDENCIES
RUN npm install --production

# COPY SOURCE FILES
COPY . .

EXPOSE 5000

CMD ["node", "server.js"]