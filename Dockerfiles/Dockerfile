FROM node:latest
ENV NODE_ENV production
COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm install 
COPY . .
EXPOSE 3000
CMD ["node", "index.js"]