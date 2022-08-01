import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class KucoinApi implements ICredentialType {
	name = "kucoinApi";
	displayName = "Kucoin API";
	documentationUrl = "kucoin";
	properties: INodeProperties[] = [
		// The credentials to get from user and save encrypted.
		// Properties can be defined exactly in the same way
		// as node properties.
		{
			displayName: "API Key",
			name: "apiKey",
			type: "string",
			required: true,
			default: "",
		},
		{
			displayName: "API Secret",
			name: "apiSecret",
			type: "string",
			required: true,
			default: "",
		},
		{
			displayName: "Passphrase",
			name: "apiPassphrase",
			type: "string",
			required: true,
			default: "",
		},
		{
			displayName: "Api Version",
			name: "apiVersion",
			type: "string",
			default: "v1",
		},
	];
}
