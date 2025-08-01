import mongoose from 'mongoose';
import chalk from 'chalk';

export const connectDb = async (): Promise<void> => {
  const dbUrl = process.env.DATABASE_URL;
  const env = process.env.NODE_ENV || 'development';

  if (!dbUrl) {
    console.log(chalk.red.bold('❌ DATABASE_URL not found in .env file.'));
    process.exit(1);
  }

  try {
    await mongoose.connect(dbUrl, {
      // Tidak perlu dbName karena sudah ada di URL
      serverSelectionTimeoutMS: 5000,
      
    });

    const now = new Date().toLocaleString();
    console.log(
      chalk.green.bold('✅ MongoDB Connected!'),
      chalk.gray(`\n🌐 Env: ${env}\n🕒 Time: ${now}\n📡 Host: ${mongoose.connection.host}\n📁 DB: ${mongoose.connection.name}`)
    );

    mongoose.connection.on('disconnected', () =>
      console.log(chalk.yellow('⚠️ MongoDB Disconnected!'))
    );

    mongoose.connection.on('reconnected', () =>
      console.log(chalk.cyan('🔄 MongoDB Reconnected!'))
    );
  } catch (error: any) {
    console.error(chalk.red.bold('❌ MongoDB Connection Failed!'));
    console.error(chalk.red(error?.message || error));
    process.exit(1);
  }
};

export const db = mongoose.connection;
