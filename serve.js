//
// This script will run a local development server. This is useful when
// developing the theme.
//
// Usage:
// `node serve`
//

var http = require("http");
//var resume = require("resume-schema").resumeJson;
var resume = require("./resume.json");
var theme = require("./index.js");
var path = require("path");
var fs = require("fs");

//var port = 8888;
var port = process.env.OPENSHIFT_NODEJS_PORT;
var ip = process.env.OPENSHIFT_NODEJS_IP;

http.createServer(function(req, res) {
    var picture = resume.basics.picture.replace(/^\//, "");
    if (picture && req.url.replace(/^\//, "") === picture.replace(/^.\//, "")) {
        var format = path.extname(picture);
        try {
            var image = fs.readFileSync(picture);
            res.writeHead(200, {
                "Content-Type": "image/" + format
            });
            res.end(image, "binary");
        } catch (error) {
            if (error.code === "ENOENT") {
                console.log("Picture not found !");
                res.end();
            } else {
                throw error;
            }
        }
    } else {
        res.writeHead(200, {
            "Content-Type": "text/html"
        });
        res.end(render());
    }
}).listen(port, ip);

console.log("Preview: http://localhost:8888/");
console.log("Serving..");

function render() {
    try {
        return theme.render(JSON.parse(JSON.stringify(resume)));
    } catch (e) {
        console.log(e.message);
        return "";
    }
}
