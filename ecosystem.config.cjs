module.exports = {
  apps: [{
      name: "Yuuko Production",
      script: ".",
      max_memory_restart: "812M",
      watch: ["commit.hash"],
      interpreter: "/usr/bin/bun",
      env_production: {
          NODE_ENV: "production"
      },
      env_development: {
          NODE_ENV: "development"
      },
      interpreter_args: "run start:prod"
  }, {
    name: "Yuuko Production API",
    script: "./src/api.ts",
    max_memory_restart: "512M",
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