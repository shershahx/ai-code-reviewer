# Use a lightweight Node.js base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files first to leverage Docker cache for dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port defined in your server.js
EXPOSE 3001

# Start the application
CMD ["npm", "start"]