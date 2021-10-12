


import fastify from 'fastify'

const server = fastify({ logger: true });



export const possibleProductOptions = {
	name: [],
	price: [],
	size: ['2x2', '3x3', '4x4', '5x4', '5x5', '3x3x3'],
	color: ['light', 'medium', 'dark'],
	amountInPack: [],
} as const;

export interface ProductFields {
	readonly id: number;
	readonly name: string;
	readonly price: number;
	readonly size: typeof possibleProductOptions.size[number];
	readonly color: typeof possibleProductOptions.color[number][];
	readonly amountInPack: number;
}


export class Product {
	constructor(public fields: ProductFields) {

	}
}


const products = [
	new Product({
		id: 1,
		name: 'Simple Waffle',
		price: 99,
		size:  '4x4',
		color: ['medium'],
		amountInPack: 1,
	}),
	new Product({
		id: 2,
		name: 'Bigger Waffle',
		price: 129,
		size:  '5x5',
		color: ['medium'],
		amountInPack: 1,
	}),
	new Product({
		id: 3,
		name: 'Divercity Waffle Pack',
		price: 299,
		size:  '4x4',
		color: ['light', 'medium', 'dark'],
		amountInPack: 3,
	}),
	new Product({
		id: 4,
		name: 'Waffles',
		price: 105,
		size:  '5x4',
		color: ['medium'],
		amountInPack: 4,
	}),
	new Product({
		id: 5,
		name: 'Simple But Dark Waffle',
		price: 105,
		size:  '4x4',
		color: ['dark'],
		amountInPack: 4,
	}),
	new Product({
		id: 6,
		name: 'Mini Waffles',
		price: 79,
		size:  '3x3',
		color: ['light'],
		amountInPack: 3,
	}),
	new Product({
		id: 7,
		name: 'Mini Wafflets But Big Package',
		price: 400,
		size:  '2x2',
		color: ['light', 'medium', 'dark'],
		amountInPack: 20,
	}),
	new Product({
		id: 8,
		name: 'Mini Wafflets But Big Package (Divercity)',
		price: 300,
		size:  '2x2',
		color: ['light', 'medium', 'dark'],
		amountInPack: 15,
	}),
	new Product({
		id: 9,
		name: 'Waffle^3',
		price: 278,
		size:  '3x3x3',
		color: ['medium'],
		amountInPack: 1,
	}),
];




server.route({
	method: ['GET', 'POST'],
	url: '/',
	schema: {
		// request needs to have a querystring with a `name` parameter
		querystring: {
			name: { type: 'string' }
		},
		// the response needs to be an object with an `hello` property of type 'string'
		response: {
			200: {
				type: 'object',
				properties: {
					products: { type: 'array' }
				}
			}
		}
	},
	// this function is executed for every request before the handler is executed
	preHandler: async (request, reply) => {
		// E.g. check authentication
	},
	handler: async (request, reply) => {

		const fitered = products
			.filter(product => {
				return product.fields.amountInPack >= request.body.amountInPack.min && product.fields.amountInPack <= request.body.amountInPack.max;
			})
			.filter(product => {
				return product.fields.price >= request.body.price.min && product.fields.price <= request.body.price.max;
			})
			.filter(product => {
				return request.body.color.length > 0 ? request.body.color.some(color => product.fields.color.includes(color)) : true;
			})
			.filter(product => {
				return request.body.size.length > 0 ? request.body.size.includes(product.fields.size) : true;
			})
			.filter(product => {
				const search = request.body.search.toLowerCase();
				return search !== '' ? product.fields.name.toLowerCase().includes(search) || product.fields.color.join().toLowerCase().includes(search) || product.fields.size.toLowerCase().includes(search) : true
			});

		reply.header('Access-Control-Allow-Origin', '*');
		reply.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
		reply.header('Access-Control-Allow-Headers', 'content-type');
		reply.header('Cache-Control', 'no-cache');
		reply.send({ products: fitered });
		return reply;
	}
})

server.route({
	method: 'OPTIONS',
	url: '/',
	schema: {
		// request needs to have a querystring with a `name` parameter
		querystring: {
			name: { type: 'string' }
		},
		// the response needs to be an object with an `hello` property of type 'string'
		response: {
			200: {}
		}
	},
	// this function is executed for every request before the handler is executed
	preHandler: async (request, reply) => {
		// E.g. check authentication
	},
	handler: async (request, reply) => {
		reply.header('Access-Control-Allow-Origin', '*');
		reply.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
		reply.header('Access-Control-Allow-Headers', 'content-type');
		reply.header('Cache-Control', 'no-cache');
		reply.send();
		return reply;
	}
})

const start = async () => {
	try {
		await server.listen(8000)
	} catch (err) {
		server.log.error(err)
		process.exit(1)
	}
}
start()