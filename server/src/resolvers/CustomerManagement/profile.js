import { combineResolvers } from 'graphql-resolvers';
import { UserInputError, ApolloError } from 'apollo-server';
import schedule from 'node-schedule';
import axios from 'axios';
import _ from 'lodash';
import sequelize from '../../services/sequelizeConfig';
import { sendEmail } from '../../services/awsSES';
import { UploadAndSetData, UnlinkFile } from '../../services/uploadS3Bucket';
import { isAuthenticated } from '../authorization';
import Jimp from 'jimp';

const Op = sequelize.Op;

export default {
  Query: {
    profileByCustomerId: combineResolvers(isAuthenticated, async (parent, { customer_id }, { models }) => {
      return await sequelize
        .query(
          `
            select
              profiles.id as id, profiles.*,
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
              profiles
              left outer join top_500s on top_500s.customer_id = profiles.customer_id
              left outer join top_150s on top_150s.customer_id = profiles.customer_id
              left outer join top_75s on top_75s.customer_id = profiles.customer_id
              left outer join top_30s on top_30s.customer_id = profiles.customer_id
              left outer join top_20s on top_20s.customer_id = profiles.customer_id
              left outer join top_10s on top_10s.customer_id = profiles.customer_id
              left outer join top_5s on top_5s.customer_id = profiles.customer_id
              left outer join winners on winners.customer_id = profiles.customer_id
            where profiles.customer_id = ${customer_id}
          `,
          { raw: true, type: sequelize.QueryTypes.SELECT }
        )
        .then((res) => res[0]);
    }),

    exportAllProfiles: combineResolvers(isAuthenticated, async (parent, { final_status }) => {
      return await sequelize
        .query(
          `
            select
              customers.id, full_name, email, phone, state, city, pincode, utm_referrer, utm_source,
              utm_medium, utm_campaign, utm_adgroup, utm_content, customers.active,
              case when gender = 'm' then 'Male' else 'Female' end as gender,
              case when insta_verified is true then 'Yes' else 'No' end as insta_verified_string,
              case when dob is null then null else
                to_char(to_timestamp((dob :: bigint) / 1000), 'DD Mon YYYY')
              end as dob,
              case when transaction_id is null then '-' else 'Yes' end as payment_made,
              payment_id,
              bio, insta_link, fb_link, height, weight, personality_meaning,
              to_char((transactions."createdAt" + interval '5 hours 30 minutes'), 'DD Mon YYYY') as payment_made_date
            from
              customers
              left outer join profiles on profiles.customer_id = customers.id
              left outer join transactions on transactions.id = transaction_id
            where
              transaction_id is not null
              and not (
                state is null or city is null or pincode is null or bio is null or insta_link is null
                or height is null or weight is null or dob is null or pic1 is null or pic2 is null
                or pic3 is null or pic4 is null or intro_video is null
              )
              ${final_status ? `and final_status = '${final_status}'` : ''}
            order by transactions."createdAt" desc
          `
        )
        .then((res) => res[0]);
    }),

    exportPartialProfiles: combineResolvers(isAuthenticated, async () => {
      return await sequelize
        .query(
          `
            select
              customers.id, full_name, email, phone, state, city, pincode, utm_referrer, utm_source,
              utm_medium, utm_campaign, utm_adgroup, utm_content, customers.active,
              case when gender = 'm' then 'Male' else 'Female' end as gender,
              case when insta_verified is true then 'Yes' else 'No' end as insta_verified_string,
              case when dob is null then null else
                to_char(to_timestamp((dob :: bigint) / 1000), 'DD Mon YYYY')
              end as dob,
              case when transaction_id is null then '-' else 'Yes' end as payment_made,
              payment_id,
              bio, insta_link, fb_link, height, weight, personality_meaning,
              to_char((transactions."createdAt" + interval '5 hours 30 minutes'), 'DD Mon YYYY') as payment_made_date
            from
              customers
              left outer join profiles on profiles.customer_id = customers.id
              left outer join transactions on transactions.id = transaction_id
            where
              transaction_id is not null
              and (
                final_status is null or final_status = 'draft' or state is null or city is null
                or pincode is null or bio is null or insta_link is null or height is null or weight is null
                or dob is null or pic1 is null or pic2 is null or pic3 is null or pic4 is null or intro_video is null
              )
            order by transactions."createdAt" desc
          `
        )
        .then((res) => res[0]);
    }),

    exportUnpaidCustomers: combineResolvers(isAuthenticated, async () => {
      return await sequelize
        .query(
          `
            select
              id, full_name, email, phone, utm_referrer, utm_source, utm_medium, utm_campaign, utm_adgroup,
              utm_content, active,
              case when gender = 'm' then 'Male' else 'Female' end as gender,
              null as state, null as city, null as pincode, null as insta_verified_string, null as dob,
              '-' as payment_made, null as payment_id, null as personality_meaning, null as bio,
              null as insta_link, null as fb_link, null as height, null as weight,
              to_char(("createdAt" + interval '5 hours 30 minutes'), 'DD-MM-YYYY') as payment_made_date
            from customers
            where transaction_id is null
            order by id desc
          `
        )
        .then((res) => res[0]);
    }),

    randomApprovedProfiles: async () => {
      const approvedFemales = await sequelize
        .query(
          `
            select customer_id
            from
              profiles
              left outer join customers on customers.id = customer_id
            where final_status = 'approved' and gender = 'f'
          `
        )
        .then((res) => res[0]);

      const femaleIDs = approvedFemales.map((obj) => obj.customer_id);
      const random5FemaleIDs = _.sampleSize(femaleIDs, 5);

      const approvedMales = await sequelize
        .query(
          `
            select customer_id
            from
              profiles
              left outer join customers on customers.id = customer_id
            where final_status = 'approved' and gender = 'm'
          `
        )
        .then((res) => res[0]);

      const maleIDs = approvedMales.map((obj) => obj.customer_id);
      const random5MaleIDs = _.sampleSize(maleIDs, 5);

      const randomIDs = _.shuffle([...random5FemaleIDs, ...random5MaleIDs]);

      return await sequelize
        .query(
          `
            select customer_id as id, full_name, pic1, city, gender
            from
              profiles
              left outer join customers on customers.id = customer_id
            where customer_id in (${randomIDs})
            order by array_position(array[${randomIDs}], customer_id)
          `
        )
        .then((res) => res[0]);
    },
  },

  Mutation: {
    upsertProfile: combineResolvers(isAuthenticated, async (parent, args, { models, me }) => {
      // prettier-ignore
      const { customer_id, dob, state, city, pincode, profile_pic, bio, insta_link, insta_verified, fb_link,
              height, weight, pic1, pic2, pic3,pic4, pic1_status, pic1_score, pic2_status, pic2_score, pic3_status, pic4_score,pic4_status,
              pic3_score, intro_video, intro_video_status, final_status, deletedFiles, personality_meaning,
              fromCMS }
        = args;

      console.log('args', args);

      if (fromCMS && (!customer_id || Number(customer_id) === 0)) throw new UserInputError('Invalid customer');
      const incomingCustomerId = fromCMS ? Number(customer_id) : Number(me.id);

      if (!fromCMS && (!final_status || (final_status !== 'draft' && final_status !== 'pending')))
        throw new UserInputError('"final_status" should be provided: either "draft" or "pending".');

      if (dob && Number(dob) === 0) throw new UserInputError('You must provide a date of birth.');

      if (profile_pic && profile_pic !== 'pic1' && profile_pic !== 'pic2' && profile_pic !== 'pic3')
        throw new UserInputError("Invalid argument 'profile_pic': It's value should be either 'pic1', 'pic2', 'pic3'.");

      const foundProfile = await models.Profile.findOne({
        attributes: ['id', 'pic1', 'pic2', 'pic3', 'intro_video'],
        where: { customer_id: incomingCustomerId },
      });

      const foundCustomer = await models.Customer.findOne({
        attributes: ['id', 'slug', 'gender'],
        where: { id: incomingCustomerId },
      });

      const isHairstylist = foundCustomer && foundCustomer.gender === 'h';

      console.log('isHairstylist', isHairstylist);

      let upsertObj = {};
      if (!fromCMS) upsertObj = { ...upsertObj, final_status };
      if (final_status === 'pending' || final_status === 'approved') upsertObj = { ...upsertObj, reject_reason: null };
      if (bio) upsertObj = { ...upsertObj, bio };
      if (dob) upsertObj = { ...upsertObj, dob };
      if (insta_link) upsertObj = { ...upsertObj, insta_link };
      if (insta_verified === true || insta_verified === false) upsertObj = { ...upsertObj, insta_verified };
      if (fb_link) upsertObj = { ...upsertObj, fb_link };
      if (height) upsertObj = { ...upsertObj, height };
      if (weight) upsertObj = { ...upsertObj, weight: Number(weight) };
      if (personality_meaning) upsertObj = { ...upsertObj, personality_meaning };
      if (pic1_status) upsertObj = { ...upsertObj, pic1_status };
      if (!isHairstylist) {
        if (pic2_status) upsertObj = { ...upsertObj, pic2_status };
        if (pic3_status) upsertObj = { ...upsertObj, pic3_status };
        if (pic4_status) upsertObj = { ...upsertObj, pic4_status };
      }
      if (intro_video_status) upsertObj = { ...upsertObj, intro_video_status };
      if (pic1_score) upsertObj = { ...upsertObj, pic1_score: Number(pic1_score) };
      if (!isHairstylist) {
        if (pic2_score) upsertObj = { ...upsertObj, pic2_score: Number(pic2_score) };
        if (pic3_score) upsertObj = { ...upsertObj, pic3_score: Number(pic3_score) };
        if (pic4_score) upsertObj = { ...upsertObj, pic4_score: Number(pic4_score) };
      }

      if (pincode) upsertObj = { ...upsertObj, pincode };
      if (state) upsertObj = { ...upsertObj, state };

      if (city)
        upsertObj = {
          ...upsertObj,
          city: city
            .toLowerCase()
            .split(' ')
            .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
            .join(' '),
        };

      if (pic1 && typeof pic1 === 'object') {
        const updateData1 = await UploadAndSetData({
          file: pic1,
          variable: 'file',
          uploadFolder: 'customer-profile-pic',
          appendSlug: foundCustomer.slug || `customer-id-${incomingCustomerId}`,
        });
        upsertObj = {
          ...upsertObj,
          pic1: updateData1.file,
          pic1_status: fromCMS ? pic1_status : 'pending',
        };

        if (updateData1.file && foundProfile && foundProfile.pic1)
          await UnlinkFile(foundProfile.pic1, 'customer-profile-pic').catch((err) =>
            console.log('Error while deleting "pic1" from profile: ', err)
          );
      }

      if (!isHairstylist) {
        if (pic2 && typeof pic2 === 'object') {
          const updateData2 = await UploadAndSetData({
            file: pic2,
            variable: 'file',
            uploadFolder: 'customer-profile-pic',
            appendSlug: foundCustomer.slug || `customer-id-${incomingCustomerId}`,
          });
          upsertObj = {
            ...upsertObj,
            pic2: updateData2.file,
            pic2_status: fromCMS ? pic2_status : 'pending',
          };

        // try {
        //   let profileImage = await Jimp.read(
        //     `https://api.omgfaceoftheyear.com/public/images/customer-profile-pic/${updateData2.file}`
        //   );
        //   profileImage = profileImage.resize(300, 400);
        //   const backgroundImage = await Jimp.read(
        //     'https://api.omgfaceoftheyear.com/public/images/share-pic-background.jpg'
        //   );
        //   profileImage = await profileImage;

        //   await backgroundImage.composite(profileImage, 175, 50, {
        //     mode: Jimp.BLEND_SOURCE_OVER,
        //     opacityDest: 1,
        //     opacitySource: 1,
        //   });

        //   const randomNumber = Math.floor(Math.random() * 100000);
        //   const imgName = new Date().getTime() + randomNumber + '.jpg';
        //   await backgroundImage.write(`./public/images/customer-profile-pic/${imgName}`);

        //   upsertObj = { ...upsertObj, share_pic: imgName };
        // } catch (error) {
        //   console.log('Error while saving manipulated image using Jimp: ', error);
        // }

        if (updateData2.file && foundProfile && foundProfile.pic2)
          await UnlinkFile(foundProfile.pic2, 'customer-profile-pic').catch((err) =>
            console.log('Error while deleting "pic2" from profile: ', err)
          );
      }

        if (pic3 && typeof pic3 === 'object') {
          const updateData3 = await UploadAndSetData({
            file: pic3,
            variable: 'file',
            uploadFolder: 'customer-profile-pic',
            appendSlug: foundCustomer.slug || `customer-id-${incomingCustomerId}`,
          });
          upsertObj = {
            ...upsertObj,
            pic3: updateData3.file,
            pic3_status: fromCMS ? pic3_status : 'pending',
          };

          if (updateData3.file && foundProfile && foundProfile.pic3)
            await UnlinkFile(foundProfile.pic3, 'customer-profile-pic').catch((err) =>
              console.log('Error while deleting "pic3" from profile: ', err)
            );
        }

        if (pic4 && typeof pic4 === 'object') {
          const updateData4 = await UploadAndSetData({
            file: pic4,
            variable: 'file',
            uploadFolder: 'customer-profile-pic',
            appendSlug: foundCustomer.slug || `customer-id-${incomingCustomerId}`,
          });
          upsertObj = {
            ...upsertObj,
            pic4: updateData4.file,
            pic4_status: fromCMS ? pic4_status : 'pending',
          };

          if (updateData4.file && foundProfile && foundProfile.pic4)
            await UnlinkFile(foundProfile.pic4, 'customer-profile-pic').catch((err) =>
              console.log('Error while deleting "pic4" from profile: ', err)
            );
        }
      }

      if (intro_video && typeof intro_video === 'object') {
        const updateVideo = await UploadAndSetData({
          file: intro_video,
          variable: 'file',
          uploadFolder: 'customer-profile-pic',
          isVideo: true,
          appendSlug: foundCustomer.slug || `customer-id-${incomingCustomerId}`,
        });
        upsertObj = {
          ...upsertObj,
          intro_video: updateVideo.file,
          intro_video_status: fromCMS ? intro_video_status : 'pending',
        };

        if (updateVideo.file && foundProfile && foundProfile.intro_video)
          await UnlinkFile(foundProfile.intro_video, 'customer-profile-pic').catch((err) =>
            console.log('Error while deleting "intro_video" from profile: ', err)
          );
      }

      if (deletedFiles && Object.keys(deletedFiles).length) {
        for (const [key, value] of Object.entries(deletedFiles)) {
          if (value) {
            const statusVar = key + '_status';
            const scoreVar = key + '_score';
            upsertObj = {
              ...upsertObj,
              [key]: null,
              [statusVar]: null,
              [scoreVar]: null,
            };
            if (Object.keys(upsertObj).includes('intro_video_score')) delete upsertObj.intro_video_score;

            if (foundProfile && foundProfile[key])
              await UnlinkFile(foundProfile[key], 'customer-profile-pic').catch((err) =>
                console.log(`In "deletedFiles" loop : Error while deleting "${key}" from profile: `, err)
              );
          }
        }
      }

      if (Object.keys(upsertObj).length) {
        console.log('upsertObj', upsertObj);
        if (!foundProfile) {
          await models.Profile.create({
            customer_id: incomingCustomerId,
            ...upsertObj,
            active: true,
            created_by: Number(me.id),
          }).catch((error) => {
            throw new ApolloError(error.message, 'MUTATION_ERROR');
          });
        } else {
          await foundProfile
            .update({
              ...upsertObj,
              updated_by: Number(me.id),
            })
            .catch((error) => {
              throw new ApolloError(error.message, 'MUTATION_ERROR');
            });
        }
      }

      if (profile_pic && foundCustomer)
        foundCustomer.update({ profile_pic }).catch((error) => {
          throw new ApolloError(error.message, 'MUTATION_ERROR');
        });

      return true;
    }),

    updateProfileStatusScore: combineResolvers(isAuthenticated, async (parent, args, { models, me }) => {
      // prettier-ignore
      const { customer_id, pic1_status, pic1_score, pic2_status, pic2_score, pic3_status, pic3_score, pic4_score, pic4_status,
              intro_video_status, reject_reason, final_status } = args;

      if (!customer_id || Number(customer_id) === 0) throw new UserInputError('Invalid customer');

      if (final_status && final_status === 'rejected' && !reject_reason)
        throw new UserInputError('"Reject Reason" must be provided for "Rejected" status');

      const foundProfile = await models.Profile.findOne({
        attributes: ['id'],
        where: { customer_id },
      });

      let upsertObj = {};

      if (pic1_status) upsertObj = { ...upsertObj, pic1_status };
      if (pic1_score) upsertObj = { ...upsertObj, pic1_score: Number(pic1_score) };

      if (pic2_status) upsertObj = { ...upsertObj, pic2_status };
      if (pic2_score) upsertObj = { ...upsertObj, pic2_score: Number(pic2_score) };

      if (pic3_status) upsertObj = { ...upsertObj, pic3_status };
      if (pic3_score) upsertObj = { ...upsertObj, pic3_score: Number(pic3_score) };
      if (pic4_status) upsertObj = { ...upsertObj, pic4_status };
      if (pic4_score) upsertObj = { ...upsertObj, pic4_score: Number(pic4_score) };

      if (intro_video_status) upsertObj = { ...upsertObj, intro_video_status };

      if (reject_reason) upsertObj = { ...upsertObj, reject_reason };
      if (final_status) {
        upsertObj = { ...upsertObj, final_status };
        if (final_status === 'pending' || final_status === 'approved')
          upsertObj = { ...upsertObj, reject_reason: null };
      }

      if (Object.keys(upsertObj).length) {
        await foundProfile
          .update({
            ...upsertObj,
            updated_by: Number(me.id),
          })
          .catch((error) => {
            throw new ApolloError(error.message, 'MUTATION_ERROR');
          });

        if (final_status && (final_status === 'approved' || final_status === 'rejected')) {
          if (final_status === 'approved') {
            const foundEntry = await models.OnlineVote.findOne({
              attributes: ['id'],
              where: { customer_id },
            });
            if (foundEntry)
              await foundEntry.update({ active: true, updated_by: Number(me.id) }).catch((error) => {
                throw new ApolloError(error.message, 'MUTATION_ERROR');
              });
            else {
              const foundCustomer = await models.Customer.findOne({
                attributes: ['gender'],
                where: { id: customer_id },
              });
              await models.OnlineVote.create({
                customer_id: Number(customer_id),
                gender: foundCustomer.gender,
                votes: 0,
                active: true,
                created_by: Number(me.id),
              }).catch((error) => {
                throw new ApolloError(error.message, 'MUTATION_ERROR');
              });
            }
          }

          schedule.scheduleJob(`sendMail-${customer_id}`, new Date(Date.now() + 2000), async () => {
            const custInfo = await models.Customer.findOne({
              attributes: ['full_name', 'email', 'phone'],
              where: { id: Number(customer_id) },
            });

            if (custInfo) {
              let templateData = { name: custInfo.full_name.split(' ')[0] };
              let subject = 'The Leader Board Race | OMG – Face Of The Year 2025';
              let templateName = 'profileApproved';

              if (final_status === 'rejected') {
                templateData = { ...templateData, reject_reason };
                subject = 'Profile Activation Failed | OMG – Face Of The Year 2025';
                templateName = 'profileRejected';
              }

              const sendEmailArgs = {
                templateName,
                templateData,
                toAddress: custInfo.email,
                subject,
              };
              sendEmail(sendEmailArgs).then(
                () => console.log(`Profile update mail successfully sent to: ${custInfo.email}.`),
                (err) => {
                  console.log(`Error while sending profile update mail to: ${custInfo.email}.`);
                  console.dir(err.message);
                }
              );

              const smsText =
                final_status === 'approved'
                  ? 'Dear Candidate,%0aCongratulations!!%0aYour profile is live to share. Please check your mail for further details.%0aRegards,%0aOMG - Face Of The Year 2025'
                  : 'Dear Candidate,%0aWe regret to inform you that your profile activation was unsuccessful. Please check your mail for further details.%0aRegards,%0aOMG - Face Of The Year 2025';

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

    // ===================== TESTING MUTATIONS ========================================

    setShareProfilePic: async (p, a, { models }) => {
      const profiles = await models.Profile.findAll({
        attributes: ['customer_id', 'pic2'],
        where: { pic2: { [Op.not]: null } },
      });

      console.log('  ==== LENGTH ===== ', profiles.length);

      for (let i = 0; i < profiles.length; i++) {
        const obj = profiles[i];

        try {
          let profileImage = await Jimp.read(
            `https://api.omgfaceoftheyear.com/public/images/customer-profile-pic/${obj.pic2}`
          );
          profileImage = profileImage.resize(300, 400);
          const backgroundImage = await Jimp.read(
            'https://api.omgfaceoftheyear.com/public/images/share-pic-background.jpg'
          );
          profileImage = await profileImage;

          await backgroundImage.composite(profileImage, 175, 50, {
            mode: Jimp.BLEND_SOURCE_OVER,
            opacityDest: 1,
            opacitySource: 1,
          });

          const randomNumber = Math.floor(Math.random() * 100000);
          const imgName = new Date().getTime() + randomNumber + '.jpg';
          await backgroundImage.write(`./public/images/customer-profile-pic/${imgName}`);

          if (imgName)
            await models.Profile.update({ share_pic: imgName }, { where: { customer_id: Number(obj.customer_id) } });
        } catch (error) {
          console.log(`Error while saving manipulated image for customer-ID ${obj.customer_id}: `, error);
        }
      }

      return true;
    },
  },
};
