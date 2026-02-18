// Test XAMPP MySQL connection
require('dotenv').config();
const mysql = require('mysql2/promise');

async function testConnection() {
  try {
    console.log('🔍 Testing XAMPP MySQL connection...');
    console.log('📊 Database URL:', process.env.DATABASE_URL);
    
    // Parse DATABASE_URL
    const dbUrl = process.env.DATABASE_URL;
    const match = dbUrl.match(/mysql:\/\/([^:]+):([^@]*)@([^:]+):(\d+)\/(.+)/);
    
    if (!match) {
      throw new Error('Invalid DATABASE_URL format');
    }
    
    const [, user, password, host, port, database] = match;
    
    // Test database connection
    const connection = await mysql.createConnection({
      host,
      port: parseInt(port),
      user,
      password: password || undefined,
      database
    });
    
    console.log('✅ Successfully connected to MySQL database!');
    
    // Test a simple query
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('✅ Database query test passed:', rows);
    
    await connection.end();
    
    console.log('');
    console.log('🎉 XAMPP MySQL connection is working perfectly!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Run: npm run db:generate (to generate Prisma client)');
    console.log('2. Run: npm run db:push (to create tables)');
    console.log('3. Run: npm run db:seed (to add sample data)');
    console.log('4. Run: npm run server:full:dev (to start backend)');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('1. Make sure XAMPP is running');
    console.log('2. Start MySQL service in XAMPP');
    console.log('3. Create database "nutridash" in phpMyAdmin');
    console.log('4. Check DATABASE_URL in .env file');
    console.log('   Current: mysql://root:@localhost:3306/nutridash');
  }
}

testConnection();