import {
	INodeProperties,
} from 'n8n-workflow';

export const mainMethods = [
    // ----------------------------------
    //        get operation
    // ----------------------------------
    {
        displayName: 'Get Operations',
        name: 'operation',
        type: 'options',
        displayOptions: {
            show: {
                method: ['get'],
            },
        },
        options: [
            {
                name: 'Get an order',
                value: 'getAnOrder',
                // description: "",
            },
            {
                name: 'List Orders',
                value: 'listOrders',
                description: 'List all orders.',
            },
        ],
        // default: 'getDevices',
        description: 'List of get operations',
    },
    // ----------------------------------
    //        post operation
    // ----------------------------------
    {
        displayName: 'Post Operations',
        name: 'operation',
        type: 'options',
        displayOptions: {
            show: {
                method: ['post'],
            },
        },
        options: [
            {
                name: 'Place a new order',
                value: 'placeNewOrder',
                description: 'Send in a new order..',
            },
        ],
        // default: 'getDevices',
        description: 'List of post operations',
    },
    // ----------------------------------
    //        delete operation
    // ----------------------------------
    {
        displayName: 'Delete Operations',
        name: 'operation',
        type: 'options',
        displayOptions: {
            show: {
                method: ['delete'],
            },
        },
        options: [
            {
                name: 'Cancel an order',
                value: 'cancelOrder',
                description: 'Cancel an active order.',
            },
            {
                name: 'Cancel all orders',
                value: 'cancelAllOrders',
                description: 'Cancels all active orders.',
            }
        ],
        // default: 'getDevices',
        description: 'List of delete operations',
    },
]