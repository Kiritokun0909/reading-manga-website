const fs = require("fs");
const path = require("path");
const { bucket } = require("../configs/FirebaseConfig"); // Adjust the path as necessary

/**
 * Uploads a file from the local disk to Firebase Storage and deletes it from the disk.
 * @param {Object} file - The file object from the request (e.g., req.file).
 * @param {string} folderName - The destination folder in Firebase Storage.
 * @returns {Promise<string>} - The public URL of the uploaded file.
 */
const uploadFile = async (file, folderName) => {
  const filePath = file.path; // Path to the file on disk
  const fileName = file.filename;
  const mimeType = file.mimetype;
  const firebaseFilePath = `${folderName}/${fileName}`;

  return new Promise((resolve, reject) => {
    const storageFile = bucket.file(firebaseFilePath);
    const blobStream = storageFile.createWriteStream({
      metadata: {
        contentType: mimeType,
      },
    });

    blobStream.on("error", (err) => {
      console.error("Error uploading file:", err);
      reject("Error uploading file");
    });

    blobStream.on("finish", async () => {
      try {
        await storageFile.makePublic(); // Make file publicly accessible
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${storageFile.name}`;

        // Delete the local file after upload
        fs.unlink(filePath, (err) => {
          if (err) console.error("Error deleting local file:", err);
        });

        resolve(publicUrl);
      } catch (error) {
        reject("Error making file public");
      }
    });

    // Read and upload the local file to Firebase Storage
    fs.createReadStream(filePath).pipe(blobStream);
  });
};

module.exports = { uploadFile };
