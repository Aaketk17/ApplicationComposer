const AWS = require('aws-sdk')
const documentClient = new AWS.DynamoDB.DocumentClient({
  region: 'us-east-2',
})

module.exports.handler = (event, context, callback) => {
  console.log(
    '\n\n',
    'Received Object: ',
    event,
    '\n\n',
    'Table Name: ',
    process.env.TABLE_NAME
  )
  if (event.body === null) {
    console.log(typeof event)
    const response = {
      statusCode: 500,
      body: JSON.stringify({
        message: 'No data given to write to database',
      }),
    }
    callback(null, response)
  }
  const params = {
    TableName: process.env.TABLE_NAME,
    Item: {
      id: event.body.id.toString(),
      ...event.body,
    },
  }
  console.log(params)
  try {
    documentClient.put(JSON.parse(JSON.stringify(params)), (error, data) => {
      if (error) {
        console.log('Error in writing data to DB: ', error)
        const response = {
          statusCode: 500,
          body: JSON.stringify({
            message: 'Error in writing data to DB',
            error: error,
          }),
        }
        callback(null, response)
      }
      console.log('Data successfully written to DB: ', data)
      const response = {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Data successfully written to DB',
          error: null,
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
