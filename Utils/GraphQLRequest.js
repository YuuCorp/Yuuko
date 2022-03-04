const axios = require("axios");

module.exports = function(query, vars, url = process.env.ANILIST_API || "https://graphql.anilist.co") {
    return new Promise((resolve, reject) => {
        axios.post(url, {
            query,
            variables: vars
        }).then(res => {
            resolve(res.data.data, res.headers);
        }).catch(err => {
            reject("GraphQL Request Rejected\n\n" + err?.response?.data?.errors.map(e => `> ${e.message}\n`) || err);
        });
    });
}