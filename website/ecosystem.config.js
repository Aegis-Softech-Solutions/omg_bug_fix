module.exports = {
  apps: [{
    name: "website",
    script: "node_modules/.bin/next",
    args: "start",
    cwd: "/home/bitnami/omg_company/website",
    autorestart: true,
    env: {
      NODE_ENV: "production",
      PORT: 3000
    }
  }]
}
