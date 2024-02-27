const multer = require('multer');
const path = require('path');

class FileService {
  constructor(uploadDir) {
    this.uploadDir = uploadDir;

    // Configure Multer for file uploads
    this.upload = multer({
      dest: this.uploadDir,
      // Define allowed file types (replace with your desired extensions)
      fileFilter: (req, file, cb) => {
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf'];
        const extname = path.extname(file.originalname);
        if (allowedExtensions.includes(extname)) {
          cb(null, true);
        } else {
          cb(new Error('Invalid file type'));
        }
      },
      // Set limits on file size (optional)
      limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
    });
  }

  // Function to upload a single file
  async uploadFile(req, res) {
    try {
      console.log("Uploding file")
      await this.upload.single('file')(req, res, (err) => {
        console.log(req.file)
        if (err) {
          console.log(err, "33")
          return res.status(400).json({ message: err.message });
        }
        // Access uploaded file details from req.file
        return res.status(200).json({ message: 'File uploaded successfully!' });
      });
    } catch (error) {
      console.error(error, "4004");
      return res.status(500).json({ message: 'Server error during upload' });
    }
  }

  // Function to delete a file using Multer
  async deleteFile(fileName) {
    const filePath = path.join(this.uploadDir, fileName);
    try {
      await new Promise((resolve, reject) => {
        req.app.locals.multer.diskStorage.removeFile(filePath, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
      console.log(`File deleted successfully: ${fileName}`);
    } catch (error) {
      console.error(`Error deleting file: ${fileName}`, error);
      // Handle potential errors like file not found or access issues
      return Promise.reject(new Error('Failed to delete file'));
    }
  }

  // Function to retrieve a file using Multer
  async getFile(fileName) {
    const filePath = path.join(this.uploadDir, fileName);
    try {
      const file = await new Promise((resolve, reject) => {
        req.app.locals.multer.diskStorage.getFile(filePath, (err, file) => {
          if (err) {
            reject(err);
          } else {
            resolve(file);
          }
        });
      });
      return file; // Return the file object
    } catch (error) {
      console.error(`Error retrieving file: ${fileName}`, error);
      // Handle potential errors like file not found or access issues
      return Promise.reject(new Error('Failed to retrieve file'));
    }
  }
}

module.exports = FileService;
