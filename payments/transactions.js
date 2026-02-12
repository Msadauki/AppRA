// payments/transactions.js
const admin = require('../firebase/firebaseConfig');

/**
 * Log a payment transaction to Firebase
 * @param {string} userId - ID of the user making payment
 * @param {string} appId - App purchased
 * @param {string} method - Payment method e.g., "Paystack" | "Stripe"
 * @param {string} reference - Payment reference ID
 * @param {number} amount - Amount paid
 * @param {string} currency - Currency code e.g., "NGN", "USD"
 */
async function logTransaction(userId, appId, method, reference, amount, currency) {
    try {
        const ref = admin.database().ref('transactions');
        const transaction = {
            userId,
            appId,
            method,
            reference,
            amount,
            currency,
            timestamp: Date.now(),
            status: "pending" // default until confirmed by payment gateway
        };
        await ref.push(transaction);
        console.log(`Transaction logged: ${reference} for user ${userId}`);
        return transaction;
    } catch (error) {
        console.error("Error logging transaction:", error);
        throw error;
    }
}

/**
 * Confirm transaction after payment gateway callback
 * @param {string} reference - Payment reference
 * @param {boolean} success - True if payment succeeded
 */
async function confirmTransaction(reference, success = true) {
    try {
        const ref = admin.database().ref('transactions');
        const snapshot = await ref.orderByChild('reference').equalTo(reference).once('value');
        const data = snapshot.val();

        if (!data) throw new Error("Transaction not found");

        const key = Object.keys(data)[0];
        await ref.child(key).update({
            status: success ? "success" : "failed",
            confirmedAt: Date.now()
        });

        console.log(`Transaction ${reference} confirmed: ${success ? "success" : "failed"}`);
        return { reference, status: success ? "success" : "failed" };
    } catch (error) {
        console.error("Error confirming transaction:", error);
        throw error;
    }
}

/**
 * Fetch all transactions (optional, for admin or AI)
 */
async function fetchTransactions() {
    try {
        const ref = admin.database().ref('transactions');
        const snapshot = await ref.once('value');
        return snapshot.val() || {};
    } catch (error) {
        console.error("Error fetching transactions:", error);
        return {};
    }
}

module.exports = { logTransaction, confirmTransaction, fetchTransactions };