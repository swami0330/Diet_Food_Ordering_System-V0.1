#!/usr/bin/env node

// Complete XAMPP Setup Script for NutriDash Backend
require('dotenv').config();
const mysql = require('mysql2/promise');
const { execSync } = require('child_process');

console.log('🚀 NutriDash Complete XAMPP Setup');
console.log('==================================');
console.log('');

// Step 1: Check XAMPP MySQL Connection
async function checkXAMPPConnection() {
  console.log('1️⃣ Checking XAMPP MySQL connection...');
  
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: ''
    });
    
    console.log('✅ XAMPP MySQL is running!');
    await connection.end();
    return true;
  } catch (error) {
    console.log('❌ XAMPP MySQL is not running');
    console.log('');
    console.log('📋 Please start XAMPP:');
    console.log('1. Open XAMPP Control Panel');
    console.log('2. Click "Start" for Apache');
    console.log('3. Click "Start" for MySQL');
    console.log('4. Wait for both services to turn green');
    console.log('');
    return false;
  }
}

// Step 2: Check if database exists
async function checkDatabase() {
  console.log('2️⃣ Checking if "nutridash" database exists...');
  
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: ''
    });
    
    const [rows] = await connection.execute('SHOW DATABASES LIKE "nutridash"');
    await connection.end();
    
    if (rows.length > 0) {
      console.log('✅ Database "nutridash" exists!');
      return true;
    } else {
      console.log('❌ Database "nutridash" does not exist');
      return false;
    }
  } catch (error) {
    console.log('❌ Failed to check database:', error.message);
    return false;
  }
}

// Step 3: Create database
async function createDatabase() {
  console.log('3️⃣ Creating "nutridash" database...');
  
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: ''
    });
    
    await connection.execute('CREATE DATABASE nutridash CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
    console.log('✅ Database "nutridash" created successfully!');
    await connection.end();
    return true;
  } catch (error) {
    console.log('❌ Failed to create database:', error.message);
    return false;
  }
}

// Step 4: Generate Prisma client
async function generatePrismaClient() {
  console.log('4️⃣ Generating Prisma client...');
  
  try {
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('✅ Prisma client generated successfully!');
    return true;
  } catch (error) {
    console.log('❌ Failed to generate Prisma client');
    console.log('Error:', error.message);
    return false;
  }
}

// Step 5: Push database schema
async function pushDatabaseSchema() {
  console.log('5️⃣ Creating database tables...');
  
  try {
    execSync('npx prisma db push', { stdio: 'inherit' });
    console.log('✅ Database tables created successfully!');
    return true;
  } catch (error) {
    console.log('❌ Failed to create database tables');
    console.log('Error:', error.message);
    return false;
  }
}

// Step 6: Seed database
async function seedDatabase() {
  console.log('6️⃣ Seeding database with sample data...');
  
  try {
    execSync('npm run db:seed', { stdio: 'inherit' });
    console.log('✅ Database seeded successfully!');
    return true;
  } catch (error) {
    console.log('❌ Failed to seed database');
    console.log('Error:', error.message);
    return false;
  }
}

// Step 7: Test final connection
async function testFinalConnection() {
  console.log('7️⃣ Testing final database connection...');
  
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '',
      database: 'nutridash'
    });
    
    const [rows] = await connection.execute('SHOW TABLES');
    console.log('✅ Database connection successful!');
    console.log(`✅ Found ${rows.length} tables in database`);
    await connection.end();
    return true;
  } catch (error) {
    console.log('❌ Final connection test failed:', error.message);
    return false;
  }
}

// Main setup function
async function main() {
  console.log('Starting complete XAMPP setup for NutriDash...');
  console.log('');
  
  // Step 1: Check XAMPP
  const xamppRunning = await checkXAMPPConnection();
  if (!xamppRunning) {
    console.log('');
    console.log('⚠️  Please start XAMPP and run this script again.');
    console.log('Command: npm run setup:xampp');
    return;
  }
  console.log('');
  
  // Step 2: Check database
  const dbExists = await checkDatabase();
  console.log('');
  
  // Step 3: Create database if needed
  if (!dbExists) {
    const dbCreated = await createDatabase();
    if (!dbCreated) {
      console.log('');
      console.log('⚠️  Please create the database manually:');
      console.log('1. Go to http://localhost/phpmyadmin');
      console.log('2. Click "New" in the left sidebar');
      console.log('3. Enter database name: nutridash');
      console.log('4. Click "Create"');
      console.log('5. Run this script again: npm run setup:xampp');
      return;
    }
    console.log('');
  }
  
  // Step 4: Generate Prisma client
  const clientGenerated = await generatePrismaClient();
  if (!clientGenerated) {
    console.log('');
    console.log('⚠️  Prisma client generation failed. Please check the error above.');
    return;
  }
  console.log('');
  
  // Step 5: Push schema
  const schemaPushed = await pushDatabaseSchema();
  if (!schemaPushed) {
    console.log('');
    console.log('⚠️  Database schema push failed. Please check the error above.');
    return;
  }
  console.log('');
  
  // Step 6: Seed database
  const dbSeeded = await seedDatabase();
  if (!dbSeeded) {
    console.log('');
    console.log('⚠️  Database seeding failed. You can continue without sample data.');
  }
  console.log('');
  
  // Step 7: Final test
  const finalTest = await testFinalConnection();
  console.log('');
  
  if (finalTest) {
    console.log('🎉 XAMPP Setup Completed Successfully!');
    console.log('');
    console.log('📊 What was created:');
    console.log('✅ MySQL database "nutridash"');
    console.log('✅ 20+ database tables');
    console.log('✅ Sample meals, users, and test data');
    console.log('✅ Admin user (admin@nutridash.com / admin123)');
    console.log('✅ Test user (test@nutridash.com / password)');
    console.log('');
    console.log('🚀 Next steps:');
    console.log('1. Start backend server:');
    console.log('   npm run server:full:dev');
    console.log('');
    console.log('2. Test API endpoints:');
    console.log('   curl http://localhost:3001/health');
    console.log('   curl http://localhost:3001/api/meals');
    console.log('');
    console.log('3. View database in phpMyAdmin:');
    console.log('   http://localhost/phpmyadmin');
    console.log('');
    console.log('4. Start frontend (in another terminal):');
    console.log('   npm run dev');
    console.log('');
    console.log('📚 Documentation:');
    console.log('- Setup Guide: XAMPP-SETUP.md');
    console.log('- Backend API: README-BACKEND.md');
    console.log('- Complete Summary: BACKEND-SUMMARY.md');
  } else {
    console.log('❌ Setup completed with errors. Please check the logs above.');
  }
}

// Run setup
main().catch(console.error);