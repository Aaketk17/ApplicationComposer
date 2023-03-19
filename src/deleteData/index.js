const AWS = require('aws-sdk')
const documentClient = new AWS.DynamoDB.DocumentClient({
  region: 'us-east-2',
})

module.exports.handler = async (event, context, callback) => {
  const receivedPayload = event['pathParameters']
  console.log(
    '\n\n',
    'Received Payload: ',
    receivedPayload,
    '\n\n',
    event,
    'Table Name: ',
    process.env.TABLE_NAME
  )
  try {
    const params = {
      TableName: process.env.TABLE_NAME,
      Key: {
        id: receivedPayload.id,
      },
    }
    const deletedResult = await documentClient.delete(params).promise()
    const response = {
      statusCode: 200,
      body: JSON.stringify({
        Message: `Data with Id ${receivedPayload.id} successfully deleted`,
      }),
    }
    console.log('Deletion Success :-', deletedResult)
    callback(null, response)
  } catch (error) {
    console.log('Error in deleting given data from DB ', error)
    const response = {
      statusCode: 500,
      body: JSON.stringify({
        Message: 'Error in deleting given data from DB',
        Error: error,
      }),
    }
    callback(null, response)
  }
}
