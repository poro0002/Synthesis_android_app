# Use Node 20 as base image
FROM node:20

# Set working directory inside the container
WORKDIR /app

# Copy package files and install dependencies first (to use Docker cache)
COPY package*.json ./

# Install app dependencies
RUN npm install --production


# Copy the rest of your project files
COPY . .

# Expose the backend port
EXPOSE 8080

# Start the server with nodemon
CMD ["node", "server/server.js"]
