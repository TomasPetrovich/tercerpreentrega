const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ticketSchema = new Schema({
    code: { type: String, required: true, unique: true },
    purchase_datetime: { type: Date, default: Date.now },
    amount: { type: Number, required: true },
    purchaser: { type: String, required: true }
});


const TicketModel = mongoose.model('Ticket', ticketSchema);

module.exports = TicketModel;
