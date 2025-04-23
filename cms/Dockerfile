# Use Node.js 20 on AMD64 platform
FROM node:20

# Install build dependencies
RUN apt-get update && apt-get install -y \
  libcairo2-dev \
  libpango1.0-dev \
  libjpeg-dev \
  libgif-dev \
  librsvg2-dev \
  python3 \
  build-essential \
  && ln -sf /usr/bin/python3 /usr/bin/python \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json ./
RUN yarn install

COPY . .
ENV NODE_OPTIONS="--openssl-legacy-provider"
# RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]