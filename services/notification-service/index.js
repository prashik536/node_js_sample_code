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
  nodeID: 'notification-service',
  transporter: 'TCP',
  logger: true,
  logLevel: 'info'
});

broker.createService({
  name: 'notification',
  actions: {
    send: {
      params: {
        userId: 'number',
        title: 'string',
        message: 'string'
      },
      async handler(ctx) {
        const result = await pool.query(
          'INSERT INTO notifications (user_id, title, message) VALUES ($1, $2, $3) RETURNING *',
          [ctx.params.userId, ctx.params.title, ctx.params.message]
        );
        return result.rows[0];
      }
    },
    list: {
      params: { userId: 'number' },
      async handler(ctx) {
        const result = await pool.query('SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC', [ctx.params.userId]);
        return result.rows;
      }
    }
  }
});

broker.createService({
  name: 'api',
  mixins: [ApiService],
  settings: {
    port: Number(process.env.NOTIFICATION_SERVICE_PORT || 3005),
    cors: true,
    routes: [{
      aliases: {
        'POST /notifications': 'notification.send',
        'GET /notifications/:userId': 'notification.list'
      }
    }]
  }
});

broker.start();
