import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

// Define interface for authenticated request
interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    role: 'verifier' | 'admin';
  };
}

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

export const register = async (req: Request, res: Response) => {
  const { username, email, password, role } = req.body;

  // Validate input
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Only allow admin users to be created by existing admins
    let userRole = role;
    if (role === 'admin') {
      // Check if request has admin token
      const token = req.headers.authorization?.split(' ')[1];
      if (token) {
        try {
          const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
          if (decoded.role !== 'admin') {
            userRole = 'verifier'; // Default to verifier if not an admin
          }
        } catch (err) {
          userRole = 'verifier'; // Default to verifier on token verification failure
        }
      } else {
        userRole = 'verifier'; // Default to verifier if no token
      }
    }

    const user = new User({
      username,
      email,
      password: hashedPassword,
      role: userRole,
    });

    await user.save();
    
    // Don't return the password
    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    };
    
    res.status(201).json({ message: 'User registered successfully', user: userResponse });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({ 
      token, 
      user: { 
        id: user._id,
        username: user.username, 
        email: user.email,
        role: user.role 
      } 
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Add methods for user management (admin only)
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteUser = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  
  try {
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Prevent self-deletion
    if (user._id.toString() === req.user?.userId) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }
    
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateUserRole = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { role } = req.body;
  
  if (role !== 'admin' && role !== 'verifier') {
    return res.status(400).json({ message: 'Invalid role' });
  }
  
  try {
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Prevent changing own role
    if (user._id.toString() === req.user?.userId) {
      return res.status(400).json({ message: 'Cannot change your own role' });
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      id, 
      { role }, 
      { new: true }
    ).select('-password');
    
    res.status(200).json({ message: 'User role updated', user: updatedUser });
  } catch (err) {
    console.error('Error updating user role:', err);
    res.status(500).json({ error: 'Server error' });
  }
};