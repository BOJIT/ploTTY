FROM node:14 as base

WORKDIR /home/app/

# Install NPM dependencies first (cached layer)
COPY package.json ./
RUN npm install

# Copy across all other files
COPY . ./

# Run build script (in either Development or Production mode)
RUN ["chmod", "+x", "./build.sh"]
ENTRYPOINT ["bash", "./build.sh"]