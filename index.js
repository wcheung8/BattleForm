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

dynamo.createTable(params, function(err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});

/**
 * Provide an event that contains the following keys:
 *
 *   - operation: one of the operations in the switch statement below
 *   - tableName: required for operations that interact with DynamoDB
 *   - payload: a parameter to pass to the operation being performed
 */
exports.handler = (event, context, callback) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));

    const operation = event.operation;
    var payload = event.payload;
    
    if (operation != "echo")
        payload.TableName = "Feedback";

    switch (operation) {
        
        case 'insert':
            dynamo.putItem(payload, callback);
            break;
        case 'read':
            dynamo.getItem(payload, callback);
            break;
        case 'update':
            dynamo.updateItem(payload, callback);
            break;
        case 'delete':
            dynamo.deleteItem(payload, callback);
            break;
        case 'list':
            dynamo.scan(payload, callback);
            break;
        case 'echo':
            callback(null, payload);
        default:
            callback(new Error(`Unrecognized operation "${operation}"`));
    }
};
