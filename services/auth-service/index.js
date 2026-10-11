const { ServiceBroker } = require('moleculer');
const ApiService = require('moleculer-web');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@database-1.cbim040e44mj.ap-south-1.rds.amazonaws.com:5432/postgres',
  ssl: process.env.DATABASE_URL?.includes('localhost') ? false : { rejectUnauthorized: false }
});

const broker = new ServiceBroker({
  namespace: 'fruit-market',
  nodeID: 'auth-service',
  transporter: 'TCP',
  logger: true,
  logLevel: 'info'
});

broker.createService({
  name: 'auth',
  actions: {
    register: {
      params: {
        name: 'string',
        email: 'string',
        password: 'string',
        role: { type: 'string', optional: true }
      },
      async handler(ctx) {
        const { name, email, password, role = 'customer' } = ctx.params;
        const passwordHash = await bcrypt.hash(password, 10);
        const result = await pool.query(
          'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
          [name, email, passwordHash, role]
        );
        const user = result.rows[0];
        const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' });
        return { user, token };
      }
    },
    login: {
      params: {
        email: 'string',
        password: 'string'
      },
      async handler(ctx) {
        const { email, password } = ctx.params;
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];
        if (!user) throw new Error('Invalid email or password');
        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) throw new Error('Invalid email or password');

        const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' });
        return {
          user: { id: user.id, name: user.name, email: user.email, role: user.role },
          token
        };
      }
    },
    me: {
      params: { token: 'string' },
      async handler(ctx) {
        const { token } = ctx.params;
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
        const result = await pool.query('SELECT id, name, email, role FROM users WHERE id = $1', [decoded.sub]);
        return result.rows[0];
      }
    }
  }
});

broker.createService({
  name: 'api',
  mixins: [ApiService],
  settings: {
    port: Number(process.env.AUTH_SERVICE_PORT || 3001),
    cors: true,
    routes: [{
      aliases: {
        'POST /auth/register': 'auth.register',
        'POST /auth/login': 'auth.login',
        'POST /auth/me': 'auth.me'
      }
    }]
  }
});

broker.start();
