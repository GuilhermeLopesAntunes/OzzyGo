FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --verbose --no-audit --no-fund
EXPOSE 5173
CMD ["npm", "run", "dev"]