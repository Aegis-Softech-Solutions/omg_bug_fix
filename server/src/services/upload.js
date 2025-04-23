import fs from 'fs';
import { UserInputError } from 'apollo-server';

const uploadFolderPath = process.env.PUBLIC_FOLDER_PATH;
const uploadFolderName = process.env.UPLOAD_FOLDER_NAME;
const domainName = process.env.DOMAIN_NAME;
const uploadBaseFolderPath = uploadFolderPath + uploadFolderName;
// const BaseUrl = domainName + uploadFolderName;
const BaseUrl = '' + uploadFolderName;
const imageFileExtentions = ['png', 'PNG', 'jpg', 'JPG', 'jpeg', 'JPEG', 'gif', 'GIF'];
const videoFileExtensions = ['mp4', 'mkv', 'webm', 'mov'];

// Check if base folder is present. If not, create one.
const CheckBaseFolder = () => {
  if (fs.existsSync(uploadFolderPath)) {
    if (!fs.existsSync(uploadBaseFolderPath)) fs.mkdirSync(uploadBaseFolderPath);
    return true;
  }
  return false;
};

// Check if upload folder is present within the base folder. If not, create one.
const CheckUploadFolder = async (folderName) => {
  if (await CheckBaseFolder()) {
    var folderPath = uploadBaseFolderPath + '/' + folderName;
    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);
    return true;
  }
  return false;
};

const saveUpload = ({ stream, filename, uploadLocationFolderPath }) => {
  return new Promise((resolve, reject) =>
    stream
      .on('error', (err) => {
        throw new UserInputError(' Please try again.');
        reject(err);
      })
      .pipe(fs.createWriteStream(uploadBaseFolderPath + '/' + uploadLocationFolderPath + '/' + filename))
      .on('error', (err) => {
        throw new UserInputError(' Please try again.');
        reject(err);
      })
      .on('finish', () => {
        resolve();
      })
      .on('error', (err) => {
        throw new UserInputError(' Please try again.');
        reject(err);
      })
  );
};

const UploadFile = async (
  filename,
  stream,
  uploadLocationFolderPath = '',
  keepOriginalFileName = false,
  appendSlug = null
) => {
  //initialize the file information to send back.
  var fileInfo = {
    success: false,
    filename: '',
  };

  //check if the uploadLocationFolderPath is present.
  if (uploadLocationFolderPath) {
    if (await CheckUploadFolder(uploadLocationFolderPath)) {
      //set the fileExtention.
      let splitString = String(filename).split('.');
      const fileExtention = splitString.pop();
      const randomNumber = Math.floor(Math.random() * 100000);

      var filename = appendSlug
        ? `${appendSlug}-${new Date().getTime()}${randomNumber}.${fileExtention}`
        : keepOriginalFileName
        ? `${splitString.join()}${randomNumber}.${fileExtention}`
        : new Date().getTime() + randomNumber + '.' + fileExtention;

      filename = filename.replace(/\s/g, '');

      var saveFileStatus = await saveUpload({
        stream,
        filename,
        uploadLocationFolderPath,
      });

      fileInfo.success = true;
      fileInfo.filename = filename;
    }
  }

  return fileInfo;
};

const CheckFileExtention = async (filename, { image = false, video = false, allMedia = false }) => {
  const fileExtention = String(filename).split('.').pop().toLowerCase();
  if (image) {
    if (imageFileExtentions.includes(fileExtention)) return true;
  }
  if (video) {
    if (videoFileExtensions.includes(fileExtention)) return true;
  }
  if (allMedia) {
    const allFileExtensions = [...imageFileExtentions, ...videoFileExtensions];
    if (allFileExtensions.includes(fileExtention)) return true;
  }
  return false;
};

const UnlinkFile = async (filename, uploadLocationFolderPath) => {
  //check if the uploadLocationFolderPath is present.
  if (uploadLocationFolderPath && String(uploadLocationFolderPath).length > 0) {
    //check if fileName is Passed.
    if (filename && String(filename).length > 0) {
      fs.unlinkSync(uploadBaseFolderPath + '/' + uploadLocationFolderPath + '/' + filename);
    }
  }
  return true;
};

const UploadAndSetData = async ({
  file,
  variable,
  deleteVariable = [],
  currentObject = {},
  uploadFolder,
  keepOriginalFileName = false,
  isVideo = false,
  isAllMedia = false,
  userInputError = '',
  appendSlug = null,
}) => {
  if (typeof file === 'object' && file !== null) {
    const { createReadStream, filename } = await file;
    const stream = createReadStream();

    if (
      await CheckFileExtention(filename, {
        image: isVideo ? false : true,
        video: isVideo ? true : false,
        allMedia: isAllMedia ? true : false,
      })
    ) {
      let uploadData = await UploadFile(filename, stream, uploadFolder, keepOriginalFileName, appendSlug);
      if (uploadData.success) currentObject[variable] = uploadData.filename;
      stream.resume();
    } else {
      //unlink all other uploaded images.
      if (deleteVariable.length > 0) {
        await deleteVariable.map(async (variableName) => {
          if (
            variableName in currentObject &&
            currentObject[variableName] &&
            String(currentObject[variableName]).length > 0
          ) {
            UnlinkFile(currentObject[variableName], uploadFolder);
          }
        });
      }
      throw new UserInputError(
        userInputError ? userInputError : `The uploaded ${isVideo ? 'video' : 'image'} format isn't supported.`
      );
    }
  } else {
    return { file: file ? file : null };
  }

  return currentObject;
};

export {
  //string.
  //used to set the image base path.
  BaseUrl,
  CheckBaseFolder,
  CheckUploadFolder,
  UploadFile,
  CheckFileExtention,
  UnlinkFile,
  UploadAndSetData,
};
