const UserModel = require("../models/user.model.js");
const CartService = require("./cart.service.js");
const { createHash } = require("../utils/hashbcrypt.js");

class UserService {
    async registerUser({ first_name, last_name, email, age, password }) {
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            throw new Error("Usuario ya registrado");
        }

        const nuevoCarrito = await CartService.createCart();
        const newUser = new UserModel({
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            cart: nuevoCarrito._id
        });

        await newUser.save();
        return newUser;
    }

    async findUserByEmail(email) {
        return await UserModel.findOne({ email });
    }

    async findUserById(id) {
        return await UserModel.findById(id);
    }
}

module.exports = new UserService();
