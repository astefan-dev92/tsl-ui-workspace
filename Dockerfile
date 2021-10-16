FROM node:14-alpine as dependencies

# Copy the package json to install dependencies
COPY package*.json ./

# Run the npm install
RUN npm install

# Install jsonenv for converting secrets to env vars
RUN wget -q https://bitbucket.org/thirdspacelearningdevs/jsonenv/downloads/jsonenv-linux -O /usr/local/bin/jsonenv && \
  chmod +x /usr/local/bin/jsonenv

FROM node:14-alpine

# Create a non-root user to run the app and own app-specific files
RUN adduser -D app

# Switch to this user
USER app

# We'll install the app in this directory
WORKDIR /app

# Copy over jsonenv from dependencies stage
COPY --from=dependencies /usr/local/bin/jsonenv /usr/local/bin/jsonenv

# Copy the node_modules folder
COPY --from=dependencies --chown=app /node_modules ./node_modules

# Copy the node_modules folder
COPY --from=dependencies --chown=app /package-lock.json ./package-lock.json

# Copy the source code
COPY --chown=app . ./

EXPOSE ${PORT}

CMD ["bin/entrypoint"]