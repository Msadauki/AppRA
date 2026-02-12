// payments/paystack.js
const axios = require('axios');
require('dotenv').config();

async function verifyPaystackPayment(reference) {
    const res = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
        headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET}` }
    });
    return res.data;
}

module.exports = { verifyPaystackPayment };