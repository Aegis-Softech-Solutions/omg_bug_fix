import { combineResolvers } from 'graphql-resolvers';
import { UserInputError, ApolloError } from 'apollo-server';
import sequelize from '../../services/sequelizeConfig';
import { isAuthenticated } from '../authorization';

const Op = sequelize.Op;

export default {
  Query: {
    allWebinars: async (parent, args, { models }) => {
      return await models.Webinar.findAll({ order: [['id', 'desc']] }).catch((error) => {
        throw new ApolloError(error.message, 'MUTATION_ERROR');
      });
    },

    activeWebinars: async (parent, args, { models }) => {
      return await models.Webinar.findAll({
        where: { active: true },
        order: [['id', 'desc']],
      }).catch((error) => {
        throw new ApolloError(error.message, 'MUTATION_ERROR');
      });
    },

    webinar: combineResolvers(isAuthenticated, async (parent, { id }, { models }) => {
      if (!id || Number(id) === 0) return {};
      return await models.Webinar.findOne({ where: { id } }).catch((error) => {
        throw new ApolloError(error.message, 'MUTATION_ERROR');
      });
    }),
  },

  Mutation: {
    addWebinar: combineResolvers(isAuthenticated, async (parent, { title, link }, { models, me }) => {
      if (!title) throw new UserInputError("Invalid argument provided: 'title'");
      if (!link) throw new UserInputError("Invalid argument provided: 'link'");
      await models.Webinar.create({
        title,
        link,
        active: true,
        created_by: Number(me.id),
      }).catch((error) => {
        throw new ApolloError(error.message, 'MUTATION_ERROR');
      });
      return true;
    }),

    updateWebinar: combineResolvers(isAuthenticated, async (parent, { id, title, link }, { models, me }) => {
      if (!id || Number(id) === 0) throw new UserInputError("Invalid argument provided: 'id'");
      if (!title) throw new UserInputError("Invalid argument provided: 'title'");
      if (!link) throw new UserInputError("Invalid argument provided: 'link'");
      await models.Webinar.update(
        {
          title,
          link,
          updated_by: Number(me.id),
        },
        { where: { id } }
      ).catch((error) => {
        throw new ApolloError(error.message, 'MUTATION_ERROR');
      });

      return true;
    }),

    changeWebinarStatus: combineResolvers(isAuthenticated, async (parent, { webinar_id, status }, { models, me }) => {
      if (!webinar_id || Number(webinar_id) === 0) throw new UserInputError("Invalid argument provided: 'webinar_id'");
      if (status !== true && status !== false)
        throw new UserInputError(
          "Invalid argument provided: 'status'. It should have either 'true' or 'false' as value."
        );

      const foundWebinar = await models.Webinar.findOne({
        where: { id: webinar_id },
        attributes: ['id'],
      }).catch((error) => {
        throw new ApolloError(error.message, 'MUTATION_ERROR');
      });

      if (!foundWebinar) throw new UserInputError('Given webinar does not exist.');
      else {
        await foundWebinar
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
