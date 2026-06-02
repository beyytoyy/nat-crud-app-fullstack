# BUILD STAGE
FROM node:18-alpine AS build

WORKDIR /app

# COPY PACKAGE FILES
COPY package*.json ./

# INSTALL DEPENDENCIES
RUN npm install --legacy-peer-deps

# COPY ALL SOURCE FILES
COPY . .

RUN echo "Build $(date)"

# BUILD THE REACT APP
RUN npm run build

# PRODUCTION STAGE
FROM nginx:alpine

# COPY BUILT FILES TO NGINX
COPY --from=build /app/build /usr/share/nginx/html

# COPY NGINX CONFIGURATION
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]