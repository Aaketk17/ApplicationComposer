exports.handler = async event => {
  // Log the event argument for debugging and for use in local development.
  console.log(JSON.stringify(event, undefined, 2));

  return {
    statusCode: 500,
    body: JSON.stringify({
      message: 'Error Updating to DynamoDB',
    }),
  };
};
