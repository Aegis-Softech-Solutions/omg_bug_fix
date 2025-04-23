import jwt from 'jsonwebtoken';
import { combineResolvers } from 'graphql-resolvers';
import { UserInputError, ApolloError } from 'apollo-server';
import bcrypt from 'bcrypt';
import sequelize from '../../services/sequelizeConfig';
import { isAuthenticated } from '../authorization';
import { signup, login } from '../../services/passport';
import { UploadAndSetData } from '../../services/uploadS3Bucket';

export default {
  Query: {
    users: async (parent, args, { models }) =>
      await sequelize
        .query(
          `
            select
              users.*,
              concat(first_name, ' ', last_name) as full_name,
              roles.title,
              roles.permissions
            from
              users
              join roles on users.role_id = roles.id
            order by users.id asc
          `
        )
        .then((res) => res[0]),

    user: async (parent, { id }, { models }) =>
      await sequelize
        .query(
          `
            SELECT users.*, roles.title, roles.permissions
            FROM users 
            JOIN roles ON users.role_id = roles.id
            WHERE users.id = :id
          `,
          { replacements: { id }, type: sequelize.QueryTypes.SELECT }
        )
        .then((res) => res[0]),

    me: async (parent, args, { models, me }) => {
      if (!me) return null;
      return await models.User.findById(me.id);
    },

    adminProfilePic: async (parent, args, { models, me }) => {
      if (!me) return null;
      return await models.User.findOne({
        attributes: ['profile_pic'],
        where: { id: me.id },
      });
    },
  },

  Mutation: {
    signUp: async (parent, args, ctx) => {
      let token = await signup(args, ctx);
      return { token };
    },

    signIn: async (parent, { email, password }, ctx) => {
      let result = await login({ email, password, ctx });
      /**
       * @if message equal to 200 then the user is valid
       * @if message equal to 100 then the password is wrong
       * @if message is 404 then user is not present
       */
      if (result.message === 200) {
        //user found
        return {
          token: result.token,
          userDetails: result.userDetails,
        };
      } else if (result.message === 100) {
        //wrong password
        throw new UserInputError('Invalid password. Please try again');
      } else {
        //no user found
        throw new UserInputError('No user found with this login credentials.');
      }
    },

    updateUser: combineResolvers(isAuthenticated, async (parent, args, { models, me }) => {
      const { id, first_name, last_name, email, role_id, phone, password, profile_pic } = args;

      if (!id || !email || !first_name || !last_name || !role_id || !phone || !password)
        throw new UserInputError(
          'Following are mandatory: ID, First Name, Last Name, e-mail, Role, Phone No., Password'
        );

      const user = await models.User.findOne({ where: { id } });

      if (!user) throw new UserInputError("The given 'id' does not exist.");
      else {
        let updateObj = {
          first_name,
          last_name,
          email,
          role_id: Number(role_id),
          phone,
          profile_pic: null,
          updated_by: Number(me.id),
        };

        if (user.password !== password) {
          const hashedPassword = await bcrypt.hash(password, 10);
          updateObj = { ...updateObj, password: hashedPassword };
        }

        if (profile_pic) {
          const updateData = await UploadAndSetData({
            file: profile_pic,
            variable: 'file',
            uploadFolder: 'admin-profile-pic',
          });
          updateObj = { ...updateObj, profile_pic: updateData.file };
        }

        return await user
          .update(updateObj)
          .then((data) => (data ? true : false))
          .catch((error) => {
            throw new ApolloError(error.message, 'MUTATION_ERROR');
          });
      }
    }),

    deleteUser: combineResolvers(
      isAuthenticated,
      async (parent, { id }, { models }) =>
        await models.User.destroy({
          where: { id },
        })
    ),

    uploadImage: async (parent, { file }, { models }) => {
      await UploadAndSetData({
        file,
        variable: 'file',
        uploadFolder: '/',
      });
      return true;
    },

    changeUserStatus: combineResolvers(isAuthenticated, async (parent, { id, status }, { models, me }) => {
      if (!id || Number(id) === 0) throw new UserInputError("Invalid argument provided: 'id'");

      if (status !== true && status !== false)
        throw new UserInputError(
          "Invalid argument provided: 'status'. It should have either 'true' or 'false' as value."
        );

      const foundUser = await models.User.findOne({
        where: { id },
        attributes: ['id'],
      }).catch((error) => {
        throw new ApolloError(error.message, 'MUTATION_ERROR');
      });

      if (!foundUser) throw new UserInputError('Given subscriber data does not exist.');
      else {
        await foundUser
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
