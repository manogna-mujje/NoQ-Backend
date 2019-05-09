const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');

aws.config.update({
    accessKeyId :'AWS_KEY',
    secretAccessKey : 'SECRET_KEY',
    region : 'region',
    
})

const s3 = new aws.S3({    
    sslEnabled: false,
});

const upload = multer({
    storage: multerS3({
      s3: s3,
      acl: 'public-read',
      bucket: 'namcanvas/noqImages',
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: function (req, file, cb) {
        cb(null, Date.now().toString())
      }
    })
  })

module.exports = upload;