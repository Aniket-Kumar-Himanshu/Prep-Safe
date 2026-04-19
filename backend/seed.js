import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import LearningModule from './src/models/LearningModule.js';
import EmergencyContact from './src/models/EmergencyContact.js';
import DrillResult from './src/models/DrillResult.js';
import DisasterType from './src/models/DisasterType.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Clear existing data
    await User.deleteMany({});
    await LearningModule.deleteMany({});
    await EmergencyContact.deleteMany({});
    await DrillResult.deleteMany({});
    await DisasterType.deleteMany({});

    // Create sample users
    const users = await User.create([
      {
        name: 'Admin User',
        email: 'admin@disasterprep.com',
        password: 'admin123',
        role: 'admin',
        school: 'Central Academy',
        region: 'North India',
      },
      {
        name: 'Teacher User',
        email: 'teacher@disasterprep.com',
        password: 'teacher123',
        role: 'teacher',
        school: 'Central Academy',
        region: 'North India',
      },
      {
        name: 'Student User',
        email: 'student@disasterprep.com',
        password: 'student123',
        role: 'student',
        school: 'Central Academy',
        region: 'North India',
      },
    ]);

    // Create sample modules
    await LearningModule.create([
      {
        title: 'Earthquake Safety Basics',
        disasterType: 'earthquake',
        description: 'Learn the fundamentals of earthquake safety and the Drop, Cover, Hold technique.',
        safetySteps: [
          {
            step: 1,
            description: 'Before - Secure heavy objects',
            illustration: '🪛',
          },
          {
            step: 2,
            description: 'During - Drop, Cover, Hold On',
            illustration: '🛡️',
          },
          {
            step: 3,
            description: 'After - Check for injuries',
            illustration: '👨‍⚕️',
          },
        ],
        quiz: [
          {
            question: 'What should you do during an earthquake indoors?',
            options: [
              'Drop, Cover, and Hold On',
              'Run outside',
              'Use the elevator',
              'Hide under furniture',
            ],
            correctAnswer: 0,
            explanation: 'Drop, Cover, and Hold On is the safest technique during earthquakes.',
          },
        ],
        estimatedTime: 15,
        difficulty: 'beginner',
        createdBy: users[1]._id,
      },
      {
        title: 'Fire Evacuation Procedures',
        disasterType: 'fire',
        description: 'Master fire safety and proper evacuation procedures.',
        safetySteps: [
          {
            step: 1,
            description: 'Alert others immediately',
            illustration: '🔔',
          },
          {
            step: 2,
            description: 'Evacuate using stairs',
            illustration: '🪜',
          },
          {
            step: 3,
            description: 'Crawl low under smoke',
            illustration: '🐕',
          },
        ],
        quiz: [
          {
            question: 'What is the best way to move through smoke?',
            options: [
              'Walk upright',
              'Run quickly',
              'Crawl low',
              'Hold your breath',
            ],
            correctAnswer: 2,
            explanation: 'Crawling low helps you avoid inhaling toxic smoke.',
          },
        ],
        estimatedTime: 15,
        difficulty: 'beginner',
        createdBy: users[1]._id,
      },
      {
        title: 'Flood Safety',
        disasterType: 'flood',
        description: 'Learn how to stay safe during flood situations.',
        safetySteps: [
          {
            step: 1,
            description: 'Move to higher ground quickly',
            illustration: '⬆️',
          },
          {
            step: 2,
            description: 'Never enter floodwaters',
            illustration: '⛔',
          },
          {
            step: 3,
            description: 'Wait for rescue assistance',
            illustration: '🆘',
          },
        ],
        quiz: [
          {
            question: 'What should you do if you are trapped during a flood?',
            options: [
              'Swim through the water',
              'Go to the highest floor and signal for help',
              'Stay in the basement',
              'Try to drive through the water',
            ],
            correctAnswer: 1,
            explanation: 'Going to the highest floor and signaling for help is the safest action.',
          },
        ],
        estimatedTime: 15,
        difficulty: 'beginner',
        createdBy: users[1]._id,
      },
    ]);

    // Create sample emergency contacts
    await EmergencyContact.create([
      {
        name: 'City Hospital',
        type: 'hospital',
        phone: '+91-9999-999-999',
        email: 'info@cityhospital.in',
        address: 'Main Street, City Center',
        region: 'North India',
      },
      {
        name: 'Fire Department',
        type: 'fire_department',
        phone: '101',
        email: 'fire@citydept.in',
        address: 'Fire Station, Industrial Area',
        region: 'North India',
      },
      {
        name: 'Police Department',
        type: 'police',
        phone: '100',
        email: 'police@citydept.in',
        address: 'Police Station, Downtown',
        region: 'North India',
      },
      {
        name: 'Disaster Helpline',
        type: 'helpline',
        phone: '1070',
        email: 'help@disaster.in',
        address: 'N/A',
        region: 'North India',
      },
    ]);

    // Create sample drill results
    await DrillResult.create([
      {
        userId: users[2]._id, // Student user
        drillType: 'earthquake',
        scenario: 'Virtual Simulation',
        userChoices: [
          { question: 'What do you do?', chosen: 'Drop, Cover, Hold', correct: true, isCorrect: true }
        ],
        score: 85,
        maxScore: 100,
        feedback: 'Good response. You handled the situation well.',
        duration: 300,
      },
      {
        userId: users[2]._id, // Student user
        drillType: 'fire',
        scenario: 'Virtual Simulation',
        userChoices: [
          { question: 'How do you evacuate?', chosen: 'Crawl low under smoke', correct: true, isCorrect: true }
        ],
        score: 92,
        maxScore: 100,
        feedback: 'Excellent response! You responded perfectly.',
        duration: 310,
      },
    ]);

    // Create disaster types
    await DisasterType.create([
      {
        name: 'earthquake',
        displayName: 'Earthquake',
        icon: '🌍',
        description: 'Earthquakes are sudden shaking of the ground caused by movements in Earth\'s crust. They can cause buildings to collapse and trigger tsunamis.',
        safetyTips: [
          { category: 'before', tip: 'Secure heavy furniture and objects to walls' },
          { category: 'before', tip: 'Prepare an emergency kit with supplies' },
          { category: 'before', tip: 'Identify safe spots in each room (under sturdy tables)' },
          { category: 'during', tip: 'Drop, Cover, and Hold On if indoors' },
          { category: 'during', tip: 'Stay away from windows, mirrors, and heavy objects' },
          { category: 'during', tip: 'If outdoors, move to an open area away from buildings' },
          { category: 'after', tip: 'Check for injuries and provide first aid' },
          { category: 'after', tip: 'Inspect home for damage and turn off utilities if damaged' },
          { category: 'after', tip: 'Expect aftershocks and be prepared to Drop, Cover, and Hold On' },
        ],
        emergencySupplies: ['Water (1 gallon per person per day)', 'Non-perishable food', 'First aid kit', 'Flashlight', 'Battery-powered radio', 'Extra batteries', 'Whistle', 'Dust masks', 'Wrench for gas lines'],
        warningSignals: ['Sudden shaking or trembling', 'Loud rumbling sound', 'Animals behaving strangely', 'Cracks appearing in walls or ground'],
        evacuationGuidelines: 'If indoors, stay inside until the shaking stops. Move away from windows and heavy furniture. If outdoors, move to an open area. After shaking stops, evacuate if building is damaged.',
        commonInRegions: ['Metro Manila', 'Calabarzon', 'Central Luzon', 'Bicol Region'],
        severity: 'high',
        isActive: true,
        createdBy: users[0]._id,
      },
      {
        name: 'fire',
        displayName: 'Fire',
        icon: '🔥',
        description: 'Fires can spread rapidly and produce toxic smoke. Quick evacuation and proper response are critical for survival.',
        safetyTips: [
          { category: 'before', tip: 'Install smoke alarms on every level of your home' },
          { category: 'before', tip: 'Plan and practice fire escape routes' },
          { category: 'before', tip: 'Keep fire extinguishers accessible' },
          { category: 'during', tip: 'Alert everyone immediately - shout "Fire!"' },
          { category: 'during', tip: 'Evacuate immediately using stairs, never elevators' },
          { category: 'during', tip: 'Crawl low under smoke to breathe cleaner air' },
          { category: 'during', tip: 'Feel doors before opening - if hot, find another way' },
          { category: 'after', tip: 'Call emergency services once safely outside' },
          { category: 'after', tip: 'Never re-enter a burning building' },
          { category: 'after', tip: 'Seek medical attention for smoke inhalation or burns' },
        ],
        emergencySupplies: ['Fire extinguisher', 'Smoke alarms', 'Escape ladder', 'Emergency contact list', 'Flashlight', 'First aid kit'],
        warningSignals: ['Smell of smoke', 'Crackling sounds', 'Heat from walls or doors', 'Smoke alarms sounding'],
        evacuationGuidelines: 'Leave immediately via the nearest safe exit. Do not stop to gather belongings. Meet at a designated meeting point outside. Call 911 once safe.',
        commonInRegions: ['Metro Manila', 'Cebu City', 'Davao City', 'Urban areas nationwide'],
        severity: 'critical',
        isActive: true,
        createdBy: users[0]._id,
      },
      {
        name: 'flood',
        displayName: 'Flood',
        icon: '🌊',
        description: 'Flooding occurs when water overflows onto normally dry land. It can be caused by heavy rain, storm surge, or dam failure.',
        safetyTips: [
          { category: 'before', tip: 'Know your flood risk and evacuation routes' },
          { category: 'before', tip: 'Prepare an emergency kit with waterproof containers' },
          { category: 'before', tip: 'Move important items to higher floors' },
          { category: 'during', tip: 'Move to higher ground immediately' },
          { category: 'during', tip: 'Never walk or drive through floodwaters' },
          { category: 'during', tip: 'Turn off electricity if water is rising in your home' },
          { category: 'after', tip: 'Wait for official all-clear before returning home' },
          { category: 'after', tip: 'Avoid floodwater - it may be contaminated' },
          { category: 'after', tip: 'Document damage with photos for insurance' },
        ],
        emergencySupplies: ['Waterproof bags', 'Life jackets', 'Rope', 'Whistle', 'Water purification tablets', 'Emergency radio', 'Waterproof flashlight'],
        warningSignals: ['Flash flood warnings', 'Rapidly rising water', 'Muddy or debris-filled water', 'Unusual river sounds'],
        evacuationGuidelines: 'When flood warning issued, move to higher ground immediately. If trapped, go to highest floor or roof. Signal for help. Never attempt to walk or drive through floodwater.',
        commonInRegions: ['Metro Manila', 'Pampanga', 'Bulacan', 'Cagayan Valley', 'Mindanao'],
        severity: 'high',
        isActive: true,
        createdBy: users[0]._id,
      },
      {
        name: 'cyclone',
        displayName: 'Typhoon/Cyclone',
        icon: '🌀',
        description: 'Typhoons are powerful tropical storms with strong winds and heavy rainfall that can cause widespread destruction.',
        safetyTips: [
          { category: 'before', tip: 'Monitor weather forecasts and warnings' },
          { category: 'before', tip: 'Secure outdoor items and board up windows' },
          { category: 'before', tip: 'Stock up on food, water, and emergency supplies' },
          { category: 'during', tip: 'Stay indoors away from windows' },
          { category: 'during', tip: 'Go to the lowest floor or interior room' },
          { category: 'during', tip: 'Listen to emergency broadcasts for updates' },
          { category: 'after', tip: 'Wait for all-clear before going outside' },
          { category: 'after', tip: 'Watch for flooding and downed power lines' },
          { category: 'after', tip: 'Report gas leaks and electrical damage' },
        ],
        emergencySupplies: ['Water (7-day supply)', 'Non-perishable food', 'Battery-powered radio', 'Flashlights', 'First aid kit', 'Medications', 'Important documents in waterproof container'],
        warningSignals: ['PAGASA typhoon warnings', 'Dark clouds and strong winds', 'Rapidly dropping air pressure', 'Coastal storm surge'],
        evacuationGuidelines: 'Evacuate when ordered by authorities. Move to designated evacuation centers. If unable to evacuate, shelter in a sturdy building away from windows and doors.',
        commonInRegions: ['Bicol Region', 'Eastern Visayas', 'Cagayan Valley', 'Northern Luzon'],
        severity: 'critical',
        isActive: true,
        createdBy: users[0]._id,
      },
    ]);

    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
