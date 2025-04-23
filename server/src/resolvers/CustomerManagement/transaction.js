import { combineResolvers } from 'graphql-resolvers';
import { UserInputError, ApolloError } from 'apollo-server';
import sequelize from '../../services/sequelizeConfig';
import { isAuthenticated } from '../authorization';

/**
 GENERAL NOTE:
 * Add 5.5 hours in epoch/timestamp: The AWS server tracks time in UTC format. So, to compensate for local time, 19800000 (5.5 hours) is added in appropriate places
*/

const Op = sequelize.Op;

export default {
  Query: {
    transactions: combineResolvers(isAuthenticated, async (parent, { dateRange = [] }, { models }) => {
      const whereCondition = `and transactions."createdAt" :: date between date '${dateRange[0]}' and date '${dateRange[1]}'`;
      return await sequelize
        .query(
          `
            select
              transactions.id, transactions.customer_id, payment_id,
              (case when order_id is null then '-' else order_id end) as order_name,
              case when order_id is null then 'CMS' else 'Website' end as source,
              case when amount is null then 0 else amount end as amount,
              full_name, email,
              case when utm_referrer is null then '-' else utm_referrer end as utm_referrer,
              case when utm_source is null then '-' else utm_source end as utm_source,
              case when utm_medium is null then '-' else utm_medium end as utm_medium,
              case when utm_campaign is null then '-' else utm_campaign end as utm_campaign,
              case when utm_adgroup is null then '-' else utm_adgroup end as utm_adgroup,
              case when utm_content is null then '-' else utm_content end as utm_content,
              to_char((transactions."createdAt" + interval '5 hours 30 minutes'), 'YYYY Month') as month,
              to_char((transactions."createdAt" + interval '5 hours 30 minutes'), 'DD Mon YYYY') as created_at_transformed
            from
              transactions
              left outer join customers on transactions.customer_id = customers.id
            where transactions.active is true
            ${dateRange && dateRange.length ? whereCondition : ''}
            order by transactions."createdAt" desc
          `
        )
        .then((res) => res[0]);
    }),
  },

  Mutation: {
    addOfflineTransaction: combineResolvers(
      isAuthenticated,
      async (parent, { customer_id, amount }, { models, me }) => {
        if (!customer_id || Number(customer_id) === 0) throw new UserInputError('Invalid contestant.');

        const foundCustomer = await models.Customer.findOne({ attributes: ['id'], where: { id: Number(customer_id) } });
        if (!foundCustomer) throw new UserInputError('Contestant not found.');

        const foundTransaction = await models.Transaction.findOne({
          attributes: ['id'],
          where: { customer_id: Number(customer_id) },
        });
        if (foundTransaction) throw new UserInputError('Given contestant has already paid.');

        const transaction = await models.Transaction.create({
          customer_id,
          amount: amount || 0,
          active: true,
          created_by: Number(me.id),
        }).catch((error) => {
          throw new ApolloError(error.message, 'MUTATION_ERROR');
        });

        if (transaction)
          await foundCustomer
            .update({ transaction_id: Number(transaction.id), updated_by: Number(me.id) })
            .catch((error) => {
              throw new ApolloError(error.message, 'MUTATION_ERROR');
            });

        return true;
      }
    ),
  },
};
