# Use the official Node.js 18 image as a base
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY .env .env

# Expose port 8080 for Cloud Run (which uses this port by default)
EXPOSE 8000

# Start the application using npm start
CMD ["npm", "start"]
