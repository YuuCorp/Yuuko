module.exports = {
    apps : [{
        name   : "AniSuggest Production",
        script : "app.js",
        max_memory_restart: "500M",
        watch: ["commit.hash"],
        env_production: {
            NODE_ENV: "production"
        },
        env_development: {
            NODE_ENV: "development"
        }
    }]
}