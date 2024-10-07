# Sử dụng một image node chính thức để xây dựng Angular project
FROM node:20.17.0 AS build

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy toàn bộ file package.json và package-lock.json vào thư mục làm việc
COPY package*.json ./
RUN npm ci
# Cài đặt dependencies
RUN npm install -g @angular/cli

# Copy toàn bộ code của ứng dụng vào container
COPY . .

# Build ứng dụng Angular
RUN npm run build --configuration=production

# Sử dụng một image nginx chính thức để chạy Angular
FROM nginx:latest
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
# Copy file build của Angular vào thư mục phục vụ của Nginx
COPY --from=build /app/dist/stock-analysis /usr/share/nginx/html

# Expose port 80
EXPOSE 80
