import User from '../db/models/user.model';
import mongoDB from '../db/mongodb';
import {encryptText} from '@/utils/encryption';

type UserType = {
  name: string;
  email: string;
  password: string;
  billingCycle: string;
  selectedPlan: string;
};

export async function createUser({name, email, password, billingCycle, selectedPlan}: UserType) {
  await mongoDB.connect();

  // Input validation
  if (!name || !email || !password || !billingCycle || !selectedPlan) {
    throw new Error('All fields (name, email, password, billingCycle, selectedPlan) are required.');
  }

  // Check if the user already exists
  const existingUser = await User.findOne({email});
  if (existingUser) {
    throw new Error('A user with this email already exists.');
  }

  // Encrypt the password
  const encryptedPassword = encryptText(password);

  // Create new user
  const user = new User({
    name,
    email,
    password: encryptedPassword,
    billingCycle,
    selectedPlan,
  });

  await user.save();

  return JSON.parse(JSON.stringify(user));
}
