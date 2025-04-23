import { combineResolvers } from 'graphql-resolvers';
import { UserInputError, ApolloError, AuthenticationError } from 'apollo-server';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import axios from 'axios';
import schedule from 'node-schedule';
import Razorpay from 'razorpay';
import _ from 'lodash';
import sequelize from '../../services/sequelizeConfig';
import { sendEmail, sendBulkEmail, createTemplate, sendTemplateEmail, updateTemplate } from '../../services/awsSES';
// import { UploadAndSetData } from '../../services/uploadS3Bucket';
import { isAuthenticated } from '../authorization';
import createSlug from './createSlug';

const Op = sequelize.Op;

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
  headers: {
    'X-Razorpay-Account': process.env.RAZORPAY_MERCHANT_ACCOUNT,
  },
});

export default {
  Query: {
    customers: combineResolvers(isAuthenticated, async (parent, { final_status }) => {
      const finalStatusCondition = final_status ? `and final_status = '${final_status}'` : ' ';
      return await sequelize
        .query(
          `
            select
              customers.id, full_name, email, customers.active,
              case when utm_referrer is null then '-' else utm_referrer end as utm_referrer,
              case when utm_source is null then '-' else utm_source end as utm_source,
              case when utm_medium is null then '-' else utm_medium end as utm_medium,
              case when utm_campaign is null then '-' else utm_campaign end as utm_campaign,
              case when utm_adgroup is null then '-' else utm_adgroup end as utm_adgroup,
              case when utm_content is null then '-' else utm_content end as utm_content,
              case when insta_verified is true then 'Yes' else 'No' end as insta_verified_string,
              case when profile_pic is null then null else (
                case
                  when profile_pic = 'pic1' then pic1
                  when profile_pic = 'pic2' then pic2
                  when profile_pic = 'pic3' then pic3
                  when profile_pic = 'pic4' then pic4
                else null end
              ) end as profile_pic,
              case when phone is null then '-' else phone::text end as phone_string,
              case
                when gender = 'm' then 'Male'
                when gender = 'f' then 'Female'
                else '-'
              end as gender,
              case when state is null then '-' else state end as state,
              case when city is null then '-' else city end as city,
              case when transaction_id is null then '-' else (
                to_char((transactions."createdAt" + interval '5 hours 30 minutes'), 'DD-MM-YYYY')
              ) end as payment_made_date
            from
              customers
              left outer join profiles on profiles.customer_id = customers.id
              left outer join transactions on transactions.id = transaction_id
            where
              transaction_id is not null
              and not (
                state is null or city is null or pincode is null or bio is null or insta_link is null
                or height is null or weight is null or dob is null or pic1 is null
                or (gender != 'h' and (pic2 is null or pic3 is null))
              )
              ${finalStatusCondition}
            order by transactions."createdAt" desc
          `
        )
        .then((res) => res[0]);
    }),

    partialProfileCustomers: combineResolvers(isAuthenticated, async () => {
      return await sequelize
        .query(
          `
            select
              customers.id, full_name, email, customers.active,
              case when utm_referrer is null then '-' else utm_referrer end as utm_referrer,
              case when utm_source is null then '-' else utm_source end as utm_source,
              case when utm_medium is null then '-' else utm_medium end as utm_medium,
              case when utm_campaign is null then '-' else utm_campaign end as utm_campaign,
              case when utm_adgroup is null then '-' else utm_adgroup end as utm_adgroup,
              case when utm_content is null then '-' else utm_content end as utm_content,
              case when insta_verified is true then 'Yes' else 'No' end as insta_verified_string,
              case when profile_pic is null then null else (
                case
                  when profile_pic = 'pic1' then pic1
                  when profile_pic = 'pic2' then pic2
                  when profile_pic = 'pic3' then pic3
                  when profile_pic = 'pic4' then pic4
                else null end
              ) end as profile_pic,
              case when phone is null then '-' else phone::text end as phone_string,
              case
                when gender = 'm' then 'Male'
                when gender = 'f' then 'Female'
                else '-'
              end as gender,
              case when state is null then '-' else state end as state,
              case when city is null then '-' else city end as city,
              case when transaction_id is null then '-' else (
                to_char((transactions."createdAt" + interval '5 hours 30 minutes'), 'DD-MM-YYYY')
              ) end as payment_made_date
            from
              customers
              left outer join profiles on profiles.customer_id = customers.id
              left outer join transactions on transactions.id = transaction_id
            where
              transaction_id is not null
              and (
                final_status is null or final_status = 'draft' or state is null or city is null
                or pincode is null or bio is null or insta_link is null or height is null or weight is null
                or dob is null or pic1 is null
              )
            order by transactions."createdAt" desc
          `
        )
        .then((res) => res[0]);
    }),

    unpaidCustomers: combineResolvers(isAuthenticated, async () => {
      return await sequelize
        .query(
          `
            select
              customers.id, full_name, email, customers.active,
              case when utm_referrer is null then '-' else utm_referrer end as utm_referrer,
              case when utm_source is null then '-' else utm_source end as utm_source,
              case when utm_medium is null then '-' else utm_medium end as utm_medium,
              case when utm_campaign is null then '-' else utm_campaign end as utm_campaign,
              case when utm_adgroup is null then '-' else utm_adgroup end as utm_adgroup,
              case when utm_content is null then '-' else utm_content end as utm_content,
              '-' as insta_verified_string, '-' as state, '-' as city, null as profile_pic,
              case when phone is null then '-' else phone::text end as phone_string,
              case
                when gender = 'm' then 'Male'
                when gender = 'f' then 'Female'
                else '-'
              end as gender,
              to_char(("createdAt" + interval '5 hours 30 minutes'), 'DD-MM-YYYY') as payment_made_date
            from customers
            where transaction_id is null
            order by id desc
          `
        )
        .then((res) => res[0]);
    }),

    customerDetailsById: combineResolvers(isAuthenticated, async (parent, { customer_id }, { models }) => {
      if (!customer_id || Number(customer_id) === 0) return null;

      return await sequelize
        .query(
          `
            select
              customers.id as id, full_name, email, phone, gender, transaction_id, customers.active,
              case when transaction_id is not null or transaction_id <> 0 then 'Yes' else 'No' end as payment_made,
              case when payment_id is null then '-' else payment_id end as payment_id,
              transactions."createdAt" as payment_made_date
            from
              customers
              left outer join transactions on transactions.id = transaction_id
            where customers.id = ${customer_id}
            order by customers.id desc
          `,
          { raw: true, type: sequelize.QueryTypes.SELECT }
        )
        .then((res) => res[0]);
    }),

    customerDetails: async (parent, args, { models, me }) => {
      let userID = 0;
      if (me) userID = Number(me.id);

      if (!userID) return null;

      return await sequelize
        .query(
          `
            select
              id, full_name, email, email_verify_token, is_email_verified, phone, slug, gender,
              case when profile_pic is null then null else (
                case
                  when profile_pic = 'pic1' then (select pic1 from profiles where customer_id = ${userID})
                  when profile_pic = 'pic2' then (select pic2 from profiles where customer_id = ${userID})
                  when profile_pic = 'pic3' then (select pic3 from profiles where customer_id = ${userID})
                  when profile_pic = 'pic4' then (select pic4 from profiles where customer_id = ${userID})
                else null end
              ) end as profile_pic,
              case when transaction_id is not null or transaction_id <> 0 then 'Yes' else 'No' end as payment_made,
              case when transaction_id is not null or transaction_id <> 0 then (
                select case when payment_id is null then '-' else payment_id end
                from transactions
                where transactions.id = transaction_id and transactions.active is true
              ) else '-' end as payment_id
            from customers
            where id = ${userID}
            order by id desc
          `,
          { raw: true, type: sequelize.QueryTypes.SELECT }
        )
        .then((res) => res[0]);
    },

    customerNameById: async (parent, { customer_id }, { models }) => {
      if (!customer_id || Number(customer_id) === 0) return {};

      const customer = await models.Customer.findOne({
        where: { id: customer_id },
        attributes: ['full_name'],
      }).catch((error) => {
        throw new ApolloError(error.message, 'MUTATION_ERROR');
      });

      if (!customer) return {};

      return customer.dataValues;
    },

    customersNamesListBySearch: async (parent, { searchTerm }, { models }) => {
      if (!searchTerm) return [];
      return await models.Customer.findAll({
        where: {
          active: true,
          [Op.or]: [
            {
              full_name: { [Op.iLike]: `%${searchTerm}%` },
            },
            {
              email: { [Op.iLike]: `%${searchTerm}%` },
            },
          ],
        },
        attributes: ['id', 'full_name', 'email'],
      }).catch((error) => {
        throw new ApolloError(error.message, 'MUTATION_ERROR');
      });
    },

    approvedCustomersBySearch: async (parent, { searchTerm, limit = 20, offset = 0 }) => {
      if (!searchTerm) return [];
      return await sequelize
        .query(
          `
            select
              customers.id, full_name, slug,
              case when profile_pic is null then null else (
                case
                  when profile_pic = 'pic1' then pic1
                  when profile_pic = 'pic2' then pic2
                  when profile_pic = 'pic3' then pic3
                  when profile_pic = 'pic4' then pic4
                else null end
              ) end as profile_pic
            from
              customers
              left outer join profiles on profiles.customer_id = customers.id
            where
              customers.active is true
              and (full_name ilike '%${searchTerm}%' or email ilike '%${searchTerm}%')
              and final_status = 'approved'
            order by id desc
            limit ${limit} offset ${offset}
          `
        )
        .then((res) => res[0]);
    },

    customerBySlug: async (parent, { slug }, { models }) => {
      if (!slug) return null;
      return await sequelize
        .query(
          `
            select
              customers.id, full_name, slug, email, phone, customers.gender, state, city, pincode, dob, bio,
              pic1, pic2, pic3,pic4, share_pic, intro_video, insta_link, insta_verified, fb_link, height, weight,
              personality_meaning,
              case when top_500s.id is null then false else true end as is_in_top500,
              case when top_150s.id is null then false else true end as is_in_top150,
              top_150s.video as top_150_video_link,
              case when top_75s.id is null then false else true end as is_in_top75,
              top_75s.video as top_75_video_link,
              case when top_30s.id is null then false else true end as is_in_top30,
              top_30s.video as top_30_video_link,
              case when top_20s.id is null then false else true end as is_in_top20,
              top_20s.video as top_20_video_link,
              case when top_10s.id is null then false else true end as is_in_top10,
              top_10s.video as top_10_video_link,
              case when top_5s.id is null then false else true end as is_in_top5,
              top_5s.video as top_5_video_link,
              case when winners.id is null then false else true end as is_winner
            from
              customers
              left outer join profiles on profiles.customer_id = customers.id
              left outer join top_500s on top_500s.customer_id = customers.id
              left outer join top_150s on top_150s.customer_id = customers.id
              left outer join top_75s on top_75s.customer_id = customers.id
              left outer join top_30s on top_30s.customer_id = customers.id
              left outer join top_20s on top_20s.customer_id = profiles.customer_id
              left outer join top_10s on top_10s.customer_id = profiles.customer_id
              left outer join top_5s on top_5s.customer_id = profiles.customer_id
              left outer join winners on winners.customer_id = profiles.customer_id
            where
              slug = '${slug}'
              and customers.active = true
              and final_status = 'approved'
          `,
          { raw: true, type: sequelize.QueryTypes.SELECT }
        )
        .then((res) => res[0]);
    },

    customerByVerifyToken: async (parent, { token }, { models }) => {
      if (!token) return {};

      const findCustomer = await models.Customer.findOne({
        where: { email_verify_token: token },
        attributes: ['id'],
      }).catch((error) => {
        throw new ApolloError(error.message, 'MUTATION_ERROR');
      });

      if (!findCustomer) throw new UserInputError("The given 'customer_id' does not exist.");
      else
        findCustomer
          .update({
            is_email_verified: true,
            updated_by: Number(findCustomer.id),
          })
          .catch((error) => {
            throw new ApolloError(error.message, 'MUTATION_ERROR');
          });

      return findCustomer.dataValues;
    },

    customerByResetPasswordToken: async (parent, { token }, { models }) => {
      if (!token) return {};

      const findCustomer = await models.Customer.findOne({
        where: { password_reset_token: token },
        attributes: ['id', 'full_name'],
      }).catch((error) => {
        throw new ApolloError(error.message, 'MUTATION_ERROR');
      });

      if (!findCustomer) throw new UserInputError("The given 'customer_id' does not exist.");

      return findCustomer.dataValues;
    },
  },

  Mutation: {
    addCustomer: combineResolvers(
      isAuthenticated,
      async (parent, { email, full_name, phone, gender, payment_made }, { models, me }) => {
        if (!email) throw new UserInputError('You must provide an email and a password.');
        if (!full_name) throw new UserInputError('You must provide full name.');
        if (!phone || Number(phone) === 0) throw new UserInputError('You must provide a valid phone number.');
        if (!gender || (gender.toLowerCase() !== 'm' && gender.toLowerCase() !== 'f' && gender.toLowerCase() !== 'h'))
          throw new UserInputError('You must provide a gender: either "m" or "f" or "h" as its values.');
        if (payment_made !== 'yes' && payment_made !== 'no') throw new UserInputError('You must provide the city.');

        // const hashedPassword = await bcrypt.hash(password, 10);

        // Check for existing user
        return await models.Customer.findByEmail(email.toLowerCase())
          .then(async (existingCustomer) => {
            if (existingCustomer) throw new UserInputError('e-mail already in use');

            const foundPhone = await models.Customer.findOne({
              attributes: ['id'],
              where: { phone },
            });
            if (foundPhone)
              throw new UserInputError(
                'Phone number is already associated with another account. Please enter a new number.'
              );

            const verification_token = crypto.randomBytes(20).toString('hex');

            let slug = createSlug(full_name, phone);
            const doesSlugExist = await models.Customer.findOne({
              attributes: ['id'],
              where: { slug },
            });
            if (doesSlugExist && !foundPhone) slug += String(Math.random().toFixed(2) * 100);

            const customer = await models.Customer.create({
              full_name,
              email: email.toLowerCase(),
              email_verify_token: verification_token,
              is_email_verified: true,
              is_phone_verified: true,
              phone,
              slug,
              gender: gender.toLowerCase(),
              active: true,
              created_by: Number(me.id),
            });

            if (customer && payment_made === 'yes') {
              const transaction = await models.Transaction.create({
                customer_id: Number(customer.id),
                active: true,
                created_by: Number(me.id),
              }).catch((error) => {
                throw new ApolloError(error.message, 'MUTATION_ERROR');
              });

              await models.Customer.update(
                { transaction_id: transaction ? Number(transaction.id) : null },
                { where: { id: Number(customer.id) } }
              ).catch((error) => {
                throw new ApolloError(error.message, 'MUTATION_ERROR');
              });

              schedule.scheduleJob(`sendMail-${customer.id}`, new Date(Date.now() + 2000), async () => {
                const sendEmailArgs = {
                  templateName: 'initialSeedMail',
                  templateData: { name: full_name.split(' ')[0] },
                  toAddress: email.toLowerCase(),
                  subject: 'Registration Details | OMG – Face Of The Year 2025',
                };
                sendEmail(sendEmailArgs).then(
                  () => console.log(`Payment received mail successfully sent to: ${email.toLowerCase()}.`),
                  (err) => {
                    console.log(`Error while sending payment recieved mail to: ${email.toLowerCase()}.`);
                    console.dir(err.message);
                  }
                );

                const smsText =
                  'Dear Candidate,%0aThank you for registering with OMG. Your registration was successful and payment has been received.%0aRegards,%0aOMG - Face Of The Year 2025';
                await axios
                  .post(
                    `https://api.msg91.com/api/sendhttp.php?authkey=${process.env.MSG91_AUTHKEY}&country=91&mobiles=${phone}&message=${smsText}&sender=OMGFOY&route=4`
                  )
                  .then((res) => console.log(`RESPONSE RECEIVED FOR TRANSACTIONAL SMS TO ${phone} : `, res.data))
                  .catch((err) => console.log(`ERROR FOR TRANSACTIONAL SMS TO ${phone} : `, err));
              });
            }

            return true;
          })
          .catch((error) => {
            throw new ApolloError(error.message, 'MUTATION_ERROR');
          });
      }
    ),

    resendEmailVerification: async (parent, { email }, { models }) => {
      if (!email) throw new UserInputError("Invalid argument provided: 'email'");

      let foundCust = null;

      foundCust = await models.Customer.findOne({
        where: { email },
        attributes: ['full_name', 'email_verify_token'],
      });

      if (!foundCust) throw new UserInputError('No account is associated with this e-mail');
      if (!foundCust.email_verify_token)
        throw new UserInputError(
          "This e-mail is associated with Google/Facebook sign-in, and doesn't need to be verified."
        );

      // sendEmail(email, {
      //   template_name: 'verifyChangedEmail',
      //   template_data: {
      //     full_name: foundCust.full_name,
      //     verification_token: foundCust.email_verify_token,
      //   },
      //   mailSubject: 'oMg : Confirm your e-mail address',
      // });
      return true;
    },

    sendOTPRegister: async (
      parent,
      { full_name, email, phone, gender, utm_referrer, utm_source, utm_medium, utm_campaign, utm_adgroup, utm_content },
      { models }
    ) => {
      // const votingStageStatus = await models.ContestStage.findOne({
      //   attributes: ['active'],
      //   where: { stage: 'online_voting' },
      // });
      // if (votingStageStatus && votingStageStatus.active)
      //   throw new UserInputError('Registration period to participate in the ongoing contest has expired.');

      if (!full_name) throw new UserInputError('Please provide a name');
      if (!phone) throw new UserInputError('Please enter phone number');
      if (!email) throw new UserInputError('Please enter an e-mail');
      if (!gender || (gender.toLowerCase() !== 'm' && gender.toLowerCase() !== 'f' && gender.toLowerCase() !== 'h'))
        throw new UserInputError('You must provide a gender: either "m" or "f" or "h" as its values.');
      const incomingEmail = email.toLowerCase();

      let foundPhone = null;
      foundPhone = await models.Customer.findOne({
        attributes: ['id', 'transaction_id'],
        where: { phone },
      });

      if (foundPhone && foundPhone.transaction_id)
        throw new UserInputError('You have already registered. Please "LOGIN" to continue.');

      const foundEmail = await models.Customer.findOne({
        attributes: ['id'],
        where: { email: incomingEmail },
      });
      if (foundEmail) {
        if (foundPhone) {
          if (Number(foundPhone.id) !== Number(foundEmail.id))
            throw new UserInputError('This e-mail has previously been used with another phone number.');
        } else throw new UserInputError('This e-mail has previously been used with another phone number.');
      }

      let slug = createSlug(full_name, phone);
      const doesSlugExist = await models.Customer.findOne({
        attributes: ['id'],
        where: { slug },
      });
      if (doesSlugExist && !foundPhone) slug += String(Math.random().toFixed(2) * 100);

      const mutateObj = {
        full_name,
        email: incomingEmail,
        phone,
        gender,
        slug,
        utm_referrer,
        utm_source,
        utm_medium,
        utm_campaign,
        utm_adgroup,
        utm_content,
      };

      let postUrl = `https://api.msg91.com/api/v5/otp?authkey=${process.env.MSG91_AUTHKEY}&mobile=91${phone}&email=${email}&template_id=${process.env.MSG91_TEMPLATE}`;

      let request_id = null;
      let errorMsg = null;

      await axios
        .post(postUrl)
        .then((res) => {
          // console.log('RESPONSE RECEIVED: ', res.data);
          if (res.data.type === 'success') request_id = res.data.request_id;
          if (res.data.type === 'error') errorMsg = res.data.message;
        })
        .catch((err) => console.log('---> AXIOS ERROR FOR MSG91: ', err));

      if (errorMsg) throw new ApolloError(errorMsg, 'MSG91_ERROR');
      else if (!request_id) throw new ApolloError('Something went wrong!', 'MSG91_ERROR');
      else {
        if (foundPhone) {
          await foundPhone
            .update({
              ...mutateObj,
              updated_by: Number(foundPhone.id),
            })
            .catch((error) => {
              throw new ApolloError(error.message, 'MUTATION_ERROR');
            });
        } else {
          await models.Customer.create({
            ...mutateObj,
            active: true,
            created_by: 0,
          }).catch((error) => {
            throw new ApolloError(error.message, 'MUTATION_ERROR');
          });
        }

        return { request_id };
      }
    },

    verifyOTPRegister: async (parent, { phone, otp }, { models }) => {
      if (!otp) throw new UserInputError("Invalid argument provided: 'otp'");
      if (!phone) throw new UserInputError("Invalid argument provided: 'phone'");

      let returnBool = false;
      let errorMsg = null;

      await axios
        .post(
          `https://api.msg91.com/api/v5/otp/verify?otp=${otp}&authkey=${process.env.MSG91_AUTHKEY}&mobile=91${phone}`
        )
        .then((res) => {
          console.log('RESPONSE RECEIVED: ', res.data);
          if (res.data.type === 'success') returnBool = true;
          if (res.data.type === 'error')
            errorMsg = res.data.message.toLowerCase().includes('otp not match')
              ? 'Incorrect OTP. Please try again.'
              : res.data.message;
        })
        .catch((err) => console.log('---> AXIOS ERROR FOR MSG91: ', err));

      if (errorMsg) throw new ApolloError(errorMsg, 'MSG91_ERROR');
      else if (!returnBool) throw new ApolloError('Something went wrong!', 'MSG91_ERROR');

      if (returnBool) {
        const findCustomer = await models.Customer.findOne({
          where: { phone: Number(phone) },
          attributes: ['id', 'full_name', 'email', 'phone', 'gender'],
        });

        if (!findCustomer) throw new UserInputError('Invalid customer');
        else
          findCustomer
            .update({
              is_phone_verified: true,
              updated_by: findCustomer.id,
            })
            .catch((error) => {
              throw new ApolloError(error.message, 'MUTATION_ERROR');
            });

        //generate payload for token
        const payload = {
          id: Number(findCustomer.id),
          type: 'customer',
          email: findCustomer.email,
          phone,
        };
        // create token --> a JWT signed using a secret
        const token = jwt.sign(payload, process.env.SECRET);

        return {
          token,
          customerDetails: {
            id: findCustomer.id,
            full_name: findCustomer.full_name,
            email: findCustomer.email,
            phone: findCustomer.phone,
            gender: findCustomer.gender,
          },
        };
      }
    },

    sendOTPLogin: async (parent, { cred }, { models }) => {
      if (!cred) throw new UserInputError('Please enter phone number or e-mail.');

      let whereObj = { transaction_id: { [Op.or]: [{ [Op.not]: null }, { [Op.not]: 0 }] } };
      if (Number(cred)) whereObj = { ...whereObj, phone: Number(cred) };
      else whereObj = { ...whereObj, email: cred.toLowerCase() };

      const foundCustomer = await models.Customer.findOne({
        attributes: ['id', 'phone', 'active', 'email'],
        where: whereObj,
      });

      if (!foundCustomer)
        throw new UserInputError('This phone/e-mail is not registered. Please register and then try again.');

      if (foundCustomer && !foundCustomer.active)
        throw new UserInputError('This account has been deactivated. Please contact OMG Support.');

      console.log(' ');
      console.log(
        `https://api.msg91.com/api/v5/otp?authkey=${process.env.MSG91_AUTHKEY}&mobile=91${foundCustomer.phone}&email=${foundCustomer.email}&template_id=${process.env.MSG91_TEMPLATE}&sender=OMGOTP`
      );

      let postUrl = `https://api.msg91.com/api/v5/otp?authkey=${process.env.MSG91_AUTHKEY}&mobile=91${foundCustomer.phone}&email=${foundCustomer.email}&template_id=${process.env.MSG91_TEMPLATE}&sender=OMGOTP`;

      let request_id = null;
      let errorMsg = null;

      await axios
        .post(postUrl)
        .then((res) => {
          // console.log('RESPONSE RECEIVED: ', res.data);
          if (res.data.type === 'success') request_id = res.data.request_id;
          if (res.data.type === 'error') errorMsg = res.data.message;
        })
        .catch((err) => console.log('---> AXIOS ERROR FOR MSG91: ', err));

      if (errorMsg) throw new ApolloError(errorMsg, 'MSG91_ERROR');
      else if (!request_id) throw new ApolloError('Something went wrong!', 'MSG91_ERROR');
      else return { request_id };
    },

    verifyOTPLogin: async (parent, { cred, otp }, { models }) => {
      if (!otp) throw new UserInputError("Invalid argument provided: 'otp'");
      if (!cred) throw new UserInputError("Either 'phone' or 'email' is necessary");

      let whereObj = {
        transaction_id: { [Op.or]: [{ [Op.not]: null }, { [Op.not]: 0 }] },
      };
      if (Number(cred)) whereObj = { ...whereObj, phone: Number(cred) };
      else whereObj = { ...whereObj, email: cred.toLowerCase() };

      const foundCustomer = await models.Customer.findOne({
        attributes: ['id', 'full_name', 'phone', 'email', 'gender', 'active'],
        where: whereObj,
      });

      if (!foundCustomer)
        throw new UserInputError('This phone/e-mail is not registered. Please register and then try again.');

      if (foundCustomer && !foundCustomer.active)
        throw new UserInputError('This account has been deactivated. Please contact OMG Support.');

      let returnBool = false;
      let errorMsg = null;

      await axios
        .post(
          `https://api.msg91.com/api/v5/otp/verify?otp=${otp}&authkey=${process.env.MSG91_AUTHKEY}&mobile=91${foundCustomer.phone}`
        )
        .then((res) => {
          console.log('RESPONSE RECEIVED: ', res.data);
          if (res.data.type === 'success') returnBool = true;
          if (res.data.type === 'error')
            errorMsg = res.data.message.toLowerCase().includes('otp not match')
              ? 'Incorrect OTP. Please try again.'
              : res.data.message;
        })
        .catch((err) => console.log('---> AXIOS ERROR FOR MSG91: ', err));

      if (errorMsg) throw new ApolloError(errorMsg, 'MSG91_ERROR');
      else if (!returnBool) throw new ApolloError('Something went wrong!', 'MSG91_ERROR');

      if (returnBool) {
        //generate payload for token
        const payload = {
          id: Number(foundCustomer.id),
          type: 'customer',
          email: foundCustomer.email,
          phone: foundCustomer.phone,
        };
        // create token --> a JWT signed using a secret
        const token = jwt.sign(payload, process.env.SECRET);

        return {
          token,
          customerDetails: {
            id: foundCustomer.id,
            full_name: foundCustomer.full_name,
            email: foundCustomer.email,
            phone: foundCustomer.phone,
            gender: foundCustomer.gender,
          },
        };
      }
    },

    sendOTPEditPhone: combineResolvers(isAuthenticated, async (parent, { phone }, { models, me }) => {
      if (!phone) throw new UserInputError('Please enter phone number');

      const foundCustomer = await models.Customer.findOne({
        attributes: ['id', 'phone'],
        where: { id: Number(me.id) },
      });
      if (!foundCustomer) throw new UserInputError('Invalid customer.');

      if (Number(foundCustomer.phone) !== Number(phone)) {
        const foundPhone = await models.Customer.findOne({
          attributes: ['id'],
          where: { phone },
        });
        if (foundPhone) throw new UserInputError('Phone number already in use.');
      }

      let postUrl = `https://api.msg91.com/api/v5/otp?authkey=${process.env.MSG91_AUTHKEY}&mobile=91${phone}&template_id=${process.env.MSG91_TEMPLATE}`;

      let request_id = null;
      let errorMsg = null;

      await axios
        .post(postUrl)
        .then((res) => {
          // console.log('RESPONSE RECEIVED: ', res.data);
          if (res.data.type === 'success') request_id = res.data.request_id;
          if (res.data.type === 'error') errorMsg = res.data.message;
        })
        .catch((err) => console.log('---> AXIOS ERROR FOR MSG91: ', err));

      if (errorMsg) throw new ApolloError(errorMsg, 'MSG91_ERROR');
      else if (!request_id) throw new ApolloError('Something went wrong!', 'MSG91_ERROR');
      else return { request_id };
    }),

    verifyOTPEditPhone: combineResolvers(isAuthenticated, async (parent, { phone, otp }, { models, me }) => {
      if (!otp) throw new UserInputError("Invalid argument provided: 'otp'");
      if (!phone) throw new UserInputError("Invalid argument provided: 'phone'");

      const foundCustomer = await models.Customer.findOne({
        attributes: ['id'],
        where: { id: Number(me.id) },
      });
      if (!foundCustomer) throw new UserInputError('Invalid customer.');

      let returnBool = false;
      let errorMsg = null;

      await axios
        .post(
          `https://api.msg91.com/api/v5/otp/verify?otp=${otp}&authkey=${process.env.MSG91_AUTHKEY}&mobile=91${phone}`
        )
        .then((res) => {
          console.log('RESPONSE RECEIVED: ', res.data);
          if (res.data.type === 'success') returnBool = true;
          if (res.data.type === 'error')
            errorMsg = res.data.message.toLowerCase().includes('otp not match')
              ? 'Incorrect OTP. Please try again.'
              : res.data.message;
        })
        .catch((err) => console.log('---> AXIOS ERROR FOR MSG91: ', err));

      if (errorMsg) throw new ApolloError(errorMsg, 'MSG91_ERROR');
      else if (!returnBool) throw new ApolloError('Something went wrong!', 'MSG91_ERROR');

      if (returnBool)
        foundCustomer
          .update({
            phone,
            updated_by: Number(me.id),
          })
          .catch((error) => {
            throw new ApolloError(error.message, 'MUTATION_ERROR');
          });

      return returnBool;
    }),

    editCustomerDetails: combineResolvers(
      isAuthenticated,
      async (
        parent,
        // prettier-ignore
        { id, full_name, email, phone, is_email_verified, gender, payment_made, fromCMS },
        { models, me }
      ) => {
        if (fromCMS && (!id || Number(id) === 0)) throw new UserInputError('Invalid customer');
        const incomingCustomerId = fromCMS ? Number(id) : Number(me.id);
        console.log('fromCMS, id, incomingCustomerId', fromCMS, id, incomingCustomerId);

        if (is_email_verified && is_email_verified !== 'yes' && is_email_verified !== 'no')
          throw new UserInputError('Inavlid argument provided: "is_email_verified".');

        if (payment_made && payment_made !== 'yes' && payment_made !== 'no')
          throw new UserInputError('Inavlid argument provided: "payment_made".');

        if (gender && gender.toLowerCase() !== 'm' && gender.toLowerCase() !== 'f' && gender.toLowerCase() !== 'h')
          throw new UserInputError('You must provide a gender: either "m" or "f" or "h" as its values.');

        // nothing to update
        if (!full_name && !email && !phone && !gender && !is_email_verified && !payment_made) return true;

        // prettier-ignore
        const findCustomer = await models.Customer.findOne({
          where: { id: incomingCustomerId },
          attributes: ['id', 'full_name', 'email', 'phone', 'is_email_verified', 'email_verify_token']
        });

        if (!findCustomer) throw new UserInputError('Invalid customer');
        else {
          let updateObj = {};

          if (full_name) updateObj = { ...updateObj, full_name };
          if (gender) updateObj = { ...updateObj, gender: gender.toLowerCase() };

          if (phone && Number(findCustomer.phone) !== Number(phone)) {
            const foundPhone = await models.Customer.findOne({
              attributes: ['id'],
              where: { phone },
              order: [['id', 'DESC']],
            });
            if (foundPhone) throw new UserInputError('Phone number already in use');
            else
              updateObj = {
                ...updateObj,
                phone,
                is_phone_verified: true,
              };
          }

          if (is_email_verified) {
            updateObj = {
              ...updateObj,
              is_email_verified: is_email_verified === 'yes' ? true : false,
            };
          }

          if (email && findCustomer.email !== email) {
            const foundEmail = await models.Customer.findOne({
              attributes: ['id'],
              where: { email: { [Op.iLike]: email } },
            });

            if (foundEmail) throw new UserInputError('e-mail already in use');
            else {
              updateObj = {
                ...updateObj,
                email: email.toLowerCase(),
                is_email_verified: false,
              };
            }
          }

          let sendWelcomeMail = false;
          if (payment_made) {
            let transaction_id = null;
            if (payment_made === 'yes') {
              const foundTransaction = await models.Transaction.findOne({
                attributes: ['id', 'active'],
                where: { customer_id: incomingCustomerId },
              });
              if (foundTransaction) {
                transaction_id = Number(foundTransaction.id);
                if (!foundTransaction.active)
                  foundTransaction.update({ active: true, updated_by: Number(me.id) }).catch((error) => {
                    throw new ApolloError(error.message, 'MUTATION_ERROR');
                  });
              } else {
                const transaction = await models.Transaction.create({
                  customer_id: incomingCustomerId,
                  active: true,
                  created_by: Number(me.id),
                }).catch((error) => {
                  throw new ApolloError(error.message, 'MUTATION_ERROR');
                });
                transaction_id = Number(transaction.id);
                sendWelcomeMail = true;
              }
            } else if (payment_made === 'no') {
              transaction_id = null;
              const foundTransaction = await models.Transaction.findOne({
                attributes: ['id', 'active'],
                where: { customer_id: incomingCustomerId },
              });

              if (foundTransaction) {
                if (foundTransaction.active)
                  foundTransaction.update({ active: false, updated_by: Number(me.id) }).catch((error) => {
                    throw new ApolloError(error.message, 'MUTATION_ERROR');
                  });
              }
            }
            updateObj = { ...updateObj, transaction_id };
          }

          if (Object.keys(updateObj).length)
            await models.Customer.update(
              {
                ...updateObj,
                updated_by: Number(me.id),
              },
              { where: { id: incomingCustomerId } }
            ).catch((error) => {
              throw new ApolloError(error.message, 'MUTATION_ERROR');
            });

          if (sendWelcomeMail)
            schedule.scheduleJob(`sendMail-${incomingCustomerId}`, new Date(Date.now() + 2000), async () => {
              const sendEmailArgs = {
                templateName: 'initialSeedMail',
                templateData: { name: full_name.split(' ')[0] },
                toAddress: email.toLowerCase(),
                subject: 'Registration Details | OMG – Face Of The Year 2025',
              };
              sendEmail(sendEmailArgs).then(
                () => console.log(`Payment received mail successfully sent to: ${email.toLowerCase()}.`),
                (err) => {
                  console.log(`Error while sending payment recieved mail to: ${email.toLowerCase()}.`);
                  console.dir(err.message);
                }
              );

              const smsText =
                'Dear Candidate,%0aThank you for registering with OMG. Your registration was successful and payment has been received.%0aRegards,%0aOMG - Face Of The Year 2025';
              await axios
                .post(
                  `https://api.msg91.com/api/sendhttp.php?authkey=${process.env.MSG91_AUTHKEY}&country=91&mobiles=${phone}&message=${smsText}&sender=OMGFOY&route=4`
                )
                .then((res) => console.log(`RESPONSE RECEIVED FOR TRANSACTIONAL SMS TO ${phone} : `, res.data))
                .catch((err) => console.log(`ERROR FOR TRANSACTIONAL SMS TO ${phone} : `, err));
            });
        }

        return models.Customer.findOne({
          where: { id: incomingCustomerId },
          attributes: ['id', 'full_name', 'email', 'phone'],
        });
      }
    ),

    changeCustomerPassword: combineResolvers(
      isAuthenticated,
      async (parent, { customer_id, current_password, password }, { models, me }) => {
        if ((!customer_id || Number(customer_id) === 0) && !me) throw new UserInputError('Invalid customer');
        if (!password) throw new UserInputError("Invalid argument provided: 'password'");

        const incomingCustomerId = me ? Number(me.id) : Number(customer_id);

        const findCustomer = await models.Customer.findOne({
          where: { id: incomingCustomerId },
          attributes: ['id', 'password'],
        });

        if (!findCustomer) throw new UserInputError('Invalid customer.');
        else {
          if (current_password !== findCustomer.password) throw new UserInputError('Incorrect old password.');
          else
            findCustomer
              .update({
                password,
                updated_by: incomingCustomerId,
              })
              .catch((error) => {
                throw new ApolloError(error.message, 'MUTATION_ERROR');
              });
        }

        return true;
      }
    ),

    resetCustomerPasswordRequest: async (parent, { email }, { models }) => {
      if (!email) throw new UserInputError("Invalid argument provided: 'email'");

      // search for the customer
      const findCustomer = await models.Customer.findByEmail(email);
      if (!findCustomer) throw new UserInputError('This e-mail is not associated with any account.');

      if (!findCustomer.password && findCustomer.social_id && findCustomer.social_source)
        throw new UserInputError(
          `This e-mail has been used previously for ${
            findCustomer.social_source[0].toUpperCase() + findCustomer.social_source.substr(1)
          } Login. Please try signing-in via that route.`
        );

      // check if customer is active
      if (!findCustomer.active)
        throw new AuthenticationError('This customer is no longer active. Please contact admin for more details');

      const password_reset_token = crypto.randomBytes(20).toString('hex');

      findCustomer
        .update({
          password_reset_token,
          updated_by: 0,
        })
        .catch((error) => {
          throw new ApolloError(error.message, 'MUTATION_ERROR');
        });

      // Send reset password e-mail to customer
      // sendEmail(email, {
      //   template_name: 'passwordReset',
      //   template_data: {
      //     full_name: findCustomer.full_name,
      //     password_reset_token,
      //   },
      //   mailSubject: 'Reset your password',
      // });

      return true;
    },

    resetCustomerPassword: async (parent, { customer_id, password }, { models }) => {
      if (!customer_id || Number(customer_id) === 0)
        throw new UserInputError("Invalid argument provided: 'customer_id'");
      if (!password) throw new UserInputError("Invalid argument provided: 'password'");

      const findCustomer = await models.Customer.findOne({
        where: { id: customer_id },
        attributes: ['id'],
      });

      if (!findCustomer) throw new UserInputError("The given 'customer_id' does not exist.");
      else
        findCustomer
          .update({
            password,
            updated_by: Number(customer_id),
          })
          .catch((error) => {
            throw new ApolloError(error.message, 'MUTATION_ERROR');
          });

      return true;
    },

    updateCustomerPhone: async (parent, { customer_id, phone }, { models }) => {
      if (!customer_id || Number(customer_id) === 0)
        throw new UserInputError("Invalid argument provided: 'customer_id'");
      if (!phone) throw new UserInputError("Invalid argument provided: 'phone'");

      const findCustomer = await models.Customer.findOne({
        where: { id: customer_id },
        attributes: ['id'],
      });

      if (!findCustomer) throw new UserInputError("The given 'customer_id' does not exist.");
      else
        findCustomer
          .update({
            phone,
            is_phone_verified: true,
            updated_by: Number(customer_id),
          })
          .catch((error) => {
            throw new ApolloError(error.message, 'MUTATION_ERROR');
          });

      return true;
    },

    changeCustomerStatus: combineResolvers(isAuthenticated, async (parent, { customer_id, status }, { models, me }) => {
      if (!customer_id || Number(customer_id) === 0)
        throw new UserInputError("Invalid argument provided: 'customer_id'");
      if (status !== true && status !== false)
        throw new UserInputError(
          "Invalid argument provided: 'status'. It should have either 'true' or 'false' as value."
        );

      const foundCustomer = await models.Customer.findOne({
        where: { id: customer_id },
        attributes: ['id'],
      }).catch((error) => {
        throw new ApolloError(error.message, 'MUTATION_ERROR');
      });

      if (!foundCustomer) throw new UserInputError('Given customer data does not exist.');
      else {
        await foundCustomer
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

    generateRazorpayOrderId: combineResolvers(isAuthenticated, async (parent, { amount }, { models, me }) => {
      let toShowData = true;
      const custInfo = await models.Customer.findOne({
        attributes: ['is_phone_verified', 'active'],
        where: { id: Number(me.id) },
      });
      toShowData = custInfo && custInfo.is_phone_verified && custInfo.active;

      if (!toShowData)
        throw new UserInputError(
          'Either your phone number is not verified, or, your account has been made inactive by the admin.'
        );

      let options = {
        amount, // amount in the smallest currency unit
        currency: 'INR',
        receipt: `customer #${me.id}`,
        payment_capture: '1',
      };

      let returnData = {};

      await instance.orders.create(options, async (err, order) => {
        // console.log('===== ORDER: ', order);
        if (err)
          await models.Error.create({
            source: 'razorpay',
            related_customer_id: Number(me.id),
            error: `Error while generating Order-ID: ${err}`,
            active: true,
          });

        if (order) {
          returnData = order;

          await models.PaymentRequest.create({
            customer_id: Number(me.id),
            order_id: order.id,
            status: 'initiated',
            active: true,
          });
        }
      });

      return returnData;
    }),

    addPayment: combineResolvers(isAuthenticated, async (parent, { payment_id, order_id, amount }, { models, me }) => {
      // prettier-ignore
      console.log('addSubscriber called --> customer: ', me.id, ', payment_id: ', payment_id);

      if (!order_id) throw new UserInputError("Invalid argument provided: 'order_id'.");
      if (!payment_id) throw new UserInputError("Invalid argument provided: 'payment_id'.");
      if (!amount) throw new UserInputError("Invalid argument provided: 'amount'.");

      if (payment_id) {
        const doesTransactionExist = await models.Transaction.findOne({
          where: { payment_id },
        });
        if (doesTransactionExist) console.log(`Transaction for ${payment_id} already exists.`);
        else {
          const transaction = await models.Transaction.create({
            customer_id: Number(me.id),
            payment_id,
            order_id,
            amount,
            source: 'mutation',
            active: true,
            created_by: Number(me.id),
          }).catch((error) => {
            throw new ApolloError(error.message, 'MUTATION_ERROR');
          });

          await models.Customer.update(
            {
              transaction_id: transaction.id,
              updated_by: Number(me.id),
            },
            { where: { id: Number(me.id) } }
          ).catch((error) => {
            throw new ApolloError(error.message, 'MUTATION_ERROR');
          });

          const foundRequest = await models.PaymentRequest.findOne({
            attributes: ['id', 'customer_id', 'order_id', 'status'],
            where: { order_id },
          });

          if (foundRequest && foundRequest.status === 'initiated') foundRequest.update({ status: 'completed' });

          schedule.scheduleJob(`sendMail-${me.id}`, new Date(Date.now() + 2000), async () => {
            const custInfo = await models.Customer.findOne({
              attributes: ['full_name', 'email', 'phone'],
              where: { id: Number(me.id) },
            });

            if (custInfo) {
              const sendEmailArgs = {
                templateName: 'paymentReceived',
                templateData: {
                  name: custInfo.full_name.split(' ')[0],
                  order_id,
                },
                toAddress: custInfo.email,
                subject: 'Registration Details | OMG – Face Of The Year 2025',
              };
              sendEmail(sendEmailArgs).then(
                () => console.log(`Payment received mail successfully sent to: ${custInfo.email}.`),
                (err) => {
                  console.log(`Error while sending payment recieved mail to: ${custInfo.email}.`);
                  console.dir(err.message);
                }
              );

              const smsText =
                'Dear Candidate,%0aThank you for registering with OMG. Your registration was successful and payment has been received.%0aRegards,%0aOMG - Face Of The Year 2025';
              await axios
                .post(
                  `https://api.msg91.com/api/sendhttp.php?authkey=${process.env.MSG91_AUTHKEY}&country=91&mobiles=${custInfo.phone}&message=${smsText}&sender=OMGFOY&route=4`
                )
                .then((res) => console.log(`RESPONSE RECEIVED FOR TRANSACTIONAL SMS TO ${custInfo.phone} : `, res.data))
                .catch((err) => console.log(`ERROR FOR TRANSACTIONAL SMS TO ${custInfo.phone} : `, err));
            }
          });
        }
      }
      return true;
    }),

    paymentFailed: combineResolvers(isAuthenticated, async (parent, args, { models, me }) => {
      schedule.scheduleJob(`sendFailureMail-${me.id}`, new Date(Date.now() + 1000), async () => {
        const custInfo = await models.Customer.findOne({
          attributes: ['full_name', 'email', 'phone'],
          where: { id: Number(me.id) },
        });

        if (custInfo) {
          const sendEmailArgs = {
            templateName: 'paymentFailed',
            templateData: { name: custInfo.full_name.split(' ')[0] },
            toAddress: custInfo.email,
            subject: 'Registration Unsuccessful | OMG – Face Of The Year 2025',
          };
          sendEmail(sendEmailArgs).then(
            () => console.log(`Payment failure mail successfully sent to: ${custInfo.email}.`),
            (err) => {
              console.log(`Error while sending payment failure mail to: ${custInfo.email}.`);
              console.dir(err.message);
            }
          );

          const smsText =
            'Dear Candidate,%0aWe regret to inform you that your registration for OMG - Face Of The Year 2025 was incomplete.%0aKindly, check your email for further details.%0aRegards,%0aOMG - Face Of The Year 2025';
          await axios
            .post(
              `https://api.msg91.com/api/sendhttp.php?authkey=${process.env.MSG91_AUTHKEY}&country=91&mobiles=${custInfo.phone}&message=${smsText}&sender=OMGFOY&route=4`
            )
            .then((res) => console.log(`RESPONSE RECEIVED FOR TRANSACTIONAL SMS TO ${custInfo.phone} : `, res.data))
            .catch((err) => console.log(`ERROR FOR TRANSACTIONAL SMS TO ${custInfo.phone} : `, err));
        }
      });

      return true;
    }),

    referOthersMail: async (par, a, { models }) => {
      // const approvedProfiles = await models.Profile.findAll({
      //   attributes: ['customer_id'],
      //   where: { final_status: 'approved' },
      // });
      // const approvedIDs = approvedProfiles.map((e) => Number(e.customer_id));
      // const approvedCustomers = await models.Customer.findAll({
      //   attributes: ['id', 'full_name', 'slug', 'email'],
      //   where: { id: approvedIDs },
      // });

      const approvedCustomers = [
        // { id: 1, full_name: 'Lavanya Patil', slug: 'lavanya-patil-9266', email: 'lavnya.patil@pbltd.in' },
        // { id: 1, full_name: 'Roshan Shetty', slug:'roshan-shetty-4545', email: 'roshan@pixels.agency' },
        { id: 1, full_name: 'Ashish Pathak', slug: 'ashish-pathak-2603', email: 'ashish@pixels.agency' },
      ];

      for (let i = 0; i < approvedCustomers.length; i++) {
        const obj = approvedCustomers[i];
        // console.log('obj ==> ', obj);
        schedule.scheduleJob(`sendMail-${obj.id}`, new Date(Date.now() + 1000), async () => {
          const sendEmailArgs = {
            templateName: 'referCandidates',
            templateData: { name: obj.full_name.split(' ')[0], slug: obj.slug },
            toAddress: obj.email,
            subject: 'The Leader Board Race | #BringYourBuddy',
          };
          sendEmail(sendEmailArgs).then(
            () => console.log(`${obj.id} "Refer others" mail successfully sent to: ${obj.email}.`),
            (err) => {
              console.log(`${obj.id} Error while sending "refer others" mail to: ${obj.email}.`);
              console.dir(err.message);
            }
          );
        });
      }

      return true;
    },

    // ===================== TESTING MUTATIONS ========================================

    sesTest: async () => {
      const sendEmailArgs = {
        templateName: 'top150Losers',
        templateData: { name: 'Vaibhav XYZ'.split(' ')[0] },
        toAddress: 'ashish@pixels.agency',
        subject: 'Important News from OMG – Face Of The Year 2025',
      };
      sendEmail(sendEmailArgs).then(
        (res) => console.log('mail sent successfully.', res),
        (ex) => {
          console.log('Error in sending mail.');
          console.dir(ex.message);
        }
      );

      // createTemplate().then(
      //   () => console.log('template created successfully.'),
      //   (ex) => {
      //     console.log('Error in template creation.');
      //     console.dir(ex.message);
      //   }
      // );

      // updateTemplate().then(
      //   () => console.log('template updated successfully.'),
      //   (ex) => {
      //     console.log('Error in template updation.');
      //     console.dir(ex.message);
      //   }
      // );

      // const full_name = 'Ashish Pathak';
      // const templateData = JSON.stringify({ name: full_name.split(' ')[0], reject_reason: "Should be 'horizontal'." });
      // sendTemplateEmail(['ashish@pixels.agency'], 'TestTemplate', templateData).then(
      //   () => console.log('mail sent successfully.'),
      //   (ex) => {
      //     console.log('Error in sending mail.');
      //     console.dir(ex.message);
      //   }
      // );

      // sendBulkEmail(['ashish@pixels.agency', 'ashishh2603@gmail.com'], 'PaymentReceivedTemplate').then(
      //   () => console.log('mail sent successfully.'),
      //   (ex) => {
      //     console.log('Error in sending mail.');
      //     console.dir(ex.message);
      //   }
      // );

      return true;
    },

    initialDataSeed: async (par, a, { models }) => {
      const newCust = await models.Customer.findAll({ where: { id: { [Op.gte]: 127 } } });

      // const newCust = [
      //   // { id: 1, full_name: 'Sahil Sultan', email: 'sahilsultan10@gmail.com' },
      //   // { id: 2, full_name: 'Sidharth Thada', email: '30588panks@gmail.com' },
      //   // { id: 1, full_name: 'Bhavesh Parihar', email: 'bhaveshparihar2002@gmail.com' },
      //   // { id: 1, full_name: 'Aakash Aswani', email: 'aswaniaakash1996@gmail.com' },
      //   // { id: 1, full_name: 'Mohit Chauhan', email: 'mohitchauhanihm@gmail.com' },
      //   { id: 1, full_name: 'Ashish Pathak', email: 'ashish@pixels.agency' },
      // ];

      for (let i = 0; i < newCust.length; i++) {
        const obj = newCust[i];
        console.log('obj ==> ', obj);

        const transaction = await models.Transaction.create({
          customer_id: Number(obj.id),
          active: true,
          created_by: 0,
        }).catch((error) => {
          throw new ApolloError(error.message, 'MUTATION_ERROR');
        });

        await models.Customer.update(
          { transaction_id: transaction ? Number(transaction.id) : null },
          { where: { id: Number(obj.id) } }
        ).catch((error) => {
          throw new ApolloError(error.message, 'MUTATION_ERROR');
        });

        // schedule.scheduleJob(`sendMail-${obj.id}`, new Date(Date.now() + 1000), async () => {
        //   const sendEmailArgs = {
        //     templateName: 'initialSeedMail',
        //     templateData: { name: obj.full_name.split(' ')[0] },
        //     toAddress: obj.email,
        //     subject: 'Registration Details | OMG – Face Of The Year 2025',
        //   };
        //   sendEmail(sendEmailArgs).then(
        //     () => console.log(`${obj.id} Welcome mail successfully sent to: ${obj.email}.`),
        //     (err) => {
        //       console.log(`${obj.id} Error while sending welcome mail to: ${obj.email}.`);
        //       console.dir(err.message);
        //     }
        //   );
        // });
      }

      return true;
    },
  },
};
