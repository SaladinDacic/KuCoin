import {
	OptionsWithUri,
} from 'request';

import {
	IExecuteFunctions,
	IExecuteSingleFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
} from 'n8n-core';

import {
	IDataObject,
	NodeApiError,
	NodeOperationError,
} from 'n8n-workflow';
import { HmacSHA256, enc } from "crypto-js";

export async function kucoinApiRequest(
	this:
		| IHookFunctions
		| IExecuteFunctions
		| IExecuteSingleFunctions
		| ILoadOptionsFunctions,
	method: string,
	endpoint: string,
	body: object = {},
	qs: object = {},
	uri?: string
): Promise<any> {
	// tslint:disable-line:no-any

	//Get credentials the user provided for this node
	const credentials = (await this.getCredentials("kucoinApi")) as IDataObject;

	if (credentials === undefined) {
		throw new NodeOperationError(
			this.getNode(),
			"No credentials got returned!"
		);
	}

	//timestamp+method+endpoint+body
	let timestamp = String(Date.now());
	// const timestamp = 1659274464376;
	let hashString = `${timestamp}${method}/api/${
		credentials.apiVersion
	}${endpoint}${Object.entries(body).length !== 0 ? JSON.stringify(body) : ""}`;
	console.log(hashString);
	let hashWithHmacSHA256 = HmacSHA256(
		hashString,
		credentials.apiSecret as string
	);
	let hashWithBase64 = enc.Base64.stringify(hashWithHmacSHA256);

	const passPhrase = () => {
		let passPhrase = credentials.apiPassphrase;
		let apiVersion = credentials.apiVersion;
		if (apiVersion === "v1") {
			return passPhrase;
		} else {
			return enc.Base64.stringify(
				HmacSHA256(passPhrase as string, credentials.apiSecret as string)
			);
		}
	};
	//Make http request according to <https://sendgrid.com/docs/api-reference/>
	const options: OptionsWithUri = {
		method,
		headers: {
			Accept: "application/json",
			Authorization: `Bearer ${credentials.apiKey}`,
			"KC-API-KEY": `${credentials.apiKey}`,
			"KC-API-SIGN": `${hashWithBase64}`,
			"KC-API-TIMESTAMP": `${timestamp}`,
			"KC-API-PASSPHRASE": `${passPhrase()}`,
			"KC-API-KEY-VERSION": `${credentials.apiVersion === "v1" ? "1" : "2"}`,
		},
		qs,
		body, //sandbox kucoin credentials
		uri:
			uri || `https://api.kucoin.com/api/${credentials.apiVersion}${endpoint}`,
		json: true,
	};
	// console.log(hashString);
	// console.log(credentials.apiSecret as string);
	// console.log(hashWithHmacSHA256);
	// console.log(hashWithBase64);
	// console.log(
	// 	`https://api.kucoin.com/api/${credentials.apiVersion}${endpoint}`,
	// 	"KC-API-KEY: ",
	// 	`${credentials.apiKey}`,
	// 	"KC-API-SIGN: ",
	// 	`${hashWithBase64}`,
	// 	"KC-API-TIMESTAMP: ",
	// 	`${timestamp}`,
	// 	"KC-API-PASSPHRASE: ",
	// 	`${passPhrase()}`,
	// 	"KC-API-KEY-VERSION: ",
	// 	`${credentials.apiVersion}`
	// );
	if (Object.keys(options.qs).length === 0) {
		delete options.qs;
	}
	if (Object.keys(options.body).length === 0) {
		delete options.body;
	}

	try {
		return this.helpers.request!(options);
		// tslint:disable-next-line:no-any
	} catch (error: any) {
		throw new NodeApiError(this.getNode(), error);
	}
}
