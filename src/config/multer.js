const multer = require('multer')
const path = require('path')
const crypto = require('crypto')
const aws = require('aws-sdk')
const multerS3 = require('multer-s3')

const setFilename = (req, file, cb) => crypto.randomBytes(16, (err, hash) => {
  if (err) cb(err)
  file.key = `${hash.toString('hex')}-${file.originalname}`  
  cb(null, file.key)
})

const storageTypes = {
  local: multer.diskStorage({
      destination: (req, file, cb) => cb(null, path.resolve(__dirname, '..', '..', 'tmp', 'uploads')),
      filename: setFilename
    }),
    limits: {
      fileSize: 2 *  1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
      const allowedMimes = [
        'image/jpeg',
        'image/pjpeg',
        'image/png',
        'image/gif',
        'image/svg'
      ]

      if (allowedMimes.includes(file.mimetype)) {
        cb(null, true)
      } else {
        cb(new Error('Invalid file type.'))
      }
    },
  s3: multerS3({
    s3: new aws.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }),
    bucket: 'cdn.srvempari.com.br',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read',
    key: setFilename
  })
}

module.exports = {
  dest: path.resolve(__dirname, '..', '..', 'tmp', 'uploads'),
  storage: storageTypes['s3']
}