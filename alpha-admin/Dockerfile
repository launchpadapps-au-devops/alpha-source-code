# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the app
RUN npm run build

# Expose the port that the app runs on
EXPOSE 4173

# Command to start the app in preview mode
CMD ["npm", "run", "preview", "--", "--host"]
