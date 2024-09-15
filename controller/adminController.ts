import mongoose from "mongoose";
import userSchema from "../models/userSchema";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; // For generating a JWT token

// Define a secret key for JWT (make sure to store this securely, not in your codebase)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const login = async (req: any, res: any) => {
    try {
        const { contact, password } = req.body;

        if (!contact || !password) {
            return res.status(400).json({ error: 'Contact and password are required' });
        }

        // Find the user by contact
        const user = await userSchema.findOne({ contact , role: 'ADMIN'}).exec();

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check if the password is correct
        const isMatch = await bcrypt.compare(password, user.password as string);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check for admin role
        if (user.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Access denied' });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: '1h' } // Token expiration time
        );

        // Send response with token and user details
        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                contact: user.contact,
                role: user.role
            }
        });

    } catch (error: any) {
        console.error(error.message);
        res.status(500).send({ message: "Internal Server Error" });
    }
}

export const approveUser = async (req: any, res: any) => {
    try {
        // Extract the user ID from request parameters
        const { userId } = req.body;

        // Validate that the user ID is provided
        if (!userId || !userId) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        // Optionally, you could verify the requestor's role here if needed
        // Example: Check if the requester has the admin role
        
        // Find the user by ID and update their status to APPROVED
        const updatedUser = await userSchema.findByIdAndUpdate(
            {_id: new mongoose.Types.ObjectId(userId)},
            { status: 'APPROVED' },
            { new: true } // Return the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Send response with updated user details
        res.status(200).json({
            message: 'User approved successfully',
            user: updatedUser
        });

    } catch (error: any) {
        console.error(error.message);
        res.status(500).send({ message: "Internal Server Error" });
    }
}
