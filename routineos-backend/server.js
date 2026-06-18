require('dotenv').config();
const app = require('./src/app');
const { startCronJobs } = require('./src/cron/morningBriefing');
const { startWeeklyInsightsCron } = require('./src/cron/weeklyInsights');
const { startRecoveryDetectionCron } = require('./src/cron/recoveryDetection');
const { startConsistencyCalculatorCron } = require('./src/cron/consistencyCalculator');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`RoutineOS API running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);

  // Start all background cron jobs
  startCronJobs();
  startWeeklyInsightsCron();
  startRecoveryDetectionCron();
  startConsistencyCalculatorCron();
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated.');
    process.exit(0);
  });
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});