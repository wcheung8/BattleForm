'use strict';

console.log('Loading function');

const doc = require('dynamodb-doc');

const dynamo = new doc.DynamoDB();

var params = {
    TableName : "Feedback",
    KeySchema: [       
        { AttributeName: "MESSAGE_ID", KeyType: "HASH"},  //Partition key
    ],
    AttributeDefinitions: [
        { AttributeName: "MESSAGE_ID", AttributeType: "N" },
    ],
    ProvisionedThroughput: {       
        ReadCapacityUnits: 10, 
        WriteCapacityUnits: 10
    }
};

/*dynamo.createTable(params, function(err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});*/

/**
 * Provide an event that contains the following keys:
 *
 *   - operation: one of the operations in the switch statement below
 *   - tableName: required for operations that interact with DynamoDB
 *   - payload: a parameter to pass to the operation being performed
 */
exports.handler = (event, context, callback) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));
    var responseBody = {
    };
	
    const operation = event.TYPE;
    var payload = {};
    
    switch (operation) {
        
        case 'insert':
            payload.TableName = "Feedback";
            var d = new Date();
            var item = {
              "MESSAGE_ID": 4321,
              "USER_ID": event.USER_ID,
              "EMOJI": event.EMOJI
            }
			payload.Item = item;
            dynamo.putItem(payload, null);
            break;
        case 'list':
            payload.TableName = "Feedback";
            dynamo.scan(payload, callback);
            break;
        case 'echo':
            responseBody.response = payload;
    }

	var response = {
        "statusCode": 200,
        "headers": {
            "operation": operation
        },
        "body": JSON.stringify(responseBody),
        "isBase64Encoded": false
    };
	callback(null, response)
	
};
