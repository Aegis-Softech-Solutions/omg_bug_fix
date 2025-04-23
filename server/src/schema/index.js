import { gql } from 'apollo-server-express';

// User Management Import
import userSchema from './UserManagement/user';
import roleSchema from './UserManagement/role';

// Customer Management Import
import customerSchema from './CustomerManagement/customer';
import profileSchema from './CustomerManagement/profile';
import transactionSchema from './CustomerManagement/transaction';

// Contest Stages
import competitionSchema from './ContestStages/competition';
import top500Schema from './ContestStages/top500';
import top150Schema from './ContestStages/top150';
import top75Schema from './ContestStages/top75';
import top30Schema from './ContestStages/top30';
import top20Schema from './ContestStages/top20';
import top10Schema from './ContestStages/top10';
import top5Schema from './ContestStages/top5';
import winnerSchema from './ContestStages/winner';

import contactUsSchema from './contactUs';
import couponSchema from './coupon';
import newsPRSchema from './ContentManagement/newsPR';
import bannerSchema from './ContentManagement/homeBanner';
import webinarSchema from './ContentManagement/webinar';
import pincodeSchema from './ContentManagement/pincode';

const linkSchema = gql`
  scalar Date

  scalar JSON

  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  type Subscription {
    _: Boolean
  }
`;

export default [
  linkSchema,
  userSchema,
  roleSchema,
  customerSchema,
  profileSchema,
  transactionSchema,
  competitionSchema,
  top500Schema,
  top150Schema,
  top75Schema,
  top30Schema,
  top20Schema,
  top10Schema,
  top5Schema,
  winnerSchema,
  contactUsSchema,
  newsPRSchema,
  bannerSchema,
  webinarSchema,
  couponSchema,
  pincodeSchema,
];
