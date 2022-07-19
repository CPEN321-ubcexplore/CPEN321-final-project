// Source https://itnext.io/hosting-multiple-apps-on-the-same-server-implement-a-reverse-proxy-with-node-a4e213497345
// Dependencies
const express = require("express");

const { createProxyMiddleware } = require("http-proxy-middleware");
var path = require('path');

// Config
const { routes } = require("./reverseproxyconfig.json");

const app = express();

for (route of routes) {
    app.use(route.route,
        createProxyMiddleware({
            target: route.address,
            pathRewrite: (path, req) => {
                return path.split("/").slice(2).join("/"); // Could use replace, but take care of the leading "/"
            }
        })
    );
}

app.listen(80, () => {
    console.log("Proxy listening on port 80");
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname , "index.html"));
});