import { combineResolvers } from 'graphql-resolvers';
import { UserInputError, ApolloError } from 'apollo-server';
import sequelize from '../services/sequelizeConfig';
import { isAuthenticated } from './authorization';

const Op = sequelize.Op;

export default {
  Query: {
    coupons: combineResolvers(
      isAuthenticated,
      async (parent, args, { models }) =>
        await models.Coupon.findAll({ order: [['id', 'DESC']] }).catch((error) => {
          throw new ApolloError(error.message, 'MUTATION_ERROR');
        })
    ),

    coupon: combineResolvers(isAuthenticated, async (parent, { id }, { models }) => {
      if (!id || Number(id) === 0) return {};
      return await models.Coupon.findOne({ where: { id } }).catch((error) => {
        throw new ApolloError(error.message, 'MUTATION_ERROR');
      });
    }),
  },

  Mutation: {
    addCoupon: combineResolvers(isAuthenticated, async (parent, { code, value }, { models, me }) => {
      if (!code) throw new UserInputError("Invalid argument provided: 'code'");
      const foundCode = await models.Coupon.findOne({ where: { code: code.toUpperCase() } });
      if (foundCode) throw new UserInputError('Given Coupon Code already exists.');

      if (!value) throw new UserInputError("Invalid argument provided: 'value'");

      await models.Coupon.create({
        code: code.toUpperCase(),
        value,
        active: true,
        created_by: Number(me.id),
      }).catch((error) => {
        throw new ApolloError(error.message, 'MUTATION_ERROR');
      });

      return true;
    }),

    updateCoupon: combineResolvers(isAuthenticated, async (parent, { id, code, value }, { models, me }) => {
      if (!id || Number(id) === 0) throw new UserInputError("Invalid argument provided: 'id'");
      if (!code) throw new UserInputError("Invalid argument provided: 'code'");
      if (!value) throw new UserInputError("Invalid argument provided: 'value'");

      const foundCoupon = await models.Coupon.findOne({
        where: { id },
        attributes: ['id'],
      }).catch((error) => {
        throw new ApolloError(error.message, 'MUTATION_ERROR');
      });

      if (!foundCoupon) throw new UserInputError('No such coupon exists!');
      else
        await foundCoupon
          .update({
            code: code.toUpperCase(),
            value,
            updated_by: Number(me.id),
          })
          .catch((error) => {
            throw new ApolloError(error.message, 'MUTATION_ERROR');
          });

      return true;
    }),

    changeCouponStatus: combineResolvers(isAuthenticated, async (parent, { coupon_id, status }, { models, me }) => {
      if (!coupon_id || Number(coupon_id) === 0) throw new UserInputError("Invalid argument provided: 'coupon_id'");

      if (status !== true && status !== false)
        throw new UserInputError(
          "Invalid argument provided: 'status'. It should have either 'true' or 'false' as value."
        );

      const foundCoupon = await models.Coupon.findOne({
        where: { id: coupon_id },
        attributes: ['id'],
      }).catch((error) => {
        throw new ApolloError(error.message, 'MUTATION_ERROR');
      });

      if (!foundCoupon) throw new UserInputError('Given subscriber data does not exist.');
      else {
        await foundCoupon
          .update({
            active: status,
            updated_by: Number(me.id),
          })
          .catch((error) => {
            throw new ApolloError(error.message, 'MUTATION_ERROR');
          });

        return true;
      }
    }),
  },
};
