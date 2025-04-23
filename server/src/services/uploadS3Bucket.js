import fs from 'fs';
import { UserInputError } from 'apollo-server';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import imagemin from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
// import imageminJpegtran from 'imagemin-jpegtran';
import imageminPngquant from 'imagemin-pngquant';
// import imageminOptipng from 'imagemin-optipng';

// Create an Amazon S3 service client object.
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const imageExtentions = ['png', 'PNG', 'jpg', 'JPG', 'jpeg', 'JPEG', 'gif', 'GIF'];
const videoExtensions = ['mp4', 'mkv', 'webm', 'mov'];
const documentExtensions = ['pdf', 'docx', 'doc', 'csv', 'xlsx'];

const saveUpload = async ({ stream, filename, uploadFolder, isPdf, isVideo, allExtensions }) => {
  // ---- DISPLAYING A LIST OF AMAZON S3 BUCKETS ----
  // try {
  //   const data = await s3Client.send(new ListBucketsCommand({}));
  //   console.log('Success', data.Buckets);
  // } catch (err) {
  //   console.log('Error', err);
  // }

  // ---- CREATE AN AMAZON S3 BUCKET ----
  // try {
  //   const data = await s3Client.send(new CreateBucketCommand({ Bucket: params.Bucket }));
  //   console.log(data);
  //   console.log('Successfully created a bucket called ', data.Location);
  // } catch (err) {
  //   console.log('Error --> ', err);
  // }

  let chunks = [];
  for await (let chunk of stream) {
    chunks.push(chunk);
  }
  let fileBuffer = Buffer.concat(chunks);

  const writeStreamPath = uploadFolder + '/' + filename;

  if (!isPdf && !isVideo && !allExtensions) {
    fileBuffer = await imagemin.buffer(fileBuffer, {
      plugins: [imageminMozjpeg({ quality: 80 }), imageminPngquant({ quality: [0.7, 0.9] })],
      // plugins: [imageminJpegtran({ progressive: true }), imageminOptipng()],
    });
  }

  // Set the parameters
  const params = {
    Bucket: process.env.AWS_S3_BUCKET, // The name of the bucket. For example, 'sample_bucket_101'.
    Key: writeStreamPath, // The name of the object, along with the upload folder. For example, 'images/sample_upload.txt'.
    Body: fileBuffer,
    ACL: 'public-read', // private | public-read | public-read-write | authenticated-read | aws-exec-read | bucket-owner-read | bucket-owner-full-control
  };

  // Upload it to the Amazon S3 bucket.
  try {
    await s3Client.send(new PutObjectCommand(params));
    console.log('Successfully uploaded ' + filename + ' to ' + params.Bucket + '/' + params.Key);
    return true;
  } catch (err) {
    console.log('Error while uploading to the Amazon S3 bucket: ', err);
    throw new UserInputError(' Please try again.');
  }
};

const UploadFile = async (
  filename,
  stream,
  uploadFolder = '',
  keepOriginalFileName = false,
  prependSlug = null,
  isPdf = false,
  isVideo = false,
  allExtensions = false
) => {
  //initialize the file information to send back.
  var fileInfo = { success: false, filename: '' };

  // check if the uploadFolder is present.
  if (uploadFolder) {
    // set the fileExtention
    let splitString = String(filename).split('.');
    const fileExtention = splitString.pop();
    const randomNumber = Math.floor(Math.random() * 100000);

    var filename = '';
    if (prependSlug) filename = prependSlug + '-';

    filename += isPdf
      ? `${splitString.join()}.${fileExtention}`
      : keepOriginalFileName
      ? `${splitString.join()}${randomNumber}.${fileExtention}`
      : new Date().getTime() + randomNumber + '.' + fileExtention;

    filename = filename.replace(/\s/g, '-');

    await saveUpload({ stream, filename, uploadFolder, isPdf, isVideo, allExtensions });

    fileInfo.success = true;
    fileInfo.filename = filename;
  }

  return fileInfo;
};

const CheckFileExtention = async (filename, { image = false, video = false, allMedia = false, doc = false }) => {
  const fileExtention = String(filename).split('.').pop().toLowerCase();
  if (image) {
    if (imageExtentions.includes(fileExtention)) return true;
  }
  if (video) {
    if (videoExtensions.includes(fileExtention)) return true;
  }
  if (allMedia) {
    const allFileExtensions = [...imageExtentions, ...videoExtensions];
    if (allFileExtensions.includes(fileExtention)) return true;
  }
  if (doc) {
    if (documentExtensions.includes(fileExtention)) return true;
  }
  return false;
};

const UnlinkFile = async (filename, folderName) => {
  // Set the parameters
  const params = {
    Bucket: process.env.AWS_S3_BUCKET, // The name of the bucket. For example, 'sample_bucket_101'.
    Key: `${folderName}/${filename}`, // The name of the object, along with the upload folder. For example, 'images/sample_upload.txt'.
  };

  // Delete from the Amazon S3 bucket.
  try {
    await s3Client.send(new DeleteObjectCommand(params));
    console.log('Successfully deleted ', `${folderName}/${filename}`);
    return true;
  } catch (err) {
    console.log(`Error while deleting "${folderName}/${filename}" from the Amazon S3 bucket: ${err}`);
    throw new UserInputError(' Please try again.');
  }
};

const UploadAndSetData = async ({
  file,
  variable,
  currentObject = {},
  uploadFolder,
  keepOriginalFileName = false,
  isVideo = false,
  isAllMedia = false,
  allowAllExtensions = false,
  userInputError = '',
  prependSlug = null,
  isPdf = false,
}) => {
  if (typeof file === 'object' && file !== null) {
    const { createReadStream, filename } = await file;
    const stream = createReadStream();

    if (
      allowAllExtensions ||
      (!allowAllExtensions &&
        (await CheckFileExtention(filename, {
          image: isVideo ? false : true,
          video: isVideo || false,
          allMedia: isAllMedia || false,
          doc: isPdf || false,
        })))
    ) {
      // prettier-ignore
      let uploadData = await UploadFile(filename, stream, uploadFolder, keepOriginalFileName, prependSlug, isPdf, isVideo, allowAllExtensions);
      if (uploadData.success)
        currentObject = {
          ...currentObject,
          [variable]: uploadData.filename,
        };
      stream.resume();
    } else
      throw new UserInputError(
        userInputError
          ? userInputError
          : `The uploaded ${isPdf ? 'document' : isVideo ? 'video' : 'image'} format isn't supported.`
      );
  } else {
    return { file: file ? file : null };
  }

  return currentObject;
};

export { UploadFile, CheckFileExtention, UnlinkFile, UploadAndSetData };
