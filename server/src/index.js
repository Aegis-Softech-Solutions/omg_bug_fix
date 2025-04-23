import "dotenv/config";
import http from "http";
import cors from "cors";
import express from "express";
import jwt from "jsonwebtoken";
import DataLoader from "dataloader";
import {
  UserInputError,
  ApolloError,
  AuthenticationError,
} from "apollo-server";
import { ApolloServer } from "apollo-server-express";
import bodyParser from "body-parser";
import schedule from "node-schedule";
import axios from "axios";
import schema from "./schema";
import resolvers from "./resolvers";
import models, { sequelize } from "./models";
import loaders from "./loaders";
// import sendEmail from './services/sendEmail';
import { sendEmail, sendTemplateEmail } from "./services/awsSES";

const app = express();

app.use(cors());

const getMe = async (req) => {
  const token = req.headers["x-token"];
  if (token) {
    try {
      return await jwt.verify(token, process.env.SECRET);
    } catch (e) {
      console.log(e);
      // throw new AuthenticationError("Your session expired. Sign in again.");
    }
  }
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  formatError: (error) => {
    const message = error.message
      .replace("SequelizeValidationError: ", "")
      .replace("Validation error: ", "");
    return { ...error, message };
  },
  context: async ({ req, connection }) => {
    if (connection) {
      return {
        models,
        loaders: {
          user: new DataLoader((keys) => loaders.user.batchUsers(keys, models)),
        },
      };
    }
    if (req) {
      const me = await getMe(req);
      return {
        models,
        me,
        ip_address: req.connection.remoteAddress,
        secret: process.env.SECRET,
        loaders: {
          user: new DataLoader((keys) => loaders.user.batchUsers(keys, models)),
        },
      };
    }
  },
});

app.use("/public", express.static("public"));

server.applyMiddleware({ app, path: "/graphql" });
const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

const isTest = !!process.env.TEST_DATABASE;
const isProduction = !!process.env.DATABASE_URL;
const port = process.env.PORT || 8080;

// Initial data entry constants declaration - BEGINS

const createUsersSeed = async (date) => {
  await models.User.create({
    first_name: "Admin",
    email: "admin@admin.com",
    password: "qwerty1234",
    role_id: 1,
    active: 1,
    created_by: 0,
    updated_by: 0,
  }).catch((error) => {
    console.log("ERROR WHILE ADMIN SEED : ", error.message);
  });

  //Now create Roles only
  await models.Role.create({
    title: "Super Admin",
    // prettier-ignore
    permissions: JSON.stringify([
      "createRole","readRole","updateRole","deleteRole",
      "createUser","readUser","updateUser","deleteUser",
      "createSampleRecord","readSampleRecord","updateSampleRecord","deleteSampleRecord",
      "createCustomer","readCustomer","updateCustomer","deleteCustomer",
      "readProfile","createProfile","updateProfile","deleteProfile",
      "createContactUs","readContactUs","updateContactUs","deleteContactUs",
      "createTransaction","readTransaction","updateTransaction","deleteTransaction",
      "createNews","readNews","updateNews","deleteNews",
      "readBanner","createBanner","updateBanner","deleteBanner",
      "readCoupon","createCoupon","updateCoupon","deleteCoupon",
      "readContestStage","createContestStage","updateContestStage","deleteContestStage",
      "readVote","createVote","updateVote","deleteVote",
      "readTop500","createTop500","updateTop500","deleteTop500",
      "readTop150","createTop150","updateTop150","deleteTop150",
      "readVideoTop30","createVideoTop30","updateVideoTop30","deleteVideoTop30",
      "readFitTop30","createFitTop30","updateFitTop30","deleteFitTop30",
      "readWebinar","createWebinar","updateWebinar","deleteWebinar",
      "readCompetition","createCompetition","updateCompetition","deleteCompetition",
      "readSubmission","createSubmission","updateSubmission","deleteSubmission"
    ]),
    active: 1,
    created_by: 0,
    updated_by: 0,
  }).catch((error) => {
    console.log("ERROR WHILE ROLE SEED : ", error.message);
  });

  // prettier-ignore
  const stages = ['online_voting', 'stop_online_voting', 'top500', 'stop_top500', 'top150', 'stop_top150',
                  'top30', 'stop_top30', 'top20', 'stop_top20', 'top10', 'stop_top10', 'top5', 'stop_top5',
                  'winner'];
  for await (const stage of stages) {
    await models.ContestStage.create({
      stage,
      active: false,
      created_by: 0,
    }).catch((error) => {
      console.log(`ERROR WHILE STAGE SEED FOR "${stage}" : `, error.message);
    });
  }
};

// Initial data entry constants declaration - ENDS

sequelize.sync({ force: isTest || isProduction }).then(async () => {
  if (isTest || isProduction) {
  }

  createUsersSeed(new Date());

  app.use(
    "/webhooks",
    bodyParser.raw({ type: "application/json" }),
    async (req, res) => {
      let reqBody;

      try {
        reqBody = JSON.parse(req.body);
      } catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
      }
      res.status(200).end(); // Responding is important

      // console.log('EVENT --> ', reqBody.event);

      switch (reqBody.event) {
        case "order.paid":
          schedule.scheduleJob(
            "delayedOrderWebhook",
            new Date(Date.now() + 30000),
            async () => {
              const orderPayEntity = reqBody.payload.payment.entity;
              const orderDetails = reqBody.payload.order.entity;

              if (orderDetails) {
                const foundRequest = await models.PaymentRequest.findOne({
                  attributes: ["id", "customer_id", "status"],
                  where: {
                    order_id: orderDetails.id,
                    status: "initiated",
                  },
                });

                if (foundRequest) {
                  const doesTransactionExist = await models.Transaction.findOne(
                    {
                      where: { payment_id: orderPayEntity.id },
                    }
                  );

                  if (!doesTransactionExist) {
                    const customer = await models.Customer.findOne({
                      where: { id: foundRequest.customer_id },
                      attributes: ["id", "full_name", "email", "phone"],
                    });

                    if (customer) {
                      if (orderPayEntity.id) {
                        const transaction = await models.Transaction.create({
                          customer_id: Number(customer.id),
                          payment_id: orderPayEntity.id,
                          order_id: orderDetails.id,
                          amount: Number(orderPayEntity.amount) / 100,
                          source: "webhook",
                          active: true,
                          created_by: Number(customer.id),
                        }).catch((error) => {
                          throw new ApolloError(
                            error.message,
                            "MUTATION_ERROR"
                          );
                        });

                        await models.Customer.update(
                          {
                            transaction_id: transaction.id,
                            updated_by: Number(customer.id),
                          },
                          { where: { id: Number(customer.id) } }
                        ).catch((error) => {
                          throw new ApolloError(
                            error.message,
                            "MUTATION_ERROR"
                          );
                        });

                        await foundRequest.update({
                          status: "completed-webhook",
                        });

                        const sendEmailArgs = {
                          templateName: "paymentReceived",
                          templateData: {
                            name: customer.full_name.split(" ")[0],
                          },
                          toAddress: customer.email,
                          subject:
                            "Registration Details | OMG – Face Of The Year 2025",
                        };
                        sendEmail(sendEmailArgs).then(
                          () =>
                            console.log(
                              `Payment received mail successfully sent to: ${customer.email}.`
                            ),
                          (err) => {
                            console.log(
                              `Error while sending payment recieved mail to: ${customer.email}.`
                            );
                            console.dir(err.message);
                          }
                        );

                        const smsText =
                          "Dear Candidate,%0aThank you for registering with OMG. Your registration was successful and payment has been received.%0aRegards,%0aOMG - Face Of The Year 2025";
                        await axios
                          .post(
                            `https://api.msg91.com/api/sendhttp.php?authkey=${process.env.MSG91_AUTHKEY}&country=91&mobiles=${customer.phone}&message=${smsText}&sender=OMGFOY&route=4`
                          )
                          .then((res) =>
                            console.log(
                              `RESPONSE RECEIVED FOR TRANSACTIONAL SMS TO ${customer.phone} : `,
                              res.data
                            )
                          )
                          .catch((err) =>
                            console.log(
                              `ERROR FOR TRANSACTIONAL SMS TO ${customer.phone} : `,
                              err
                            )
                          );
                      }
                    }
                  }
                }
              }
            }
          );
          break;

        default:
          break;
      }
    }
  );

  httpServer.listen({ port }, () => {
    console.log(`Apollo Server on http://localhost:${port}/graphql`);
  });
});
