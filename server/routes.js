import express from 'express';
const router = express.Router(); // Create a new router instance
import { Products } from 'plaid';
import { plaidClient } from './server.js';
import {EU_COUNTRY_CODES} from './static_data.js';

// State to store the access token (In a real app, this should be stored securely in a database)
let ACCESS_TOKEN = null;

// Utility function for pausing execution
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Endpoint to create a Plaid Link Token
 */
router.post('/create_link_token', async (req, res) => {
  try {
    const linkTokenConfig = {
      user: { client_user_id: 'user-id-' + Date.now() },
      client_name: 'FinSight',
      products: [Products.Transactions],
      // Use the corrected array of string country codes
      country_codes: EU_COUNTRY_CODES,
      language: 'en',
      // The redirect URI is often optional for sandbox/development, 
      // redirect_uri: 'http://localhost:3000', 
    };

    const createTokenResponse = await plaidClient.linkTokenCreate(linkTokenConfig);
    res.json(createTokenResponse.data);
  } catch (error) {
    // UPDATED LOGGING: Log the full error response from Plaid if available
    const errorDetails = error.response?.data ? JSON.stringify(error.response.data, null, 2) : error.message;
    console.error('Error creating link token:', errorDetails);
    // Send a 500 status back to the frontend to signal failure
    res.status(500).json({ error: 'Failed to create link token. Check server logs and Plaid API keys.' });
  }
});

/**
 * Endpoint to exchange a public token for an access token
 */
router.post('/exchange_public_token', async (req, res) => {
  const { public_token } = req.body;
  if (!public_token) {
    return res.status(400).json({ error: 'Missing public_token' });
  }

  try {
    // 1. Exchange public token for access token
    const exchangeResponse = await plaidClient.itemPublicTokenExchange({ public_token });
    ACCESS_TOKEN = exchangeResponse.data.access_token;
    const item_id = exchangeResponse.data.item_id;

    const MAX_RETRIES = 3;
    const RETRY_DELAY_MS = 1500;
    let transactionsResponse = null;

    // 2. Fetch Transactions with retry logic for PRODUCT_NOT_READY
    for (let i = 0; i < MAX_RETRIES; i++) {
      try {
        const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const endDate = new Date().toISOString().split('T')[0];

        transactionsResponse = await plaidClient.transactionsGet({
          access_token: ACCESS_TOKEN,
          start_date: startDate,
          end_date: endDate,
          options: { count: 100 }
        });
        
        // Success: break the retry loop
        break; 

      } catch (error) {
        // Check if the error is the PRODUCT_NOT_READY error
        if (error.response?.data?.error_code === 'PRODUCT_NOT_READY' && i < MAX_RETRIES - 1) {
          console.log(`[Attempt ${i + 1}/${MAX_RETRIES}] Product not ready. Retrying in ${RETRY_DELAY_MS / 1000}s...`);
          await sleep(RETRY_DELAY_MS);
        } else {
          // If it's a different error, or the last retry failed, throw the error
          throw error;
        }
      }
    }

    // Check if transactions were successfully retrieved after the loop
    if (!transactionsResponse) {
        throw new Error("Failed to retrieve transactions after all retries.");
    }

    // Format transactions for the frontend
    const formattedTransactions = transactionsResponse.data.transactions.map(t => ({
      id: t.transaction_id,
      date: t.date,
      merchant: t.merchant_name || t.name,
      original_description: t.name,
      amount: t.amount,
      // FIX: Defensively check if t.category is an array with elements before accessing index [0]
      category: (t.category && t.category.length > 0) ? t.category[0] : 'Uncategorized', 
      method: t.payment_channel, // Simplified mapping for demo
    }));

    res.json({
      access_token: ACCESS_TOKEN,
      item_id: item_id,
      transactions: formattedTransactions,
    });

  } catch (error) {
    // UPDATED LOGGING: Log the full error response from Plaid if available
    const errorDetails = error.response?.data ? JSON.stringify(error.response.data, null, 2) : error.message;
    console.error('Error exchanging token or fetching transactions:', errorDetails);
    res.status(500).json({ error: 'Failed to process token exchange or transaction retrieval.' });
  }
});


/**
 * Endpoint to GEMINI Key
 */
router.get('/ai_key', async (req, res) => {
  try {
    res.send(process.env.GEMINI_Key);
  } catch (error) {   
    console.error('Error creating link token:', error);
    // Send a 500 status back to the frontend to signal failure
    res.status(500).json({ error: 'Failed to create AI info.' });
  }
});

// Export the router to be used in server.js
export { router as routes };