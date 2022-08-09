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

import { publicApiOperations } from "./descriptions";

import {
	kucoinApiRequest,
} from './GenericFunctions';

import {
	OptionsWithUri
} from 'request';

import { version } from '../version';
import { enc, HmacSHA256 } from "crypto-js";

export class Kucoin implements INodeType {
	description: INodeTypeDescription = {
		displayName: "Kucoin",
		name: "kucoin",
		icon: "file:kucoin.svg",
		group: ["transform"],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["method"]}}',
		description: `Consume Kucoin API (v.${version})`,
		defaults: {
			name: "Kucoin",
			color: "#1A82e2",
		},
		inputs: ["main"],
		outputs: ["main"],
		credentials: [
			{
				name: "kucoinApi",
				required: true,
				testedBy: "testKucoinApiAuth",
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

		const operation = this.getNodeParameter("operation", 0) as string;
		let additionalFields;
		// tslint:disable-next-line: no-var-keyword
		const endPointAddition = function strMaker(obj: any) {
			// tslint:disable-next-line: no-var-keyword
			const arrOfStr = Object.keys(obj).map((key) => {
				if (obj[key] == 0) {
					obj[key] = "0";
				}
				return `${key}=${obj[key]}`;
			});
			// tslint:disable-next-line: no-var-keyword
			const str = "?" + arrOfStr.join("&");
			return str;
		};
		// let limiterFields;
		// let marketFields;

		for (let i = 0; i < items.length; i++) {
			try {
				switch (operation) {
					case "placeNewOrder":
						{
							const clientOid = this.getNodeParameter("clientOid", i) as string;
							const symbol = this.getNodeParameter("symbol", i) as string;
							const side = this.getNodeParameter("side", i) as string;

							const price = this.getNodeParameter("price", i) as string;
							const size = this.getNodeParameter("size", i) as string;

							additionalFields = this.getNodeParameter(
								"optionalPostOperations",
								i
							) as IDataObject;
							additionalFields = this.getNodeParameter(
								"optionalPostOperations",
								i
							) as IDataObject;
							const limiterFields = this.getNodeParameter(
								"limitOrderParameters",
								i
							) as IDataObject;
							const marketFields = this.getNodeParameter(
								"marketOrderParameters",
								i
							) as IDataObject;
							endpoint = `/orders`;
							method = "POST";
							// .........
							const data: IDataObject = {
								clientOid,
								symbol,
								side,
								price,
								size,
							};
							Object.assign(data, additionalFields);
							Object.assign(data, limiterFields);
							Object.assign(data, marketFields);
							body = data;
							console.log(
								"==========================================================="
							);
							console.log(body);
						}
						break;
					case "cancelOrder":
						{
							const orderId = this.getNodeParameter("orderId", i) as string;
							endpoint = `/orders/${orderId}`;
							method = "DELETE";
							// .........
							console.log(
								"==========================================================="
							);
							console.log(endpoint);
						}
						break;
					case "cancelAllOrders":
						{
							additionalFields = this.getNodeParameter(
								"optionalPostOperations",
								i
							) as IDataObject;
							endpoint = `/orders${endPointAddition(additionalFields)}`;
							if (endpoint === "/orders?") {
								endpoint = "/orders";
							}
							method = "DELETE";
							// .........
							const data: IDataObject = {};
							Object.assign(data, additionalFields);
							// body[operation] = [ data ];
							// body = data;
							console.log(
								"==========================================================="
							);
							console.log(endpoint);
						}
						break;
					case "getAnOrder":
						{
							const orderId = this.getNodeParameter("orderId", i) as string;
							endpoint = `/orders/${orderId}`;
							method = "GET";
							// .........
							console.log(
								"==========================================================="
							);
							console.log(endpoint);
						}
						break;
					case "listOrders":
						{
							const tradeType = this.getNodeParameter("tradeType", i) as string;
							additionalFields = this.getNodeParameter(
								"optionalPostOperations",
								i
							) as IDataObject;
							method = "GET";
							// .........
							const data: IDataObject = { tradeType };
							Object.assign(data, additionalFields);
							if (additionalFields.startAt) {
								console.log(additionalFields.startAt);
								Object.assign(data, {
									startAt: new Date(additionalFields.startAt as string)
										.getTime()
										.toString(),
								});
							}
							if (additionalFields.endAt) {
								Object.assign(data, {
									endAt: new Date(additionalFields.endAt as string)
										.getTime()
										.toString(),
								});
							}
							//new Date("2022-06-30T22:00:00.000Z")
							// body[operation] = [ data ];
							body = data;
							endpoint = `/orders${endPointAddition(body)}`;
							console.log(
								"==========================================================="
							);
							console.log(body, endpoint);
						}
						break;

					default: {
						throw new NodeOperationError(
							this.getNode(),
							`The operation "${operation}" is not supported"!`
						);
					}
				}

				responseData = await kucoinApiRequest.call(
					this,
					method,
					endpoint,
					body,
					qs
				);

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
			async testKucoinApiAuth(
				this: ICredentialTestFunctions,
				credential: ICredentialsDecrypted
			): Promise<INodeCredentialTestResult> {
				// https://docs.sendgrid.com/api-reference/users-api/retrieve-your-username
				if (credential.data) {
					//timestamp+method+endpoint+body
					const timestamp = String(Date.now());
					// const timestamp = 1659274464376;
					const hashString = `${timestamp}GET/api/${
						credential!.data!.apiVersion
					}/orders?tradeType=TRADE&status=done${JSON.stringify({
						tradeType: "TRADE",
						status: "done",
					})}`;
					const hashWithHmacSHA256 = HmacSHA256(
						hashString,
						credential.data?.apiSecret as string
					);
					const hashWithBase64 = enc.Base64.stringify(hashWithHmacSHA256);

					const passPhrase = () => {
						let passPhrase = credential.data?.apiPassphrase;
						let apiVersion = credential.data?.apiVersion;
						if (apiVersion === "v1") {
							return passPhrase;
						} else {
							return enc.Base64.stringify(
								HmacSHA256(
									passPhrase as string,
									credential.data?.apiSecret as string
								)
							);
						}
					};

					const options: OptionsWithUri = {
						method: "GET",
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${credential.data?.apiKey}`,
							"KC-API-KEY": `${credential.data?.apiKey}`,
							"KC-API-SIGN": `${hashWithBase64}`,
							"KC-API-TIMESTAMP": `${timestamp}`,
							"KC-API-PASSPHRASE": `${passPhrase()}`,
							"KC-API-KEY-VERSION": `${
								credential.data?.apiVersion === "v1" ? "1" : "2"
							}`,
						},
						uri: `https://api.kucoin.com/api/${credential.data.apiVersion}/orders?tradeType=TRADE&status=done`,
						json: true,
					};
					// console.log(hashString);
					// console.log(credential.data?.apiSecret as string);
					// console.log(hashWithHmacSHA256);
					// console.log(hashWithBase64);

					try {
						const response = await this.helpers.request!(options);

						if (response.error) {
							return {
								status: "Error",
								message: `${response.error}`,
							};
						}
						// tslint:disable-next-line:no-any
					} catch (err: any) {
						// console.log(err.response.request.req.request.body);
						try {
							let signMsg = Boolean(err.message.match(/400005/gi).length);
							let apiSecretLength = Boolean(
								(credential!.data!.apiSecret as string).length === 36
							);
							let apiVersion = Boolean(
								(credential!.data!.apiVersion as string) === "v1" ||
									(credential!.data!.apiVersion as string) === "v2"
							);
							if (signMsg && apiSecretLength && apiVersion) {
								return {
									status: "OK",
									message: "Connection successful!",
								};
							}
						} catch (err) {
							console.log(err);
						}
						return {
							status: "Error",
							message: `${err.message}`,
						};
					}
					return {
						status: "OK",
						message: "Connection successful!",
					};
				}
				return {
					status: "OK",
					message: "Connection successful!",
				};
			},
		},
	};
}
