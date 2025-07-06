FROM node:20.10.0

# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps
# Bundle app source
COPY . .
# Expose the port the app runs on
EXPOSE 3000
# Run the app
CMD [ "npm", "start" ]
# Build the image
# docker build -t my-node-app .
# Run the container
# docker run -p 3000:3000 my-node-app