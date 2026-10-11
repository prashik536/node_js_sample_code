const { ServiceBroker } = require('moleculer');
const ApiService = require('moleculer-web');
const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@database-1.cbim040e44mj.ap-south-1.rds.amazonaws.com:5432/postgres',
  ssl: process.env.DATABASE_URL?.includes('localhost') ? false : { rejectUnauthorized: false }
});

const broker = new ServiceBroker({
  namespace: 'fruit-market',
  nodeID: 'order-service',
  transporter: 'TCP',
  logger: true,
  logLevel: 'info'
});

broker.createService({
  name: 'orders',
  actions: {
    create: {
      params: {
        userId: 'number',
        items: 'array'
      },
      async handler(ctx) {
        const { userId, items } = ctx.params;
        const total = items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);

        const orderResult = await pool.query(
          'INSERT INTO orders (user_id, total, status, payment_status) VALUES ($1, $2, $3, $4) RETURNING *',
          [userId, total, 'pending', 'dummy']
        );

        const orderId = orderResult.rows[0].id;
        for (const item of items) {
          await pool.query(
            'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
            [orderId, item.productId, item.quantity, item.price]
          );
        }

        return { order: orderResult.rows[0], message: 'Payment gateway is not integrated yet. Dummy payment status saved.' };
      }
    },
    list: {
      params: { userId: { type: 'number', optional: true } },
      async handler(ctx) {
        const whereClause = ctx.params.userId ? 'WHERE o.user_id = $1' : '';
        const values = ctx.params.userId ? [ctx.params.userId] : [];
        const result = await pool.query(`SELECT o.*, json_agg(json_build_object('product_id', oi.product_id, 'quantity', oi.quantity, 'price', oi.price)) as items FROM orders o LEFT JOIN order_items oi ON oi.order_id = o.id ${whereClause} GROUP BY o.id ORDER BY o.created_at DESC`, values);
        return result.rows;
      }
    }
  }
});

broker.createService({
  name: 'api',
  mixins: [ApiService],
  settings: {
    port: Number(process.env.ORDER_SERVICE_PORT || 3003),
    cors: true,
    routes: [{
      aliases: {
        'POST /orders': 'orders.create',
        'GET /orders': 'orders.list'
      }
    }]
  }
});

broker.start();
