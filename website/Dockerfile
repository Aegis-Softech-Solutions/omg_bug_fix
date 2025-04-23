FROM node:12-buster

# Install system dependencies for canvas
RUN apt-get update && apt-get install -y \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    g++ \
    make \
    python \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package.json yarn.lock ./

# Install Node modules
RUN yarn install --frozen-lockfile --ignore-engines

COPY . .
RUN yarn build

CMD ["yarn", "start"]