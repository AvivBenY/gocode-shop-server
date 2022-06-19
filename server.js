import fsp from 'fs/promises'
import http from 'http'


function readFiles() {
    fsp.readFile('./translation.jsonasdasd', "utf8")
    .then(json => {
        fsp.readFile("./en.txtttt", "utf8").then(en =>{
            const toJson = JSON.parse(json);
            console.log("en",en);          

            const jsonWord = toJson.filter(word => word.en === en)
            writeFiles("./heb", JSON.stringify(jsonWord[0].heb))          
        }).catch(err => 
            console.log("Error:", err))
    })
    .catch(err => console.log("Error:", err))
}

function writeFiles(file, data) {
    fsp.writeFile(`${file}`, `${data}`)
}

// Create HTTP server and listen on port 8000 for requests
http.createServer((request, response) => {
    readFiles();
    response.writeHead(200, {'Content-Type': 'application/json'});
    // Send the response body "Hello World"
    response.end("success");
 }).listen(8000);
 // Print URL for accessing server
 console.log('Server running at http://127.0.0.1:8000/');

