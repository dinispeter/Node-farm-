const fs = require("fs");
const http = require("http");
const url = require("url");
const replaceTemplate = require("./modules/replaceTemplate")
const slugify = require("slugify");

////////// SERVER ///////
// top-code spustí sa len raz 
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, "utf-8");
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, "utf-8");
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, "utf-8");
const page404 = fs.readFileSync(`${__dirname}/templates/template-404.html`, "utf-8");

const dataObj = JSON.parse(data);

// testing slugify
const slugs = dataObj.map(el => slugify(el.productName, {lower: true}))
console.log(slugs);
// vytvorili sme to že každý náš product má jedinečnú koncovku

const server = http.createServer((req, res) => {
    const {query, pathname} = url.parse(req.url, true);
    

    if(pathname === "/" || pathname === "/overview") {
        res.writeHead(200, {"Content-type": "text/html"});

        // hlavná stránka
        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join("");
        const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml)
        res.end(output);

    } else if (pathname === "/product") {
        const product = dataObj[query.id]; // z dat objektu chceme  pozíciu elementu z query id
        res.writeHead(200, {"Content-type": "text/html"});
        const output = replaceTemplate(tempProduct, product);
        res.end(output);
    } else if (pathname === "/api") {
        // reading a file
        res.writeHead(200, {"Content-type": "application/json"});
        res.end(data);
    }
    else {
        res.writeHead(404, {
            // here we are writing http header
            "Content-type": "text/html", // späť nám navráti html
            "my-own-header": "This is a testing header"
        });
        // Status code musí byť definovaní pred response
        res.end(page404) // a akonáhle dáme html musíme navrátiť html
    }
})

server.listen(7000, "127.0.0.1", () => {
    console.log("Server is running on port 7000");
});