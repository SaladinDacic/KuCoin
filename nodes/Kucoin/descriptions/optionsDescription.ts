import { requiredFields } from './chuncks';
import { optionalFields } from './chuncks';
import {
	INodeProperties,
} from 'n8n-workflow';

export const publicApiOperations = [
    // ----------------------------------
    //         Methods setup
    // ----------------------------------
    {
        displayName: 'Operations',
        name: 'operation',
        required: true,
        type: 'options',
        options: [
            {
                name: 'Place a new order',
                value: 'placeNewOrder',
                description: 'Send in a new order..',
            },
            {
                name: 'Cancel an order',
                value: 'cancelOrder',
                description: 'Cancel an active order.',
            },
            {
                name: 'Cancel all orders',
                value: 'cancelAllOrders',
                description: 'Cancels all active orders.',
            },
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
        description: 'Methods to use',
    },

    // ----------------------------------
    //      All required fields
    // ----------------------------------
    ...requiredFields,

    // ----------------------------------
    //      All optional fields
    // ----------------------------------
    ...optionalFields,




] as INodeProperties[];
