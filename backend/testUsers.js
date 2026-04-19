import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

async function testUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✓ MongoDB connected');

    // Fetch all users
    const users = await User.find().select('-password');
    console.log('\n=== User List ===');
    console.log(`Total users: ${users.length}\n`);

    if (users.length === 0) {
      console.log('⚠️  No users found in the database!');
      console.log('\nTo add users, run: cd backend && node seed.js');
    } else {
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   School: ${user.school || 'N/A'}`);
        console.log('');
      });
    }

    // Close connection
    await mongoose.connection.close();
    console.log('✓ Connection closed');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testUsers();
