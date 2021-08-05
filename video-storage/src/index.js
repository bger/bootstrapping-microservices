const express = require('express');
const azure = require('azure-storage');

const app = express();
const PORT = process.env.PORT || 3000
const STORAGE_ACCOUNT_NAME = process.env.STORAGE_ACCOUNT_NAME || 'bgerreg'
const STORAGE_ACCESS_KEY = process.env.STORAGE_ACCESS_KEY || 'cZG0QKB2fUC+R6DPSgY2nWsvBougUsej3b4Pki9UaKsYixAWPW9GG03bq3yiNv3WCVDZj5E8VN3y3uNdi8bB0A=='


function createBlobService() {
  const blobService = azure.createBlobService(STORAGE_ACCOUNT_NAME, STORAGE_ACCESS_KEY);
  return blobService;
}

app.get('/video', (req, res) => {
  const videoPath = req.query.path;
  const blobService = createBlobService();
  const containerName = 'videos';

  blobService.getBlobProperties(containerName, videoPath, (err, properties)=>{
    if (err) {
      res.sendStatus(500);
      return;
    }

    res.writeHead(200, {
      "Content-Type": "video/mp4",
      "Content-Length" : properties.contentLength,
    });

    blobService.getBlobToStream(containerName, videoPath, res, err => {
      if (err) {
        res.sendStatus(500)
        return;
      }
    })
  })
})


app.listen(PORT, ()=>{
  console.log("Microservice video storage is now online")
})
