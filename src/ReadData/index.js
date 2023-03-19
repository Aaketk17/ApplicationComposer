const AWS = require('aws-sdk')
const documentClient = new AWS.DynamoDB.DocumentClient({
  region: 'us-east-2',
})

module.exports.handler = async (event, context, callback) => {
  const receivedPayload = JSON.parse(event['body'])
  console.log(
    '\n\n',
    'Received Payload: ',
    receivedPayload,
    '\n\n',
    'Table Name: ',
    process.env.TABLE_NAME
  )
  let params = {
    TableName: process.env.TABLE_NAME,
  }

  let dbData = []
  let results
  try {
    do {
      results = await documentClient.scan(params).promise()
      console.log('Results from Scan :-', results)

      results.Items.forEach((value) => dbData.push(value))
      params.ExclusiveStartKey = results.LastEvaluatedKey
    } while (typeof results.LastEvaluatedKey !== 'undefined')

    console.log('All data from DB', dbData)

    const response = {
      statusCode: 200,
      body: JSON.stringify({
        Message: 'Data received from DynamoDB',
        TotalDataCount: dbData.length,
        Data: dbData,
      }),
    }

    callback(null, response)
  } catch (error) {
    console.log('Error in reading data from DB ', error)
    const response = {
      statusCode: 500,
      body: JSON.stringify({
        Message: 'Error in reading data from DB',
        Error: error,
      }),
    }
    callback(null, response)
  }
}
