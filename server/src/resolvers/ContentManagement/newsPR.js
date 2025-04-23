import { combineResolvers } from 'graphql-resolvers';
import { UserInputError, ApolloError } from 'apollo-server';
import schedule from 'node-schedule';
import sequelize from '../../services/sequelizeConfig';
import { UploadAndSetData, UnlinkFile } from '../../services/uploadS3Bucket';
import { isAuthenticated } from '../authorization';

const Op = sequelize.Op;

export default {
  Query: {
    allNews: combineResolvers(
      isAuthenticated,
      async (parent, args, { models }) => await models.NewsPR.findAll({ order: [['publish_at', 'DESC']] })
    ),

    // Only active news, with limit and offset
    newsPRList: async (parent, { limit = 10, offset = 0 }, { models }) =>
      await models.NewsPR.findAll({
        where: { active: true },
        order: [['publish_at', 'DESC']],
        limit,
        offset,
      }),

    // Same as above, with added benefit of count
    newsPRListWithCount: async (parent, { limit = 10, offset = 0 }, { models }) =>
      await models.NewsPR.findAndCountAll({
        where: { active: true },
        order: [['publish_at', 'DESC']],
        limit,
        offset,
      }),

    newsById: async (parent, { id }, { models }) => {
      if (!id || Number(id) === 0) return {};
      return models.NewsPR.findOne({ where: { id } });
    },

    newsBySlug: async (parent, { slug }, { models }) => {
      if (!slug) return {};
      return models.NewsPR.findOne({ where: { slug } });
    },
  },

  Mutation: {
    // Checks if a given slug exists anywhere in the whole DB --> ensures each and every slug in the system is unique
    doesSlugExist: combineResolvers(isAuthenticated, async (parent, { type, id, slug }, { models, me }) => {
      if (!slug) throw new UserInputError("Invalid argument provided: 'slug'");
      let foundSlug = null,
        returnData = { slugExists: false };

      // Check if "news_prs" table contains the slug
      foundSlug = await models.NewsPR.findOne({ attibutes: ['id'], where: { slug } });
      if (foundSlug) {
        if (type !== 'news' || (type === 'news' && Number(id) !== Number(foundSlug.id)))
          returnData = { slugExists: true };
      }

      return returnData;
    }),

    upsertNews: combineResolvers(
      isAuthenticated,
      async (parent, { upsertType, wasActive, newsData }, { models, me }) => {
        if (upsertType !== 'create' && upsertType !== 'update')
          throw new UserInputError(
            "Invalid argument provided: 'upsertType'. It should have either 'create' or 'update' as its value."
          );

        const { id, title, slug, media_type, featured_image, excerpt, html_content, publish_at } = newsData;

        if (upsertType === 'update' && (!id || Number(id) === 0))
          throw new UserInputError("Invalid argument provided: 'newsData.id'");

        if (!title || Number(title) === 0) throw new UserInputError("Invalid argument provided: 'newsData.title'");

        if (!slug || Number(slug) === 0) throw new UserInputError("Invalid argument provided: 'newsData.slug'");

        if (!publish_at || Number(publish_at) === 0)
          throw new UserInputError("Invalid argument provided: 'newsData.publish_at'");

        let foundNews = null;
        if (upsertType === 'update')
          foundNews = await models.NewsPR.findOne({ attributes: ['id', 'featured_image'], where: { id } });

        let mutateObj = {
          title,
          slug,
          excerpt,
          media_type,
          html_content,
          publish_at,
          active: upsertType === 'create' || wasActive || Number(publish_at) <= Date.now() ? true : false,
        };

        if (featured_image && typeof featured_image === 'object') {
          const imgData = await UploadAndSetData({
            file: featured_image,
            variable: 'file',
            uploadFolder: 'misc',
            isAllMedia: true,
          });
          mutateObj = { ...mutateObj, featured_image: imgData.file };

          if (imgData.file && foundNews && foundNews.featured_image)
            await UnlinkFile(foundNews.featured_image, 'misc').catch((err) =>
              console.log('Error while deleting "featured_image" from News-PR: ', err)
            );
        }

        let newItem = null;
        if (upsertType === 'create')
          newItem = await models.NewsPR.create({
            ...mutateObj,
            created_by: Number(me.id),
          }).catch((error) => {
            throw new ApolloError(error.message, 'MUTATION_ERROR');
          });
        else if (foundNews)
          await foundNews
            .update({
              ...mutateObj,
              updated_by: Number(me.id),
            })
            .catch((error) => {
              throw new ApolloError(error.message, 'MUTATION_ERROR');
            });

        if (!wasActive) {
          const itemID = upsertType === 'create' ? `${newItem.id}` : `${id}`;

          let startTime = new Date(Date.now() + 2000);

          if (Number(publish_at) > Date.now()) {
            startTime = new Date(Number(publish_at));

            // Make the status of news-article active
            schedule.scheduleJob(`activateNewsJob-${itemID}`, startTime, async () => {
              const foundNews = await models.Article.findOne({
                attributes: ['id', 'active'],
                where: { id: itemID },
              }).catch((error) => {
                throw new ApolloError(error.message, 'MUTATION_ERROR');
              });

              if (!foundNews.active)
                await foundNews
                  .update({
                    active: true,
                    updated_by: Number(me.id),
                  })
                  .catch((error) => {
                    throw new ApolloError(error.message, 'MUTATION_ERROR');
                  });
            });
          }
        }

        return true;
      }
    ),

    uploadImages: combineResolvers(isAuthenticated, async (parent, { image }, { models, me }) => {
      if (!image) throw new UserInputError("Invalid argument provided: 'image'. Nothing to upload.");

      const addData = await UploadAndSetData({
        file: image,
        variable: 'file',
        uploadFolder: 'misc',
        keepOriginalFileName: true,
      });

      return { imgName: addData.file };
    }),

    changeNewsStatus: combineResolvers(isAuthenticated, async (parent, { news_id, status }, { models, me }) => {
      if (!news_id || Number(news_id) === 0) throw new UserInputError("Invalid argument provided: 'news_id'");

      if (status !== true && status !== false)
        throw new UserInputError(
          "Invalid argument provided: 'status'. It should have either 'true' or 'false' as value."
        );

      const foundNews = await models.NewsPR.findOne({
        where: { id: news_id },
        attributes: ['id'],
      }).catch((error) => {
        throw new ApolloError(error.message, 'MUTATION_ERROR');
      });

      if (!foundNews) throw new UserInputError('Given News & PR data does not exist.');
      else {
        await foundNews
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
