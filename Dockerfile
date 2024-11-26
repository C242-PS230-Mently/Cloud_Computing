# Use Node.js version 20 as the base image
FROM node:20

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose the port that Cloud Run will use
EXPOSE 8080

# Start the application
CMD [ "npm", "start" ]
