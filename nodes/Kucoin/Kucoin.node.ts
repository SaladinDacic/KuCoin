import {
	IExecuteFunctions,
} from 'n8n-core';

import {
	ICredentialsDecrypted,
	ICredentialTestFunctions,
	IDataObject,
	INodeCredentialTestResult,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import {publicApiOperations} from "./descriptions";

import {
	kucoinApiRequest,
} from './GenericFunctions';

import {
	OptionsWithUri
} from 'request';

import { version } from '../version';

export class Kucoin implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Kucoin',
		name: 'kucoin',
		icon: 'file:kucoin.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["method"]}}',
		description: `Consume Kucoin API (v.${version})`,
		defaults: {
				name: 'Kucoin',
				color: '#1A82e2',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'kucoinApi',
				required: true,
				testedBy: 'testKucoinApiAuth',
			},
		],
		properties: [...publicApiOperations],
	};


	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		let responseData;
		const returnData: IDataObject[] = [];

		let method: string;
		let endpoint: string;
		let body: IDataObject = {};
		const qs: IDataObject = {}; // query string

		const resource = this.getNodeParameter('method', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;
		let additionalFields;
		var endPointAddition = function strMaker(obj:any){
			var arrOfStr = Object.keys(obj).map(key=>{
				if (obj[key] == 0 ){obj[key] = "0"}
				return `${key}=${obj[key]}`
			})
			var str = "?" + arrOfStr.join("&")
			return str
		}
		// let limiterFields;
		// let marketFields;

		for (let i = 0; i < items.length; i++) {
			try {
				switch (resource) {
					case 'get':
						// ----------------------------------
						//        method:get
						// ----------------------------------
						switch (operation) {
							case 'getAnOrder':
							{
								let orderId = this.getNodeParameter('orderId', i) as string;
								additionalFields = this.getNodeParameter('optionalPostOperations', i) as IDataObject;
								endpoint = `/api/v1/orders/${orderId}`;
								method = 'GET';
								// .........
								let data: IDataObject = { };
								Object.assign(data, additionalFields);
								body[operation] = [ data ]; //don't have shape of the object, and not sure should I create params or send object
								console.log("===========================================================")
								console.log(body)
							}
							break;
							case 'listOrders':
							{
								let tradeType = this.getNodeParameter('tradeType', i) as string;
								additionalFields = this.getNodeParameter('optionalPostOperations', i) as IDataObject;
								method = 'GET';
								// .........
								let data: IDataObject = { tradeType };
								Object.assign(data, additionalFields);
								// body[operation] = [ data ];
								body=data;
								endpoint = `/api/v1/orders${endPointAddition(body)}`;
								console.log("===========================================================")
								console.log(body, endpoint)
							}
							break;
							default: {
								throw new NodeOperationError(this.getNode(), `The operation "${operation}" is not supported for method "${resource}"!`);
							}
						}break;

					case 'post':
						// ----------------------------------
						//        method:post
						// ----------------------------------
						switch (operation){
							case 'placeNewOrder':
								{
									let clientOid = this.getNodeParameter('clientOid', i) as string;
									let symbol = this.getNodeParameter('symbol', i) as string;
									let side = this.getNodeParameter('side', i) as string;

									let price = this.getNodeParameter('price', i) as string;
									let size = this.getNodeParameter('size', i) as string;


									additionalFields = this.getNodeParameter('optionalPostOperations', i) as IDataObject;
									additionalFields = this.getNodeParameter('optionalPostOperations', i) as IDataObject;
									let limiterFields = this.getNodeParameter('limitOrderParameters', i) as IDataObject;
									let marketFields = this.getNodeParameter('marketOrderParameters', i) as IDataObject;
									endpoint = `/api/v1/orders`;
									method = 'POST';
									// .........
									let data: IDataObject = { clientOid,symbol,side,price,size };
									Object.assign(data, additionalFields);
									Object.assign(data, limiterFields);
									Object.assign(data, marketFields);
									body = data;
									console.log("===========================================================")
									console.log(body)
								}
							break;
							default: {
								throw new NodeOperationError(this.getNode(), `The operation "${operation}" is not supported for method "${resource}"!`);
							}
						}
						break;

					case 'delete':
						switch(operation){
							case 'cancelOrder':
								{
									let orderId = this.getNodeParameter('orderId', i) as string;
									additionalFields = this.getNodeParameter('optionalPostOperations', i) as IDataObject;
									endpoint = `/api/v1/orders/${orderId}`;
									method = 'DELETE';
									// .........
									let data: IDataObject = {};
									Object.assign(data, additionalFields);
									body[operation] = [ data ];
									console.log("===========================================================")
									console.log(body, endpoint)
								}
							break;
							case 'cancelAllOrders':
								{
									additionalFields = this.getNodeParameter('optionalPostOperations', i) as IDataObject;
									endpoint = `/api/v1/orders${endPointAddition(additionalFields)}`;
									method = 'DELETE';
									// .........
									let data: IDataObject = {};
									Object.assign(data, additionalFields);
									// body[operation] = [ data ];
									body = data;
									console.log("===========================================================")
									console.log(body, endpoint)
								}
							break;
							default: {
								throw new NodeOperationError(this.getNode(), `The operation "${operation}" is not supported for method "${resource}"!`);
							}
						}
						break;

					default: {
						throw new NodeOperationError(this.getNode(), `The operation method is not supported for resource resource!`);
					}
				}

				responseData = await kucoinApiRequest.call(this, method, endpoint, body, qs);

				if (Array.isArray(responseData)) {
					returnData.push.apply(returnData, responseData as IDataObject[]);
				} else if (responseData !== undefined) {
					returnData.push(responseData as IDataObject);
				}
			// tslint:disable-next-line:no-any
			} catch (error: any) {
				if (this.continueOnFail()) {
					returnData.push({ error: error.message });
					continue;
				}
				throw error;
			}
		}
		return [this.helpers.returnJsonArray(returnData)];
	}


	methods = {
		credentialTest: {
			async testKucoinApiAuth(this: ICredentialTestFunctions, credential: ICredentialsDecrypted): Promise<INodeCredentialTestResult> {

				// https://docs.sendgrid.com/api-reference/users-api/retrieve-your-username
				const options: OptionsWithUri = {
					method: 'GET',
					headers: {
						'Accept': ' application/json',
						'Authorization': `Bearer ${credential!.data!.apiKey}`,
					},
					uri: 'https://api.sendgrid.com/v3/marketing/user/username',
					json: true,
				};

				try {
					const response = await this.helpers.request(options);

					if (response.error) {
						return {
							status: 'Error',
							message: `${response.error}`,
						};
					}
				// tslint:disable-next-line:no-any
				} catch (err: any) {
					return {
						status: 'Error',
						message: `${err.message}`,
					};
				}

				return {
					status: 'OK',
					message: 'Connection successful!',
				};
			},
		},
	};
}
