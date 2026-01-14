import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    
    console.log('Registration request body:', { firstName, lastName, email, password: '***' });

    if (!firstName || !lastName || !email || !password) {
      console.log('Missing fields:', { firstName: !!firstName, lastName: !!lastName, email: !!email, password: !!password });
      return res.status(400).json({ message: 'All fields are required' });
    }

    const userExists = await User.findOne({ email });
    console.log('User exists check:', userExists ? 'Yes' : 'No');
    
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    // Hash password explicitly before creating user
    console.log('Hashing password explicitly...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log('Password hashed successfully:', hashedPassword.substring(0, 20) + '...');

    console.log('Creating new user with hashed password...');
    const user = await User.create({ firstName, lastName, email, password: hashedPassword });
    console.log('User created successfully:', user._id);
    console.log('Stored password after creation:', user.password.substring(0, 20) + '...');
    console.log('Password starts with $2b$:', user.password.startsWith('$2b$'));
  
    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      email: user.email,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (user) {
      console.log('Stored password hash:', user.password);
      console.log('Input password:', password);
      
      const isMatch = await user.comparePassword(password);
      console.log('Password match:', isMatch ? 'Yes' : 'No');
      
      if (isMatch) {
        res.json({
          _id: user._id,
          firstName: user.firstName,
          email: user.email,
          token: generateToken(user._id)
        });
      } else {
        res.status(401).json({ message: 'Invalid email or password' });
      }
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};