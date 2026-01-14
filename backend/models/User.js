import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  profile: {
    avatar: String,
    bio: String,
    skills: [String]
  }
}, { timestamps: true });

// Hash password before saving - DISABLED since we hash explicitly in controller
// userSchema.pre('save', function(next) {
//   // Pre-save middleware disabled to avoid timing issues
//   return next();
// });

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;