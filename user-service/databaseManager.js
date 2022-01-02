'use strict';

const TABLE_NAME = process.env.TABLE_NAME;
const AWS = require('aws-sdk');
let dynamo = new AWS.DynamoDB.DocumentClient();

module.exports.initializateDynamoClient = newDynamo => {
	dynamo = newDynamo;
};

module.exports.saveBooking = booking => {
	const params = {
		TableName: TABLE_NAME,
		Item: booking
	};

	return dynamo
		.put(params)
		.promise()
		.then(() => {
			return booking.bookingId;
		});
};

module.exports.getBooking = bookingId => {
	const params = {
		Key: {
			bookingId: bookingId
		},
		TableName: TABLE_NAME
	};

	return dynamo
		.get(params)
		.promise()
		.then(result => {
			return result.Item;
		});
};

module.exports.deleteBooking = bookingId => {
	const params = {
		Key: {
			bookingId: bookingId
		},
		TableName: TABLE_NAME
	};

	return dynamo.delete(params).promise();
};

module.exports.updateBooking = (bookingId, paramsName, paramsValue) => {
	const params = {
		TableName: TABLE_NAME,
		Key: {
			bookingId
		},
		ConditionExpression: 'attribute_exists(bookingId)',
		UpdateExpression: 'set ' + paramsName + ' = :v',
		ExpressionAttributeValues: {
			':v': paramsValue
		},
		ReturnValues: 'ALL_NEW'
	};

	return dynamo
		.update(params)
		.promise()
		.then(response => {
			return response.Attributes;
		});
};
