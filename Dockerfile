# Use a base Node image
FROM node:16

# Set the working directory
WORKDIR /app

# Copy only necessary files
COPY . .

# Comment out or remove npm install to skip it
 RUN npm install

# Set the command to start the application
CMD ["node", "api/src/index.js"]