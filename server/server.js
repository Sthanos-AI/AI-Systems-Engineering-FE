import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import {routes} from './routes.js';
import { Configuration, PlaidEnvironments, PlaidApi } from 'plaid';
// Load environment variables from .env file
import dotenv from 'dotenv'
dotenv.config();
const app = express();

// Plaid API Configuration
const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    },
  },
});

export const plaidClient = new PlaidApi(configuration);

// Middleware
app.use(cors({ origin: '*' })); // Allow React app to connect
app.use(bodyParser.json());
app.use('/api', routes); 

app.listen(process.env.PORT, (err) => {
   if (err) {
    console.error("Failed to start server:", err);
    return;
  }
  console.log(`FinSight Backend Server running on http://localhost:${process.env.PORT}`);
  if (process.env.PLAID_CLIENT_ID === 'MOCK_PLAID_CLIENT_ID') {
    console.warn("WARNING: Plaid environment variables are mocked. Connect Bank button will use mock data.");
  }
});