FROM node:14-alpine as base

WORKDIR /home/app/

# Install NPM dependencies first (cached layer)
COPY package.json ./
RUN npm install

# Copy across all other files
COPY . ./

ENTRYPOINT ["npm", "run", "build"]
