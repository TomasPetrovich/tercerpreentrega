const TicketModel = require('../models/ticket.model');

class TicketService {
    async createTicket(ticketData) {
        const ticket = new TicketModel(ticketData);
        return await ticket.save();
    }
}

module.exports = new TicketService();
