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
  nodeID: 'delivery-service',
  transporter: 'TCP',
  logger: true,
  logLevel: 'info'
});

broker.createService({
  name: 'delivery',
  actions: {
    assign: {
      params: { orderId: 'number' },
      async handler(ctx) {
        const existing = await pool.query('SELECT * FROM deliveries WHERE order_id = $1', [ctx.params.orderId]);
        if (existing.rows.length > 0) return existing.rows[0];

        const result = await pool.query(
          'INSERT INTO deliveries (order_id, courier_name, status, eta_minutes) VALUES ($1, $2, $3, $4) RETURNING *',
          [ctx.params.orderId, 'Fleet Runner', 'queued', 35]
        );
        return result.rows[0];
      }
    },
    list: {
      async handler() {
        const result = await pool.query('SELECT * FROM deliveries ORDER BY created_at DESC');
        return result.rows;
      }
    }
  }
});

broker.createService({
  name: 'api',
  mixins: [ApiService],
  settings: {
    port: Number(process.env.DELIVERY_SERVICE_PORT || 3004),
    cors: true,
    routes: [{
      aliases: {
        'POST /delivery/assign': 'delivery.assign',
        'GET /delivery': 'delivery.list'
      }
    }]
  }
});

broker.start();
