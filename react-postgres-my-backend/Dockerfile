FROM node:lts-alpine

# Set production environment
ENV NODE_ENV=production

# Set working directory
WORKDIR /usr/src/app

# Install system deps for native modules like 'pg'
RUN apk add --no-cache python3 make g++

# Copy dependency files
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]

# Install only production dependencies
RUN npm install --production --silent

# Copy the rest of the app
COPY . .

# App runs on port 5000
EXPOSE 5000

# Set permissions and run as non-root user
RUN chown -R node /usr/src/app
USER node

# Start the app
CMD ["node", "index.js"]

