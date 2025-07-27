# Use Node 20 as base image
FROM node:20

# Set working directory inside the container
WORKDIR /app

# Copy package files and install dependencies first (to use Docker cache)
COPY package*.json ./

# Install app dependencies
RUN npm install

# Install nodemon globally for live reload
RUN npm install -g nodemon

# Copy the rest of your project files
COPY . .

# Expose the backend port
EXPOSE 4500

# Start the server with nodemon
CMD ["nodemon", "server/server.js"]