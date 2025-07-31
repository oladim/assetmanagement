# Install dependencies and build
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy package files first and install
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Build the Next.js app
RUN npm run build

# Expose port and run the app
EXPOSE 3000
CMD ["npm", "run", "dev"]
