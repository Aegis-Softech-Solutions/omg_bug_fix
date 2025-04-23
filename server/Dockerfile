# Use Node.js 12 on Debian Buster
FROM node:12.22.12-buster

# Configure package sources using snapshot archive
RUN echo "deb http://snapshot.debian.org/archive/debian/20220101T000000Z buster main" > /etc/apt/sources.list

# Install system dependencies
RUN apt-get -o Acquire::Check-Valid-Until=false update && \
    apt-get install -y \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    python \
    make \
    g++ \
    nasm \
    zlib1g-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --ignore-engines

COPY . .

EXPOSE 8080
CMD ["yarn", "start"]