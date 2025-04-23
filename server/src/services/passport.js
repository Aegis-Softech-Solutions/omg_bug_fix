import models from '../models';
import { UserInputError, ApolloError } from 'apollo-server';
import passport from 'passport';
import passportJWT from 'passport-jwt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { UploadAndSetData } from './upload';

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const localStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

passport.initialize(); //initialise passport for further process

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

passport.use(
  'local', //just name not necessary
  new localStrategy(
    //function
    {
      usernameField: 'email', //defaine field for email
      passwordField: 'password', //define field for password
      session: false, //if false we don't require session implemetation
    },
    (email, password, done) => {
      /**
       * @email = user's email
       * @password = user's password
       * @done = callback
       */
      try {
        models.User.findOne({ where: { email } }).then(async (user) => {
          // console.log(user);
          if (user != null) {
            let decipher = crypto.createDecipher('aes-256-cbc', process.env.SECRET);
            let decipheredPass = decipher.update(password, 'base64', 'utf8');
            decipheredPass += decipher.final('utf8');
            const isSame = await bcrypt.compare(decipheredPass, user.dataValues.password);

            // console.log("decipheredPass:", decipheredPass, isSame);

            if (isSame) {
              const payload = {
                id: user.dataValues.id,
                type: 'admin',
                email: user.dataValues.email,
                role_id: user.dataValues.role_id,
              };
              const token = jwt.sign(payload, process.env.SECRET);

              //get the permisions using roll id
              const permissions = await models.Role.findOne({
                attributes: ['permissions'],
                where: { id: payload.role_id },
                raw: true,
                plain: true,
              });

              return done(null, {
                message: 200, //success
                token,
                userDetails: {
                  ...user.dataValues,
                  permissions: permissions.permissions,
                },
              });
            } else return done(null, { message: 100 }); // Wrong password provided by user
          } else return done(null, { message: 404 }); // No user found in database
        });
      } catch (err) {
        // pass the error in done callback
        done(err);
      }
    }
  )
);

const signup = (args, req) => {
  const { first_name, last_name, email, role_id, phone, password, profile_pic } = args;
  if (!email || !first_name || !last_name || !role_id || !phone || !password)
    throw new UserInputError('Following are mandatory: First Name, Last Name, e-mail, Role, Phone No., Password');

  return models.User.findOne({ where: { email } })
    .then(async (existingUser) => {
      if (existingUser) throw new UserInputError('e-mail already in use');

      let addObj = {
        first_name,
        last_name,
        email,
        password,
        role_id,
        phone,
        profile_pic: null,
        active: true,
        created_by: 0,
        updated_by: 0,
      };

      if (profile_pic) {
        const updateData = await UploadAndSetData({
          file: profile_pic,
          variable: 'file',
          uploadFolder: 'admin-profile-pic',
        });
        addObj = { ...addObj, profile_pic: updateData.file };
      }

      return models.User.create(addObj);
    })
    .then((user) => {
      return new Promise((resolve, reject) => {
        const payload = {
          id: user.dataValues.id,
          type: 'admin',
          email: user.dataValues.email,
          role_id: user.dataValues.role_id,
        };
        const token = jwt.sign(payload, process.env.SECRET);
        resolve(token);
      });
    });
};

const login = ({ email, password, req }) => {
  return new Promise((resolve, reject) => {
    passport.authenticate('local', (err, userDetails) => {
      if (!userDetails) reject('Invalid credentials.');
      resolve(userDetails);
    })({ body: { email, password } });
  });
};

const facebookLogin = ({ social_id, email, req }) => {
  console.log('Facebook Login', social_id, email);

  return new Promise((resolve, reject) => {
    console.log('------');

    //authenticatie user
    passport.authenticate('facebook', (err, userDetails) => {
      console.log('--- userDetails:', userDetails);
      if (!userDetails) {
        reject('Invalid credentials.');
      }

      resolve(userDetails);
    })({
      body: { profile: { id: social_id, emails: [email], displayName: '' } },
    });
  });
};

module.exports = { signup, login };
