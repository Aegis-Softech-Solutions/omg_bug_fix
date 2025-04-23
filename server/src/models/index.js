import Sequelize from 'sequelize';

let sequelize;
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
  });
} else {
  sequelize = new Sequelize(
    process.env.TEST_DATABASE || process.env.DATABASE,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD,
    {
      host: process.env.DATABASE_HOST,
      dialect: 'postgres',
    }
  );
}

const models = {
  // User Management
  User: sequelize.import('./UserManagement/user'),
  Role: sequelize.import('./UserManagement/role'),

  // Customer Management
  Customer: sequelize.import('./CustomerManagement/customer'),
  Transaction: sequelize.import('./CustomerManagement/transaction'),
  Profile: sequelize.import('./CustomerManagement/profile'),
  PaymentRequest: sequelize.import('./CustomerManagement/paymentRequest'),

  // Contest Stages
  IPAddress: sequelize.import('./ContestStages/ipAddress'),
  ContestStage: sequelize.import('./ContestStages/contestStage'),
  Competition: sequelize.import('./ContestStages/competition'),
  CompetitionSubmission: sequelize.import('./ContestStages/competitionSubmission'),
  CompetitionWinner: sequelize.import('./ContestStages/competitionWinner'),
  OnlineVote: sequelize.import('./ContestStages/onlineVote'),
  Top500: sequelize.import('./ContestStages/top500'),
  Top150: sequelize.import('./ContestStages/top150'),
  Top75: sequelize.import('./ContestStages/top75'),
  Top30: sequelize.import('./ContestStages/top30'),
  Top20: sequelize.import('./ContestStages/top20'),
  Top10: sequelize.import('./ContestStages/top10'),
  Top5: sequelize.import('./ContestStages/top5'),
  Winner: sequelize.import('./ContestStages/winner'),

  ContactUs: sequelize.import('./contactUs'),
  NewsPR: sequelize.import('./ContentManagement/newsPR'),
  HomeBanner: sequelize.import('./ContentManagement/homeBanner'),
  Webinar: sequelize.import('./ContentManagement/webinar'),
  Pincode: sequelize.import('./ContentManagement/pincode'),
  Coupon: sequelize.import('./coupon'),
  Error: sequelize.import('./error'),
};

Object.keys(models).forEach((key) => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});

export { sequelize };

export default models;
