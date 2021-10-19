const http = require("http");
require("dotenv").config();
const url = require("url");
const PORT = process.env.PORT || 3000;
const fs = require("fs");
const baseUrl = "/api/downloads/";
const archiver = require('archiver');
// localhost:3000/api/downloads/prikolnye-kartinki.ru/img/picture/Oct/08/81c41cca31756877c9a3ed12a9fdc77d/1.jpg

const server = http.createServer((request, response) => {
  const urlParse = url.parse(request.url, true);
  if (urlParse.pathname.startsWith(baseUrl) && request.method === "GET") {
   let downloadUrl = "http://" + urlParse.pathname.substring(baseUrl.length);
   let fileName = downloadUrl.split("/").slice(-1).toString();
   let writeStream = fs.createWriteStream(getUserHome() + "\\Downloads\\" + fileName );
   let writeStreamZip = fs.createWriteStream(getUserHome() + "\\Downloads\\apiDownloadNJS.zip");
   let archive = archiver('zip', {
      zlib: { level: 9 }
   })
       const request = http.get(downloadUrl, function(imageResponse) {
         imageResponse.pipe(writeStream);
        archive.pipe(writeStreamZip);
        //  archive.append(imageResponse, { name: 'apiDownloadNJS.jpg' });
        archive.append(fs.createReadStream(getUserHome() + "\\Downloads\\" + fileName), { name: fileName });
        archive.finalize();
         
   });
  
  writeStreamZip.on('close', function() {
  console.log(archive.pointer() + ' total bytes');
  console.log('archiver has been finalized and the output file descriptor has closed.');
  });

 writeStreamZip.on('end', function() {
  console.log('Image has been saved');
 });
   
   response.statusCode = 201;
     response.end();
  }
});

server.listen(PORT, (error) => {
  if (error) return console.log(`Error: ${error}`);
  console.log(`Server started on :${PORT}`);
});

function getUserHome() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}