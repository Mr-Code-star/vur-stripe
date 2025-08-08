import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Stripe from 'stripe';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: [
    process.env.CLIENT_URL,
    'http://localhost:5173',
    'http://127.0.0.1:5173'
  ],
}))

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// GET /api/prices -> lista de precios
app.get('/api/prices', async (req, res) => {
  try {
    const prices = await stripe.prices.list();
    // (Opcional) ordenar de menor a mayor
    prices.data.sort((a, b) => (a.unit_amount ?? 0) - (b.unit_amount ?? 0));
    res.json(prices.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Cannot list prices' });
  }
});

// POST /api/checkout -> crea la sesión de checkout
app.post('/api/checkout', async (req, res) => {
  try {
    const { priceId } = req.body;

    if (!priceId) {
      return res.status(400).json({ error: 'priceId is required' });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        { price: priceId, quantity: 1 }
      ],
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/pricing`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Cannot create checkout session' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend on http://localhost:${PORT}`));
