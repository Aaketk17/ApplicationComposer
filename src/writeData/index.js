const AWS = require('aws-sdk')
const {DateTime} = require('luxon')
const documentClient = new AWS.DynamoDB.DocumentClient({
  region: 'us-east-2',
})

module.exports.handler = (event, context, callback) => {
  const receivedPayload = JSON.parse(event['body'])
  console.log(
    '\n\n',
    'Received Payload: ',
    receivedPayload,
    '\n\n',
    'Table Name: ',
    process.env.TABLE_NAME
  )
  if (event.body === null) {
    const response = {
      statusCode: 500,
      body: JSON.stringify({
        message: 'No data provided to write to database',
      }),
    }
    callback(null, response)
  }

  try {
    const params = {
      TableName: process.env.TABLE_NAME,
      Item: {
        id: `${DateTime.now().valueOf()}-${receivedPayload.Name}`,
        ...receivedPayload,
      },
    }
    console.log('DB params :', params)
    documentClient.put(params, (error, data) => {
      if (error) {
        console.log('Error in writing data to DB: ', error)
        const response = {
          statusCode: 500,
          body: JSON.stringify({
            Message: 'Error in writing data to DB',
            Error: error,
          }),
        }
        callback(null, response)
      }
      console.log('Data successfully written to DB: ', data)
      const response = {
        statusCode: 200,
        body: JSON.stringify({
          Message: 'Data successfully written to DB',
          Error: null,
        }),
      }
      callback(null, response)
    })
  } catch (error) {
    console.log('Error in Writing to DB :(', error)
    const response = {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error in Writing to DB :(',
        error: error,
      }),
    }
    callback(null, response)
  }
}
