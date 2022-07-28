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

export async function kucoinApiRequest(this: IHookFunctions | IExecuteFunctions | IExecuteSingleFunctions | ILoadOptionsFunctions,
	method: string, endpoint: string, body: object = {}, qs: object = {}, uri?: string): Promise<any> { // tslint:disable-line:no-any

	//Get credentials the user provided for this node
	const credentials = await this.getCredentials('kucoinApi') as IDataObject;

	if (credentials === undefined) {
		throw new NodeOperationError(this.getNode(), 'No credentials got returned!');
	}

	//Make http request according to <https://sendgrid.com/docs/api-reference/>
	const options: OptionsWithUri = {
		method,
		headers: {
			Accept: "application/json",
			Authorization: `Bearer ${credentials.apiKey}`,
			"KC-API-SIGN": `${credentials.apiSecret}`,
			"KC-API-TIMESTAMP": String(Date.now()),
			"KC-API-KEY": `${credentials.apiKey}`,
			"KC-API-PASSPHRASE": `${credentials.apiPassphrase}`,
			"KC-API-KEY-VERSION": `${credentials.apiVersion === "2.0" ? 2 : 1}`,
		},
		qs,
		body,
		uri: uri || `https://api.kucoin.com/${endpoint}`,
		json: true,
	};

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
