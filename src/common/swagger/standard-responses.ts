import { applyDecorators, Type } from '@nestjs/common';
import {
	ApiCreatedResponse,
	ApiOkResponse,
	getSchemaPath,
} from '@nestjs/swagger';

// Helper to build the common wrapper properties
function baseWrapperProperties(message: string) {
	return {
		status_code: { type: 'number', example: 200 },
		status: { type: 'boolean', example: true },
		message: { type: 'string', example: message || 'Success' },
		path: { type: 'string', example: '/resource' },
	};
}

export function ApiOkStd(message: string, model: Type<any>) {
	return applyDecorators(
		ApiOkResponse({
			schema: {
				allOf: [
					{
						properties: {
							...baseWrapperProperties(message),
							data: { $ref: getSchemaPath(model) },
						},
						required: ['status_code', 'status', 'message', 'data'],
					},
				],
			},
		}),
	);
}

export function ApiCreatedStd(message: string, model: Type<any>) {
	return applyDecorators(
		ApiCreatedResponse({
			schema: {
				allOf: [
					{
						properties: {
							...baseWrapperProperties(message),
							status_code: { type: 'number', example: 201 },
							data: { $ref: getSchemaPath(model) },
						},
						required: ['status_code', 'status', 'message', 'data'],
					},
				],
			},
		}),
	);
}

export function ApiOkArrayStd(message: string, model: Type<any>) {
	return applyDecorators(
		ApiOkResponse({
			schema: {
				allOf: [
					{
						properties: {
							...baseWrapperProperties(message),
							data: { type: 'array', items: { $ref: getSchemaPath(model) },example: [] },
						},
						required: ['status_code', 'status', 'message', 'data'],
					},
				],
			},
		}),
	);
}

export function ApiOkEmptyStd(message: string) {
	return applyDecorators(
		ApiOkResponse({
			schema: {
				allOf: [
					{
						properties: {
							...baseWrapperProperties(message),
							data: { type: 'array', items: {} ,example: []},
						},
						required: ['status_code', 'status', 'message', 'data'],
					},
				],
			},
		}),
	);
}


// add at bottom of file
export function errorSchema(status: number, exampleMessage: string) {
	return {
		description: exampleMessage,
		schema: {
			allOf: [
				{
					properties: {
						status_code: { type: 'number', example: status },
						status: { type: 'boolean', example: false },
						message: { type: 'string', example: exampleMessage },
						data: { type: 'array', items: {} ,example: []},
						path: { type: 'string', example: '/resource' },
					},
					required: ['status_code', 'status', 'message', 'data', 'path'],
				},
			],
		},
	};
}

export const StdError = {
	BadRequest: errorSchema(400, 'Bad request'),
	Unauthorized: errorSchema(401, 'Unauthorized'),
	Forbidden: errorSchema(403, 'Forbidden'),
	Conflict: errorSchema(409, 'Conflict'),
};