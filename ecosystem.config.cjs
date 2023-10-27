module.exports = {
  apps: [{
      name: "Yuuko Production",
      script: "./src/app.ts",
      max_memory_restart: "812M",
      watch: ["commit.hash"],
      interpreter: "/usr/bin/bun",
      env_production: {
          NODE_ENV: "production"
      },
      env_development: {
          NODE_ENV: "development"
      }
  }]
}