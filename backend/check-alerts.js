import mongoose from 'mongoose';
import Alert from './src/models/Alert.js';

async function checkAlerts() {
  try {
    await mongoose.connect('mongodb://localhost:27017/disaster-prep');
    console.log('Connected to MongoDB');
    
    const alerts = await Alert.find().sort({ createdAt: -1 }).limit(5);
    console.log('\n📋 Recent Alerts:');
    console.log(JSON.stringify(alerts, null, 2));
    
    console.log(`\n✓ Total alerts in database: ${await Alert.countDocuments()}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkAlerts();
