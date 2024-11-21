# Use the official Node.js image
FROM node:16

# Set the working directory to /app/api
WORKDIR /api

# Copy only the contents of the 'api' directory (including package.json)
COPY api/package.json api/package-lock.json ./

# Install dependencies in the /app/api directory
RUN npm install

# Copy the rest of the files
COPY api/ .

# Set the command to start your app
CMD ["node", "src/index.js"]
