import { combineResolvers } from 'graphql-resolvers';
import { ApolloError } from 'apollo-server';
import sequelize from '../../services/sequelizeConfig';
import { isAuthenticated } from '../authorization';

const Op = sequelize.Op;

export default {
  Query: {
    allPincodes: async (parent, args, { models }) => {
      return await models.Pincode.findAll({ order: [['id', 'desc']] }).catch((error) => {
        throw new ApolloError(error.message, 'MUTATION_ERROR');
      });
    },

    activePincodes: async (parent, args, { models }) => {
      return await models.Pincode.findAll({
        where: { active: true },
        order: [['id', 'desc']],
      }).catch((error) => {
        throw new ApolloError(error.message, 'MUTATION_ERROR');
      });
    },

    pincode: combineResolvers(isAuthenticated, async (parent, { pincode }, { models }) => {
      if (!pincode || Number(pincode) === 0) return {};
      return await models.Pincode.findOne({
        where: { pincode, active: true },
      }).catch((error) => {
        throw new ApolloError(error.message, 'MUTATION_ERROR');
      });
    }),
  },
};
