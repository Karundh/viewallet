// server.js
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')('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'); // Pon tu clave secreta de Stripe

const app = express();

// Permite peticiones desde tu frontend servido en estos orígenes
app.use(cors({
  origin: ['http://viewallet.shop', 'http://viewallet.shop']
}));

app.use(express.json());

app.post('/create-checkout-session', async (req, res) => {
  try {
    const { items } = req.body;
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'Items inválidos' });
    }

    const line_items = items.map(item => ({
      price: item.priceId,
      quantity: item.quantity,
    }));

   const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  mode: 'payment',
  line_items,
  success_url: 'http://viewallet.shop/success.html',
  cancel_url: 'http://viewallet.shop/shop.html',
  allow_promotion_codes: true,  // <-- Esto es clave
});
    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creando sesión Stripe:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://viewallet.shop:${PORT}`);
});
