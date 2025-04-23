import React from "react";
import { Col, Row } from "antd";
import { connect } from "react-redux";
import { Query, Mutation } from "react-apollo";
import { Tabs } from "antd";
import Auxiliary from "util/Auxiliary";
// prettier-ignore
import { CUSTOMER, PROFILE, CUST_VOTE, CHANGE_PROFILE_STATUS_SCORE, UPSERT_VOTES, TOP_500_SCORE_CUST,
         ADD_TOP_500_SCORE, TOP_150_CUST_DATA, ADD_TOP_150_SCORE, UPSERT_TOP_150_VIDEO,
         TOP_75_CUST_DATA, ADD_TOP_75_SCORE, UPSERT_TOP_75_VIDEO,
         TOP_30_CUST_DATA, ADD_TOP_30_SCORE, UPSERT_TOP_30_VIDEO,
         TOP_20_CUST_DATA, ADD_TOP_20_SCORE, UPSERT_TOP_20_VIDEO,
         TOP_10_CUST_DATA, ADD_TOP_10_SCORE, UPSERT_TOP_10_VIDEO
       } from "./queries";
import CustomerTable from "./DisplayTable";
import CustomerViewForm from "./ViewForm";
import CustomerBasicDetailsForm from "./BasicDetailsForm";
import CustomerProfileForm from "./ProfileForm";
import ErrorPage from "../../404";

const TabPane = Tabs.TabPane;

const Customers = props => {
  const { userPermissions } = props;
  const { useraction, id } = props.match.params;

  switch (useraction) {
    case "create":
      if (userPermissions.includes("createCustomer")) {
        return (
          <Auxiliary>
            <CustomerBasicDetailsForm
              customer_id={id}
              page_history={props.history}
              crud="create"
            />
          </Auxiliary>
        );
      } else return <ErrorPage />;

    // prettier-ignore
    case "read":
      if (id && (userPermissions.includes("readCustomer") || userPermissions.includes("readProfile"))) {
        return (
          <Auxiliary>

            <Mutation mutation={UPSERT_VOTES}>
              {upsertVotes => (

            <Mutation mutation={CHANGE_PROFILE_STATUS_SCORE}>
              {changeStatusScore => (

            <Mutation mutation={ADD_TOP_500_SCORE}>
              {addTop500Score => (

            <Mutation mutation={UPSERT_TOP_150_VIDEO}>
              {upsertTop150Video => (

            <Mutation mutation={ADD_TOP_150_SCORE}>
              {addTop150VideoScore => (

            <Mutation mutation={UPSERT_TOP_75_VIDEO}>
              {upsertTop75Video => (

            <Mutation mutation={ADD_TOP_75_SCORE}>
              {addTop75VideoScore => (

            <Mutation mutation={UPSERT_TOP_30_VIDEO}>
              {upsertTop30Video => (

            <Mutation mutation={ADD_TOP_30_SCORE}>
              {addTop30VideoScore => (

            <Mutation mutation={UPSERT_TOP_20_VIDEO}>
              {upsertTop20Video => (

            <Mutation mutation={ADD_TOP_20_SCORE}>
              {addTop20VideoScore => (

            <Mutation mutation={UPSERT_TOP_10_VIDEO}>
              {upsertTop10Video => (

            <Mutation mutation={ADD_TOP_10_SCORE}>
              {addTop10VideoScore => (

            <Query
              query={CUST_VOTE}
              variables={{ customer_id: id }}
            >
              {({ loading: vLoad, error: vErr, data: votesData }) => (

            <Query
              query={TOP_500_SCORE_CUST}
              variables={{ customer_id: id }}
            >
              {({ loading: sLoad, error: sErr, data: scoreData }) => (

            <Query
              query={TOP_150_CUST_DATA}
              variables={{ customer_id: id }}
            >
              {({ loading: t150L, error: t150E, data: t150Data, refetch: t150Refetch }) => (

            <Query
              query={TOP_75_CUST_DATA}
              variables={{ customer_id: id }}
            >
              {({ loading: t75L, error: t75E, data: t75Data, refetch: t75Refetch }) => (
            
            <Query
              query={TOP_30_CUST_DATA}
              variables={{ customer_id: id }}
            >
              {({ loading: t30L, error: t30E, data: t30Data, refetch: t30Refetch }) => (

            <Query
              query={TOP_20_CUST_DATA}
              variables={{ customer_id: id }}
            >
              {({ loading: t20L, error: t20E, data: t20Data, refetch: t20Refetch }) => (

            <Query
              query={TOP_10_CUST_DATA}
              variables={{ customer_id: id }}
            >
              {({ loading: t10L, error: t10E, data: t10Data, refetch: t10Refetch }) => (

            <Query
              query={CUSTOMER}
              variables={{ customer_id: id }}
            >
              {({ loading: cLoad, error: cErr, data: custData }) => (

            <Query
              query={PROFILE}
              variables={{ customer_id: id }}
            >
              {({ loading: pLoad, error: pErr, data: profileData }) => {

                if (cLoad || pLoad || sLoad || vLoad || t150L || t75L || t30L || t20L || t10L)
                  return "Loading...";

                if (cErr) return `Error! ${cErr.message}`;
                if (pErr) return `Error! ${pErr.message}`;
                if (sErr) return `Error! ${sErr.message}`;
                if (vErr) return `Error! ${vErr.message}`;
                if (t150E) return `Error! ${t150E.message}`;
                if (t75E) return `Error! ${t75E.message}`;
                if (t30E) return `Error! ${t30E.message}`;
                if (t20E) return `Error! ${t20E.message}`;
                if (t10E) return `Error! ${t10E.message}`;

                return (
                  <CustomerViewForm
                    crud="read"
                    page_history={props.history}
                    customer_id={id}
                    customer={custData.customerDetailsById}
                    profile={profileData.profileByCustomerId}
                    votesByCustomerId={votesData.votesByCustomerId}
                    upsertVotes={upsertVotes}
                    changeStatusScore={changeStatusScore}
                    top500ScoreByCustomerId={scoreData.top500ScoreByCustomerId}
                    addTop500Score={addTop500Score}
                    upsertTop150Video={upsertTop150Video}
                    top150DataByCustomerId={t150Data.top150DataByCustomerId}
                    top150Refetch={t150Refetch}
                    addTop150VideoScore={addTop150VideoScore}                    
                    upsertTop75Video={upsertTop75Video}
                    top75DataByCustomerId={t75Data.top75DataByCustomerId}
                    top75Refetch={t75Refetch}
                    addTop75VideoScore={addTop75VideoScore}
                    upsertTop30Video={upsertTop30Video}
                    top30DataByCustomerId={t30Data.top30DataByCustomerId}
                    top30Refetch={t30Refetch}
                    addTop30VideoScore={addTop30VideoScore}
                    upsertTop20Video={upsertTop20Video}
                    top20DataByCustomerId={t20Data.top20DataByCustomerId}
                    top20Refetch={t20Refetch}
                    addTop20VideoScore={addTop20VideoScore}
                    upsertTop10Video={upsertTop10Video}
                    top10DataByCustomerId={t10Data.top10DataByCustomerId}
                    top10Refetch={t10Refetch}
                    addTop10VideoScore={addTop10VideoScore}
                  />
                );
              }}
            </Query>
              )}
            </Query>
              )}
            </Query>
              )}
            </Query>
              )}
            </Query>
              )}
            </Query>
              )}
            </Query>
              )}
            </Query>
              )}
            </Query>
              )}
            </Mutation>
              )}
            </Mutation>
              )}
            </Mutation>
              )}
            </Mutation>
              )}
            </Mutation>
              )}
            </Mutation>
              )}
            </Mutation>
              )}
            </Mutation>
              )}
            </Mutation>
              )}
            </Mutation>
              )}
            </Mutation>
              )}
            </Mutation>
              )}
            </Mutation>
          </Auxiliary>
        );
      } else return <ErrorPage />;

    case "update":
      if (id && userPermissions.includes("updateCustomer")) {
        return (
          <Auxiliary>
            <CustomerBasicDetailsForm
              customer_id={id}
              page_history={props.history}
              crud="update"
            />
          </Auxiliary>
        );
      } else return <ErrorPage />;

    case "edit-profile":
      if (id && userPermissions.includes("updateCustomer")) {
        return (
          <Auxiliary>
            <CustomerProfileForm
              customer_id={id}
              page_history={props.history}
              crud="update"
            />
          </Auxiliary>
        );
      } else return <ErrorPage />;

    default:
      if (
        userPermissions.includes("readCustomer") ||
        userPermissions.includes("readProfile")
      ) {
        return (
          <Tabs defaultActiveKey="1">
            <TabPane tab="Pending" key="1">
              <Row>
                <Col span={24}>
                  <CustomerTable customerStatus="pending" />
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="Approved" key="2">
              <Row>
                <Col span={24}>
                  <CustomerTable customerStatus="approved" />
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="Rejected" key="3">
              <Row>
                <Col span={24}>
                  <CustomerTable customerStatus="rejected" />
                </Col>
              </Row>
            </TabPane>
            {/* {!userPermissions.includes("isIntern") ? ( */}
            <TabPane tab="Partially Filled Profiles" key="4">
              <Row>
                <Col span={24}>
                  <CustomerTable customerStatus="partialProfiles" />
                </Col>
              </Row>
            </TabPane>
            {/* ) : null} */}
            {!userPermissions.includes("isIntern") ? (
              <TabPane tab="Unpaid Contestants" key="5">
                <Row>
                  <Col span={24}>
                    <CustomerTable customerStatus="unpaidCustomers" />
                  </Col>
                </Row>
              </TabPane>
            ) : null}
          </Tabs>
        );
      } else return <ErrorPage />;
  }
};

//get the mapStateToProps
const mapStateToProps = ({ auth }) => {
  let userPermissions = window.atob(auth.userPermissions);
  return { userPermissions };
};

export default connect(mapStateToProps)(Customers);
