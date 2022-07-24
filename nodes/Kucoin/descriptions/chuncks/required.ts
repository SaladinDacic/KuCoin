import {
	INodeProperties,
} from 'n8n-workflow';

export const requiredFields = [
	// ----------------------------------
    //        All operations
    // ----------------------------------
    {
        displayName: 'ClientOid', //M
        name: 'clientOid',
        type: 'string',
        default: '',
        displayOptions: {
            show: {
                operation: ['placeNewOrder'],
            },
        },
        required: true,
        description: "Unique order id created by users to identify their orders, e.g. UUID."
    },
    {
        displayName: 'Side', //M
        name: 'side',
        type: 'string',
        default: '',
        displayOptions: {
            show: {
                operation: ['placeNewOrder'],
            },
        },
        descriprion:"buy or sell",
        required: true,
    },
	{
        displayName: 'Symbol', //M
        name: 'symbol',
        type: 'string',
        default: '',
        displayOptions: {
            show: {
                operation: ['placeNewOrder'],
            },
        },
        required: true,
        description: "a valid trading symbol code. e.g. ETH-BTC"
    },
    {
        displayName: 'Price', //M
        name: 'price',
        type: 'string',
        displayOptions: {
            show: {
                operation: ['placeNewOrder'],
            },
        },
        required: true,
        description: "price per base currency"
    },
    {
        displayName: 'Size', //M
        name: 'size',
        type: 'string',
        displayOptions: {
            show: {
                operation: ['placeNewOrder'],
            },
        },
        required: true,
        description: "amount of base currency to buy or sell"
    },
    {
        displayName: 'OrderId', //M
        name: 'orderId',
        type: 'string',
        displayOptions: {
            show: {
                operation: ['cancelOrder','getAnOrder'],
            },
        },
        required: true,
        description: "Order ID, unique ID of the order."
    },
    {
        displayName: 'Trade Type', //M
        name: 'tradeType',
        type: 'string',
        displayOptions: {
            show: {
                operation: ['listOrders'],
            },
        },
        required: true,
        description: "The type of trading : TRADE（Spot Trading）, MARGIN_TRADE (Margin Trading)."
    },

]