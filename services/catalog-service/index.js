const { ServiceBroker } = require('moleculer');
const ApiService = require('moleculer-web');
const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/cloudkitchen_db',
  ssl: process.env.DATABASE_URL?.includes('localhost') ? false : { rejectUnauthorized: false }
});

const broker = new ServiceBroker({
  namespace: 'fruit-market',
  nodeID: 'catalog-service',
  transporter: 'TCP',
  logger: true,
  logLevel: 'info'
});

broker.createService({
  name: 'catalog',
  actions: {
    list: {
      async handler() {
        const result = await pool.query('SELECT * FROM products WHERE is_active = true ORDER BY created_at DESC');
        return result.rows;
      }
    },
    get: {
      params: { id: 'number' },
      async handler(ctx) {
        const result = await pool.query('SELECT * FROM products WHERE id = $1', [ctx.params.id]);
        return result.rows[0];
      }
    },
    create: {
      params: {
        name: 'string',
        category: 'string',
        price: 'number',
        stock: 'number',
        unit: { type: 'string', optional: true },
        description: { type: 'string', optional: true },
        image_url: { type: 'string', optional: true }
      },
      async handler(ctx) {
        const { name, category, price, stock, unit = 'kg', description = '', image_url = '' } = ctx.params;
        const result = await pool.query(
          'INSERT INTO products (name, category, price, stock, unit, description, image_url) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
          [name, category, price, stock, unit, description, image_url]
        );
        return result.rows[0];
      }
    }
  }
});

broker.createService({
  name: 'api',
  mixins: [ApiService],
  settings: {
    port: Number(process.env.CATALOG_SERVICE_PORT || 3002),
    cors: true,
    routes: [{
      aliases: {
        'GET /products': 'catalog.list',
        'GET /products/:id': 'catalog.get',
        'POST /products': 'catalog.create'
      }
    }]
  }
});

broker.start();
