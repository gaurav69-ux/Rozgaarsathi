const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/user');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const createAdmin = async () => {
    const args = process.argv.slice(2);

    if (args.length < 3) {
        console.log('Usage: node server/scripts/createAdmin.js <email> <password> <name>');
        process.exit(1);
    }

    const [email, password, name] = args;

    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB...');

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.error('Error: User already exists with this email');
            process.exit(1);
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create admin user
        const adminUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'admin',
            isVerified: true
        });

        console.log('Admin user created successfully:');
        console.log('ID:', adminUser._id);
        console.log('Name:', adminUser.name);
        console.log('Email:', adminUser.email);
        console.log('Role:', adminUser.role);

        process.exit(0);
    } catch (error) {
        console.error('Error creating admin user:', error.message);
        process.exit(1);
    }
};

createAdmin();
