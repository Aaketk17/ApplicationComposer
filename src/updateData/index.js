const AWS = require('aws-sdk')
const documentClient = new AWS.DynamoDB.DocumentClient({
  region: 'us-east-2',
})

module.exports.handler = async (event, context, callback) => {
  const receivedPayload = JSON.parse(event['body'])
  const updateId = event.pathParameters.id

  console.log(
    '\n\n',
    'Received Payload: ',
    receivedPayload,
    '\n\n',
    'Table Name: ',
    process.env.TABLE_NAME
  )
  if (receivedPayload === null) {
    const response = {
      statusCode: 404,
      body: JSON.stringify({
        Message: `Updating Data with Id ${updateId} is missing parameters`,
      }),
    }
    callback(null, response)
  }
  try {
    const params = {
      TableName: process.env.TABLE_NAME,
      Key: {
        id: updateId,
      },
      UpdateExpression:
        'set #name = :name, #age = :age, #city = :city, #gender = :gender',
      ExpressionAttributeNames: {
        '#name': 'Name',
        '#age': 'Age',
        '#city': 'City',
        '#gender': 'Gender',
      },
      ExpressionAttributeValues: {
        ':name': receivedPayload.Name,
        ':age': receivedPayload.Age,
        ':city': receivedPayload.City,
        ':gender': receivedPayload.Gender,
      },
      ReturnValues: 'UPDATED_NEW',
    }
    const updatedResults = await documentClient.update(params).promise()
    const response = {
      statusCode: 200,
      body: JSON.stringify({
        Message: `Data with Id ${updateId} successfully Updated with the new given values`,
        Results: updatedResults,
      }),
    }
    console.log('Updated Results :-', updatedResults)
    callback(null, response)
  } catch (error) {
    console.log('Error in updating given data ', error)
    const response = {
      statusCode: 500,
      body: JSON.stringify({
        Message: 'Error in updating given data',
        Error: error,
      }),
    }
    callback(null, response)
  }
}
