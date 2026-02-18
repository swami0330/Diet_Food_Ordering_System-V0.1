#!/usr/bin/env node

// XAMPP Setup Script for NutriDash Backend
require('dotenv').config();
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 NutriDash XAMPP Setup Script');
console.log('================================');
console.log('');

// Check if XAMPP is running
async function checkXAMPP() {
  console.log('1️⃣ Checking XAMPP status...');
  
  try {
    // Try to connect to MySQL
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    await prisma.$connect();
    console.log('✅ XAMPP MySQL is running!');
    await prisma.$disconnect();
    return true;
  } catch (error) {
    console.log('❌ XAMPP MySQL is not running or database not created');
    console.log('');
    console.log('📋 Please follow these steps:');
    console.log('1. Start XAMPP Control Panel');
    console.log('2. Start Apache service');
    console.log('3. Start MySQL service');
    console.log('4. Open phpMyAdmin: http://localhost/phpmyadmin');
    console.log('5. Create database "nutridash"');
    console.log('');
    return false;
  }
}

// Generate Prisma client
async function generatePrisma() {
  console.log('2️⃣ Generating Prisma client...');
  
  try {
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('✅ Prisma client generated successfully!');
    return true;
  } catch (error) {
    console.log('❌ Failed to generate Prisma client');
    return false;
  }
}

// Push database schema
async function pushSchema() {
  console.log('3️⃣ Creating database tables...');
  
  try {
    execSync('npx prisma db push', { stdio: 'inherit' });
    console.log('✅ Database tables created successfully!');
    return true;
  } catch (error) {
    console.log('❌ Failed to create database tables');
    console.log('Make sure the "nutridash" database exists in phpMyAdmin');
    return false;
  }
}

// Seed database
async function seedDatabase() {
  console.log('4️⃣ Seeding database with sample data...');
  
  try {
    execSync('npm run db:seed', { stdio: 'inherit' });
    console.log('✅ Database seeded successfully!');
    return true;
  } catch (error) {
    console.log('❌ Failed to seed database');
    return false;
  }
}

// Test backend server
async function testServer() {
  console.log('5️⃣ Testing backend server...');
  
  try {
    // Start server in background for testing
    const { spawn } = require('child_process');
    const server = spawn('node', ['server/index.js'], { 
      stdio: 'pipe',
      env: { ...process.env, NODE_ENV: 'test' }
    });
    
    // Wait for server to start
    await new Promise((resolve) => setTimeout(resolve, 3000));
    
    // Test health endpoint
    const response = await fetch('http://localhost:3001/health');
    const data = await response.json();
    
    if (data.status === 'OK') {
      console.log('✅ Backend server is working!');
      server.kill();
      return true;
    } else {
      console.log('❌ Backend server health check failed');
      server.kill();
      return false;
    }
  } catch (error) {
    console.log('❌ Failed to test backend server');
    console.log('You can manually test with: npm run server:full:dev');
    return false;
  }
}

// Main setup function
async function main() {
  console.log('Starting XAMPP setup for NutriDash backend...');
  console.log('');
  
  const steps = [
    { name: 'Check XAMPP', fn: checkXAMPP },
    { name: 'Generate Prisma', fn: generatePrisma },
    { name: 'Push Schema', fn: pushSchema },
    { name: 'Seed Database', fn: seedDatabase }
  ];
  
  let allSuccess = true;
  
  for (const step of steps) {
    const success = await step.fn();
    if (!success) {
      allSuccess = false;
      break;
    }
    console.log('');
  }
  
  if (allSuccess) {
    console.log('🎉 Setup completed successfully!');
    console.log('');
    console.log('📊 What was created:');
    console.log('✅ MySQL database "nutridash"');
    console.log('✅ 20+ database tables');
    console.log('✅ 8 sample meals');
    console.log('✅ 3 subscription plans');
    console.log('✅ Admin user (admin@nutridash.com / admin123)');
    console.log('✅ Test user (test@nutridash.com / password)');
    console.log('✅ Sample coupons and delivery partner');
    console.log('');
    console.log('🚀 Next steps:');
    console.log('1. Start backend: npm run server:full:dev');
    console.log('2. Test API: curl http://localhost:3001/health');
    console.log('3. View database: http://localhost/phpmyadmin');
    console.log('4. Start frontend: npm run dev');
    console.log('');
    console.log('📚 Documentation:');
    console.log('- XAMPP Setup: XAMPP-SETUP.md');
    console.log('- Backend API: README-BACKEND.md');
    console.log('- Complete Guide: BACKEND-SUMMARY.md');
  } else {
    console.log('❌ Setup failed. Please check the errors above.');
    console.log('');
    console.log('🔧 Manual setup:');
    console.log('1. Start XAMPP and create "nutridash" database');
    console.log('2. Run: npm run db:generate');
    console.log('3. Run: npm run db:push');
    console.log('4. Run: npm run db:seed');
    console.log('5. Run: npm run server:full:dev');
  }
}

// Run setup
main().catch(console.error);