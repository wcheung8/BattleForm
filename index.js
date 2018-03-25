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
    
    var payload = [];
    var operation;
    if (event.body !== null && event.body !== undefined) {
        let body = JSON.parse(event.body)
        if (body.payload) {
            payload = body.payload;
        } 
        if (body.operation) {
            operation = body.operation;
        }
        
        
    }
    
    
    
    var responseBody = {
    };
    
    switch (operation) {
        
        case 'insert':
            var params = []
            params.TableName = "Feedback";
            var d = new Date();
            var item = {
              "MESSAGE_ID": payload.MESSAGE_ID,
              "USER_ID": payload.USER_ID,
              "EMOJI": payload.EMOJI,
              "TS_CREATED": String(d)
            }
			params.Item = item;
			
            dynamo.putItem(params, function(err, data) {
            if (err) {
                console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("Added item:", JSON.stringify(data, null, 2));
            }});
            break;
        case 'list':
            payload.TableName = "Feedback";
            dynamo.scan(payload, callback);
            return;
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
