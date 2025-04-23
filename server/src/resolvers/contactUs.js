import { combineResolvers } from 'graphql-resolvers';
import { UserInputError, ApolloError } from 'apollo-server';
import sequelize from '../services/sequelizeConfig';
import sendEmail from '../services/sendEmail';
import { isAuthenticated } from './authorization';

const Op = sequelize.Op;

export default {
  Query: {
    contactUsMessages: combineResolvers(
      isAuthenticated,
      async (parent, args, { models }) => await models.ContactUs.findAll({ order: [['id', 'DESC']] })
    ),

    contactUsMessageById: combineResolvers(isAuthenticated, async (parent, { id }, { models }) => {
      if (!id || Number(id) === 0) return {};
      return await models.ContactUs.findOne({ where: { id } });
    }),
  },

  Mutation: {
    addContactUsMessage: async (parent, args, { models, me }) => {
      const { name, email, phone, subject, message } = args;
      if (!name || !email || !phone || !subject || !message)
        throw new UserInputError('Invalid arguments provided: All the fields are mandatory.');

      await models.ContactUs.create({
        name,
        email,
        phone,
        subject,
        message,
        has_read: false,
        active: true,
        created_by: me ? Number(me.id) : 0,
      }).catch((error) => {
        throw new ApolloError(error.message, 'MUTATION_ERROR');
      });

      // sendEmail('ashish@pixels.agency', {
      //   template_name: 'contactUsNotify',
      //   template_data: {
      //     name,
      //     email,
      //     phone,
      //     subject,
      //     message,
      //   },
      //   mailSubject: 'New Message for oMg',
      // });

      return true;
    },

    changeContactUsMessageReadStatus: combineResolvers(
      isAuthenticated,
      async (parent, { message_id, status }, { models, me }) => {
        if (!message_id || Number(message_id) === 0)
          throw new UserInputError("Invalid argument provided: 'message_id'");

        if (status !== true && status !== false)
          throw new UserInputError(
            "Invalid argument provided: 'status'. It should have either 'true' or 'false' as value."
          );

        const foundMessage = await models.ContactUs.findOne({
          where: { id: message_id },
          attributes: ['id'],
        }).catch((error) => {
          throw new ApolloError(error.message, 'MUTATION_ERROR');
        });

        if (!foundMessage) throw new UserInputError('Given subscriber data does not exist.');
        else {
          await foundMessage
            .update({
              has_read: status,
              updated_by: Number(me.id),
            })
            .catch((error) => {
              throw new ApolloError(error.message, 'MUTATION_ERROR');
            });

          return true;
        }
      }
    ),

    replyToMessage: combineResolvers(
      isAuthenticated,
      async (parent, { message_id, reply_message, reply_subject }, { models, me }) => {
        if (!message_id || Number(message_id) === 0)
          throw new UserInputError("Invalid argument provided: 'message_id'");
        if (!reply_message) throw new UserInputError("Invalid argument provided: 'reply_message'");
        if (!reply_subject) throw new UserInputError("Invalid argument provided: 'reply_subject'");

        const foundMessage = await models.ContactUs.findOne({
          where: { id: message_id },
          attributes: ['id', 'name', 'email'],
        }).catch((error) => {
          throw new ApolloError(error.message, 'MUTATION_ERROR');
        });

        if (!foundMessage) throw new UserInputError('Given message does not exist.');
        else {
          // sendEmail(foundMessage.email, {
          //   template_name: 'replyToMessage',
          //   template_data: {
          //     name: foundMessage.name,
          //     reply_message,
          //   },
          //   mailSubject: reply_subject,
          // });

          await foundMessage
            .update({
              has_read: true,
              updated_by: Number(me.id),
            })
            .catch((error) => {
              throw new ApolloError(error.message, 'MUTATION_ERROR');
            });

          return true;
        }
      }
    ),
  },
};
