import {
	INodeProperties,
} from 'n8n-workflow';

export const optionalFields = [
    // ----------------------------------
    // add optional "Place a new order" operations //post
    // ----------------------------------
    {
		displayName: 'Add Optional Operations',
		name: 'optionalPostOperations',
		type: 'collection',
    	placeholder: 'Add Field',
    	default: {},
		required: false,
		typeOptions: {
            multipleValues: false,
		},
        displayOptions: {
            show: {
                operation: ['placeNewOrder'],
            },
        },
        options: [
            {
                displayName: 'Type',
                name: 'type',
                type: 'string',
                default: "",
                required: false,
                description: "limit or market (default is limit)"
            },
            {
                displayName: 'Remark',
                name: 'remark',
                type: 'string',
                default: "",
                required: false,
                description: "remark for the order, length cannot exceed 100 utf8 characters"
            },
            {
                displayName: 'STP',
                name: 'stp',
                type: 'string',
                default: "",
                required: false,
                description: "self trade prevention , CN, CO, CB or DC"
            },
            {
                displayName: 'Trade Type',
                name: 'tradeType',
                type: 'string',
                default: "",
                required: false,
                description: "The type of trading : TRADE（Spot Trade）, MARGIN_TRADE (Margin Trade). Default is TRADE. Note: To improve the system performance and to accelerate order placing and processing, KuCoin has added a new interface for order placing of margin. For traders still using the current interface, please move to the new one as soon as possible. The current one will no longer accept margin orders by May 1st, 2021 (UTC). At the time, KuCoin will notify users via the announcement, please pay attention to it."
            },
        ],
	},
    {
		displayName: 'LIMIT ORDER PARAMETERS',
		name: 'limitOrderParameters',
		type: 'collection',
    	placeholder: 'Add Field',
    	default: {},
		required: false,
		typeOptions: {
            multipleValues: false,
		},
        displayOptions: {
            show: {
                operation: ['placeNewOrder'],
            },
        },
        options: [
            {
                displayName: 'Time In Force',
                name: 'timeInForce',
                type: 'string',
                default: "",
                required: false,
                description: "GTC, GTT, IOC, or FOK (default is GTC), read Time In Force."
            },
            {
                displayName: 'Cancel After',
                name: 'cancelAfter',
                type: 'number',
                default: "",
                required: false,
                description: "Cancel after n seconds, requires timeInForce to be GTT"
            },
            {
                displayName: 'Post Only',
                name: 'postOnly',
                type: 'string',
                default: "",
                required: false,
                description: "Post only flag, invalid when timeInForce is IOC or FOKC"
            },
            {
                displayName: 'Hidden',
                name: 'hidden',
                type: 'string',
                default: "",
                required: false,
                description: "Order will not be displayed in the order book"
            },
            {
                displayName: 'Iceberg',
                name: 'iceberg',
                type: 'string',
                default: "",
                required: false,
                description: "Only aportion of the order is displayed in the order book"
            },
        ],
	},
    {
		displayName: 'MARKET ORDER PARAMETERS',
		name: 'marketOrderParameters',
		type: 'collection',
    	placeholder: 'Add Field',
    	default: {},
		required: false,
		typeOptions: {
            multipleValues: false,
		},
        displayOptions: {
            show: {
                operation: ['placeNewOrder'],
            },
        },
        options: [
            {
                displayName: 'Size',
                name: 'size',
                type: 'string',
                default: "",
                required: false,
                description: "Desired amount in base currency"
            },
            {
                displayName: 'Funds',
                name: 'funds',
                type: 'string',
                default: "",
                required: false,
                description: "The desired amount of quote currency to use"
            },
        ],
	},
    // ----------------------------------
    // add optional "Cancel Order" operations //delete
    // ----------------------------------
    {
		displayName: 'Add Optional Operations',
		name: 'optionalPostOperations',
		type: 'collection',
    	placeholder: 'Add Field',
    	default: {},
		required: false,
		typeOptions: {
            multipleValues: false,
		},
        displayOptions: {
            show: {
                operation: ['cancelAllOrders'],
            },
        },
        options: [
            {
                displayName: 'Symbol',
                name: 'symbol',
                type: 'string',
                default: "",
                required: false,
                description: "symbol, cancel the orders for the specified trade pair.",
            },
            {
                displayName: 'Trade Type',
                name: 'tradeType',
                type: 'string',
                default: "",
                required: false,
                description: "the type of trading, cancel the orders for the specified trading type, and the default is to cancel the spot trading order (TRADE).",
            },
        ],
	},
    // ----------------------------------
    // add optional "Query Order" operations //get
    // ----------------------------------
    {
		displayName: 'Add Optional Operations',
		name: 'optionalPostOperations',
		type: 'collection',
    	placeholder: 'Add Field',
    	default: {},
		required: false,
		typeOptions: {
            multipleValues: false,
		},
        displayOptions: {
            show: {
                operation: ['listOrders'],
            },
        },
        options: [
            {
                displayName: 'Trade Type',
                name: 'tradeType',
                type: 'string',
                default: "",
                required: false,
                description: "the type of trading, cancel the orders for the specified trading type, and the default is to cancel the spot trading order (TRADE).",
            },
            {
                displayName: 'Status',
                name: 'status',
                type: 'string',
                required: false,
                default: "",
                description:"active or done(done as default), Only list orders with a specific status ."
            },
            {
                displayName: 'Symbol',
                name: 'symbol',
                type: 'string',
                required: false,
                default: "",
                description:"Only list orders for a specific symbol."
            },
            {
                displayName: 'Side',
                name: 'side',
                type: 'string',
                required: false,
                default: "",
                description:"buy or sell"
            },
            {
                displayName: 'Type',
                name: 'type',
                type: 'string',
                required: false,
                default: "",
                description:"limit, market, limit_stop or market_stop"
            },
            {
                displayName: 'Start At',
                name: 'startAt',
                type: 'number',
                required: false,
                default: "",
                description: "Start time (milisecond)",
            },
            {
                displayName: 'End At',
                name: 'endAt',
                type: 'number',
                required: false,
                default: "",
                description: "End time (milisecond)",
            },
        ],
	},

]