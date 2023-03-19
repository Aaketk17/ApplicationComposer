const AWS = require('aws-sdk')
const https = require('https')
const s3 = new AWS.S3()

module.exports.handler = async (event, context, callback) => {
  const receivedPayload = JSON.parse(event['body'])
  console.log(
    '\n\n',
    'Received Payload: ',
    receivedPayload,
    '\n\n',
    'Bucket Name: ',
    process.env.BUCKET_NAME
  )
  try {
    if (event.body === null) {
      const response = {
        statusCode: 500,
        body: JSON.stringify({
          message: 'File name not provided to download',
        }),
      }
      callback(null, response)
    }

    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: receivedPayload.fileName,
      Expires: 1800,
      ResponseContentDisposition: 'attachment',
    }

    const signedUrl = await s3.getSignedUrl('getObject', params)
    console.log('signedURL', signedUrl)
    const response = {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        Message: `SignedURL to download ${receivedPayload.fileName}`,
        URL: signedUrl,
      }),
    }
    callback(null, response)
  } catch (error) {
    console.log('Error in generating signed URL ', error)
    const response = {
      statusCode: 500,
      body: JSON.stringify({
        Message: 'Error in generating signed URL',
        Error: error,
      }),
    }
    callback(null, response)
  }
}
