const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { CreateUserDTO, UserResponseDTO } = require('../dtos/UserDTO');
const userRepository = require('../repositories/userRepository');
require('dotenv').config();

class AuthController {
    async register(req, res, next) {
        try {
            const userDTO = new CreateUserDTO(req.body);
            const userModel = userDTO.toModel();
            
            try {
                userModel.validate();
            } catch (error) {
                error.statusCode = 400;
                return next(error);
            }

            const existingUser = await userRepository.findByUsername(userModel.username);
            if (existingUser) {
                const error = new Error('Username already exists');
                error.statusCode = 400;
                return next(error);
            }

            const existingEmail = await userRepository.findByEmail(userModel.email);
            if (existingEmail) {
                const error = new Error('Email already exists');
                error.statusCode = 400;
                return next(error);
            }

            const salt = await bcrypt.genSalt(10);
            userModel.password = await bcrypt.hash(userModel.password, salt);

            const user = await userRepository.create(userModel);
            
            const token = jwt.sign(
                { id: user.id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.status(201).json({
                user: UserResponseDTO.fromModel(user),
                token
            });
        } catch (error) {
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                const error = new Error('Username and password are required');
                error.statusCode = 400;
                return next(error);
            }

            const user = await userRepository.findByUsername(username);
            if (!user) {
                const error = new Error('Invalid credentials');
                error.statusCode = 401;
                return next(error);
            }

            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                const error = new Error('Invalid credentials');
                error.statusCode = 401;
                return next(error);
            }

            const token = jwt.sign(
                { id: user.id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                user: UserResponseDTO.fromModel(user),
                token
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AuthController(); 