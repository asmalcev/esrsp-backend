# Base image
FROM node:18

# Create app directory
WORKDIR /usr/src/app

COPY package.json yarn.lock ./

# Install app dependencies
RUN yarn install --frozen-lockfile

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN yarn build

RUN yarn install --frozen-lockfile --production && yarn cache clean

# Start the server using the production build
CMD ["yarn", "start:prod"]