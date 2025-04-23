import { combineResolvers } from 'graphql-resolvers';
import { UserInputError, ApolloError } from 'apollo-server';
import { UploadAndSetData } from '../../services/uploadS3Bucket';
import sequelize from '../../services/sequelizeConfig';
import { isAuthenticated } from '../authorization';

const Op = sequelize.Op;

export default {
  Query: {
    allHomeBanners: async (parent, args, { models }) => {
      return await models.HomeBanner.findAll({ order: [['id', 'desc']] }).catch((error) => {
        throw new ApolloError(error.message, 'MUTATION_ERROR');
      });
    },

    activeHomeBanners: async (parent, args, { models }) => {
      return await models.HomeBanner.findAll({
        where: { active: true },
        order: [['id', 'desc']],
      }).catch((error) => {
        throw new ApolloError(error.message, 'MUTATION_ERROR');
      });
    },

    homeBanner: combineResolvers(isAuthenticated, async (parent, { id }, { models }) => {
      if (!id || Number(id) === 0) return {};
      return await models.HomeBanner.findOne({ where: { id, active: true } }).catch((error) => {
        throw new ApolloError(error.message, 'MUTATION_ERROR');
      });
    }),
  },

  Mutation: {
    addHomeBanner: combineResolvers(isAuthenticated, async (parent, { image, text }, { models, me }) => {
      if (!image) throw new UserInputError("Invalid argument provided: 'image'");
      if (!text) throw new UserInputError("Invalid argument provided: 'text'");
      const addData = await UploadAndSetData({
        file: image,
        variable: 'file',
        uploadFolder: 'home-banners',
      });
      await models.HomeBanner.create({
        image: addData.file,
        text,
        active: true,
        created_by: Number(me.id),
      }).catch((error) => {
        throw new ApolloError(error.message, 'MUTATION_ERROR');
      });
      return true;
    }),

    updateHomeBanner: combineResolvers(isAuthenticated, async (parent, { id, image, text }, { models, me }) => {
      if (!id || Number(id) === 0) throw new UserInputError("Invalid argument provided: 'id'");
      if (!image) throw new UserInputError("Invalid argument provided: 'image'");
      if (!text) throw new UserInputError("Invalid argument provided: 'text'");

      const updateData = await UploadAndSetData({
        file: image,
        variable: 'file',
        uploadFolder: 'home-banners',
      });

      await models.HomeBanner.update(
        {
          image: updateData.file,
          text,
          updated_by: Number(me.id),
        },
        { where: { id } }
      ).catch((error) => {
        throw new ApolloError(error.message, 'MUTATION_ERROR');
      });

      return true;
    }),

    changeHomeBannerStatus: combineResolvers(isAuthenticated, async (parent, { banner_id, status }, { models, me }) => {
      if (!banner_id || Number(banner_id) === 0) throw new UserInputError("Invalid argument provided: 'banner_id'");
      if (status !== true && status !== false)
        throw new UserInputError(
          "Invalid argument provided: 'status'. It should have either 'true' or 'false' as value."
        );

      const foundBanner = await models.HomeBanner.findOne({
        where: { id: banner_id },
        attributes: ['id'],
      }).catch((error) => {
        throw new ApolloError(error.message, 'MUTATION_ERROR');
      });

      if (!foundBanner) throw new UserInputError('Given subscriber data does not exist.');
      else {
        await foundBanner
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
