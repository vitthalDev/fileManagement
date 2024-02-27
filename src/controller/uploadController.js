const uploadStorage = require("../services/fileHandler");
const path = require("path");
const util = require("../utils/util")
const fs = require("fs");

exports.uploadSingleFile = (req, res) => {
  if (req.file) {
    util.logger(req.file);
    util.logToFile({
      "action": "Uploaded Single File",
      "data": req.file,
      "API": "/upload/single",
      "status": "success"
    })
    res.status(200).json({ message: "File uploaded successfully!" });
  } else {
    util.logToFile({
      "action": "Uploaded Single File",
      "data": req.file,
      "API": "/upload/single",
      "status": "failure"
    })
    res.status(400).json({ message: "Error while uploading file" });
  }
};

exports.uploadMultipleFiles = (req, res) => {
  if (req.files) {
    util.logger(req.files);
    util.logToFile({
      "action": "Uploaded Multiple Files",
      "data": req.files,
      "API": "/upload/multiple",
      "status": "success"
    })
    res.status(200).send({message: "Multiple files uploaded successfully!"});
  } else {
    util.logToFile({
      "action": "Uploaded Multiple Files",
      "data": req.files,
      "API": "/upload/multiple",
      "status": "failure"
    })
    res.status(400).json({ message: "Error while uploading files" });
  }
};

exports.uploadLarge = (req, res) => {

  try {
    if (!req.headers["content-type"] || !req.headers["content-type"].startsWith("multipart/form-data")) {
      util.logToFile({
        "action": "Uploaded large Files",
        "data": "Invalid Headers",
        "API": "/upload/large",
        "status": "failure"
      })
      return res.status(400).send({message: "Invalid request. File upload expected."});
    }

    let data = "";
    req.setEncoding("binary");
    req.on("data", (chunk) => {
      data += chunk;
    });

    req.on("end", () => {
      const fileNameMatch = data.match(/filename="(.+?)"/);
      if (!fileNameMatch) {
        util.logToFile({
          "action": "Uploaded large Files",
          "data": "Invalid request. Filename not found.",
          "API": "/upload/large",
          "status": "failure"
        })
        return res.status(400).send({message: "Invalid request. Filename not found."});
      }
      const fileName = fileNameMatch[1];

      const filePath = path.join(process.env.UPLOAD_DIRECTORY, Date.now() + "-" + fileName);
      fs.writeFile(filePath, data, "binary", (err) => {
        if (err) {
          console.error("Error while writing file:", err);
          util.logToFile({
            "action": "Uploaded large Files",
            "data": err.message,
            "API": "/upload/large",
            "status": "failure"
          })
          return res.status(500).send({message: "Internal server error"});
        }
        util.logToFile({
          "action": "Uploaded large Files",
          "data": fileName,
          "API": "/upload/large",
          "status": "success"
        })
        res.status(200).send({message: `File uploaded successfully through streaming. File path: ${filePath}`});
      });
    });

    // Error handling
    req.on("error", (err) => {
      util.logger("Error while reading request:", err);
      util.logToFile({
        "action": "Uploaded large Files",
        "data": err.message,
        "API": "/upload/large",
        "status": "failure"
      })
      res.status(500).send({message: "Internal server error"});
    });
  } catch (error) {
    util.logger('Error while handeling file', error)
    util.logToFile({
      "action": "Uploaded large Files",
      "data": error.message,
      "API": "/upload/large",
      "status": "failure"
    })
    res.status(500).json({ message: error.message })
  }
}

exports.deleteFile = (req, res) => {
  if (req.params && req.params.fileName !== undefined) {
    util.logger(req.params.fileName)
    const fileName = req.params.fileName
    const filePath = path.join(process.env.UPLOAD_DIRECTORY || 'uploads', fileName)
    try {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
          util.logToFile({
            "action": "Delete File",
            "data": err.message,
            "API": "delete/:fileName",
            "status": "failure"
          })
          res.status(400).json({ message: err.message });
        } else {
          util.logger("File deleted successfully!");
          util.logToFile({
            "action": "Delete File",
            "data": fileName,
            "API": "delete/:fileName",
            "status": "success"
          })
          res.status(200).json({ message: "File Delted Successfully" });
        }
      });
    } catch (error) {
      util.logger(`Error deleting file: ${fileName}`, error);
      util.logToFile({
        "action": "Delete File",
        "data": error.message,
        "API": "delete/:fileName",
        "status": "failure"
      })
      res.status(500).json({ message: error.message })
    }
  }
}

exports.listFile = async (req, res) => {
  if (req.body) {
    util.logger(req.body.fileName)
    try {
      fs.readdir(process.env.UPLOAD_DIRECTORY || 'uploads', async (err, files) => {
        if (err) {
          util.logger(err)
        }
        const file = files.find(file => file === req.body.fileName);
        if (file && file !== undefined) {
          util.logger(file)
          const filePath = path.join( process.env.UPLOAD_DIRECTORY || 'uploads', file)
          fs.stat(filePath, (err, stats) => {
            if (err) {
              util.logger(err)
            }
            util.logger(stats)
            const response = {
              // Extract desired properties from stats object
              name: file,
              size: stats.size,
              created: stats.ctime,
              isDirectory: stats.isDirectory(),
              isFile: stats.isFile(),
            };
            util.logToFile({
              "action": "List File",
              "data": response,
              "API": "/list",
              "status": "success"
            })
            res.status(200).json(response);
          });
        } else {
          util.logToFile({
            "action": "List File",
            "data": "Unable to fetch file",
            "API": "/list",
            "status": "failure"
          })
          res.status(500).json({ message: "Unable to fetch file" })
        }
      })
    } catch (error) {
      util.logger("Error while file handeling", error)
      util.logToFile({
        "action": "List File",
        "data": error.message,
        "API": "/list",
        "status": "failure"
      })
      res.status(500).json({ message: error.message })
    }
  } else{
    util.logToFile({
      "action": "List File",
      "data": "Invalid Paramerter Supplied",
      "API": "/list",
      "status": "failure"
    })
    res.status(500).json({ message: "Invalid Paramerter Supplied" })
  }
}
