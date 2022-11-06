const path = require('path');
const { v4: uuidv4 } = require('uuid');

const uploadFile = (files, allowedExtensions = ['jpg', 'jpeg', 'png'], folder = '') => {

    return new Promise((resolve, reject) => {

        const { file } = files;
        const splitName = file.name.split('.');
        const extension = splitName[splitName.length - 1];

        if (!allowedExtensions.includes(extension)) {
            return reject(`File extension ${extension} is not allowed, allowed extensions: ${allowedExtensions}`);
        }

        fileUuid = uuidv4() + '.' + extension;

        uploadPath = path.join(__dirname, '../uploads/', folder, fileUuid);

        file.mv(uploadPath, (err) => {
            if (err) {
                return reject(err);
            }

            resolve(fileUuid);
        });
    });
}

module.exports = {
    uploadFile
}
