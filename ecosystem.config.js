module.exports = {
  apps: [
    {
      name: "Yuuko Production",
      script: "app.js",
      max_memory_restart: "812M",
      watch: ["commit.hash"],
      env_production: {
        NODE_ENV: "production",
      },
      env_development: {
        NODE_ENV: "development",
      },
    },
  ],
};
