const axios = require("axios");

module.exports = function (query, vars, token, url = process.env.ANILIST_API || "https://graphql.anilist.co") {
    if (token?.length > 1000) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
    return new Promise((resolve, reject) => {
        axios.post(url, {
            query,
            variables: vars
        }).then(res => {
            resolve(res.data.data, res.headers);
        }).catch(err => {
            console.error(err);
            reject("GraphQL Request Rejected\n\n" + err?.response?.data?.errors?.map(e => `> ${e.message}\n`) || err);
        });
    });
}