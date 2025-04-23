// User Management Import
import userResolvers from './UserManagement/user';
import roleResolvers from './UserManagement/role';

// Customer Management
import customerResolvers from './CustomerManagement/customer';
import profileResolvers from './CustomerManagement/profile';
import transactResolvers from './CustomerManagement/transaction';

// Contest Stages
import competitionResolvers from './ContestStages/competition';
import top500Resolvers from './ContestStages/top500';
import top150Resolvers from './ContestStages/top150';
import top75Resolvers from './ContestStages/top75';
import top30Resolvers from './ContestStages/top30';
import top20Resolvers from './ContestStages/top20';
import top10Resolvers from './ContestStages/top10';
import top5Resolvers from './ContestStages/top5';
import winnerResolvers from './ContestStages/winner';

import contactUsResolvers from './contactUs';
import newsPRResolvers from './ContentManagement/newsPR';
import bannerResolvers from './ContentManagement/homeBanner';
import webinarResolvers from './ContentManagement/webinar';
import pincodeResolvers from './ContentManagement/pincode';

import couponResolvers from './coupon';

export default [
  userResolvers,
  roleResolvers,
  customerResolvers,
  profileResolvers,
  competitionResolvers,
  top500Resolvers,
  top150Resolvers,
  top75Resolvers,
  top30Resolvers,
  top20Resolvers,
  top10Resolvers,
  top5Resolvers,
  winnerResolvers,
  transactResolvers,
  contactUsResolvers,
  newsPRResolvers,
  bannerResolvers,
  webinarResolvers,
  couponResolvers,
  pincodeResolvers,
];
