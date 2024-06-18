const UserService = require("../services/user.service.js");

class UserController {
    async createUser(req, res) {
        try {
            const newUser = await UserService.createUser(req.body);
            res.status(201).json(newUser);
        } catch (error) {
            console.error("Error al crear un usuario", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async getUserById(req, res) {
        const userId = req.params.userId;

        try {
            const user = await UserService.getUserById(userId);
            res.json(user);
        } catch (error) {
            console.error("Error al obtener un usuario por ID", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async updateUser(req, res) {
        const userId = req.params.userId;
        const updatedData = req.body;

        try {
            const updatedUser = await UserService.updateUser(userId, updatedData);
            res.json(updatedUser);
        } catch (error) {
            console.error("Error al actualizar usuario", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async deleteUser(req, res) {
        const userId = req.params.userId;

        try {
            await UserService.deleteUser(userId);
            res.json({ message: "Usuario eliminado exitosamente" });
        } catch (error) {
            console.error("Error al eliminar usuario", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
}

module.exports = new UserController();
