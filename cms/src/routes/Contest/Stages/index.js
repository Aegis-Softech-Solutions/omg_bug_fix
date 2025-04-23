import React, { useState } from "react";
import { connect } from "react-redux";
import { Query, Mutation } from "react-apollo";
import { Card, Row, Col, Switch, Popconfirm, notification } from "antd";
import {
  CONTENT_STAGES,
  ACTIVATE_ONLINE_VOTING,
  STOP_ONLINE_VOTING,
  FINALISE_500,
  STOP_TOP_500_ACTIVITIES,
  START_TOP_150_ACTIVITIES,
  STOP_TOP_150_ACTIVITIES,
  START_TOP_75_ACTIVITIES,
  STOP_TOP_75_ACTIVITIES,
  START_TOP_30_ACTIVITIES,
  STOP_TOP_30_ACTIVITIES,
  START_TOP_20_ACTIVITIES,
  STOP_TOP_20_ACTIVITIES,
  START_TOP_10_ACTIVITIES,
  STOP_TOP_10_ACTIVITIES,
  START_TOP_5_ACTIVITIES,
  STOP_TOP_5_ACTIVITIES
} from "./queries";
import "./stagesFormStyle.less";

const StagesForm = props => {
  const { userPermissions } = props;
  const [onlineVotingConfirmVisible, setOnlineVotingConfirmVisible] = useState(
    false
  );
  const [top500ConfirmVisible, setTop500ConfirmVisible] = useState(false);
  const [top150ConfirmVisible, setTop150ConfirmVisible] = useState(false);
  const [top75ConfirmVisible, setTop75ConfirmVisible] = useState(false);
  const [top30ConfirmVisible, setTop30ConfirmVisible] = useState(false);
  const [top20ConfirmVisible, setTop20ConfirmVisible] = useState(false);
  const [top10ConfirmVisible, setTop10ConfirmVisible] = useState(false);
  const [top5ConfirmVisible, setTop5ConfirmVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const onChangeSwitch = (changeMutation, checked, refetch, stageType) => {
    changeMutation({ variables: { status: checked } })
      .then(res => {
        refetch();
        notification.success({
          message:
            stageType === "onlineVoting"
              ? "Online voting phase successfully started."
              : stageType === "top500"
              ? "Top 500 successfully selected."
              : stageType === "top150"
              ? "Top 150 successfully selected."
              : stageType === "top75"
              ? "Top 75 successfully selected."
              : stageType === "top30"
              ? "Top 30 successfully selected."
              : stageType === "top20"
              ? "Top 20 successfully selected."
              : stageType === "top10"
              ? "Top 10 successfully selected."
              : stageType === "top5"
              ? "Top 5 successfully selected."
              : "-"
        });
      })
      .catch(error => {
        notification.error({
          message: "Error !",
          description: error.message
            ? error.message
            : "Please contact system administrator."
        });
      });
  };

  const showPopconfirm = stageType => {
    if (stageType === "stopOnlineVoting") setOnlineVotingConfirmVisible(true);
    if (stageType === "stopTop500") setTop500ConfirmVisible(true);
    if (stageType === "stopTop150") setTop150ConfirmVisible(true);
    if (stageType === "stopTop75") setTop75ConfirmVisible(true);
    if (stageType === "stopTop30") setTop30ConfirmVisible(true);
    if (stageType === "stopTop20") setTop20ConfirmVisible(true);
    if (stageType === "stopTop10") setTop10ConfirmVisible(true);
    if (stageType === "stopTop5") setTop5ConfirmVisible(true);
  };

  const handlePopConfirmOk = (changeMutation, refetch, stageType) => {
    setConfirmLoading(true);
    changeMutation()
      .then(res => {
        if (stageType === "stopOnlineVoting")
          setOnlineVotingConfirmVisible(false);
        if (stageType === "stopTop500") setTop500ConfirmVisible(false);
        if (stageType === "stopTop150") setTop150ConfirmVisible(false);
        if (stageType === "stopTop75") setTop75ConfirmVisible(false);
        if (stageType === "stopTop30") setTop30ConfirmVisible(false);
        if (stageType === "stopTop20") setTop20ConfirmVisible(false);
        if (stageType === "stopTop10") setTop10ConfirmVisible(false);
        if (stageType === "stopTop5") setTop5ConfirmVisible(false);

        refetch();

        notification.success({
          message:
            stageType === "stopOnlineVoting"
              ? "Online voting phase successfully stopped."
              : stageType === "stopTop500"
              ? "Top 500 activity successfully stopped."
              : stageType === "stopTop150"
              ? "Top 150 activity successfully stopped."
              : stageType === "stopTop75"
              ? "Top 75 activity successfully stopped."
              : stageType === "stopTop30"
              ? "Top 30 activity successfully stopped."
              : stageType === "stopTop20"
              ? "Top 20 activity successfully stopped."
              : stageType === "stopTop10"
              ? "Top 10 activity successfully stopped."
              : stageType === "stopTop5"
              ? "Top 5 activity successfully stopped."
              : "-"
        });
      })
      .catch(error => {
        notification.error({
          message: "Error !",
          description: error.message
            ? error.message
            : "Please contact system administrator."
        });
      });
  };

  const handleCancel = stageType => {
    if (stageType === "stopOnlineVoting") setOnlineVotingConfirmVisible(false);
    if (stageType === "stopTop500") setTop500ConfirmVisible(false);
    if (stageType === "stopTop150") setTop150ConfirmVisible(false);
    if (stageType === "stopTop75") setTop75ConfirmVisible(false);
    if (stageType === "stopTop30") setTop30ConfirmVisible(false);
    if (stageType === "stopTop20") setTop20ConfirmVisible(false);
    if (stageType === "stopTop10") setTop10ConfirmVisible(false);
    if (stageType === "stopTop5") setTop5ConfirmVisible(false);
  };

  // prettier-ignore
  if (userPermissions.includes("readContestStage"))
    return (
      <Mutation mutation={ACTIVATE_ONLINE_VOTING}>
        {activateOnlineVoting => (
          
        <Mutation mutation={STOP_ONLINE_VOTING}>
          {stopOnlineVotingMutation => (

        <Mutation mutation={FINALISE_500}>
          {finalise500 => (

        <Mutation mutation={STOP_TOP_500_ACTIVITIES}>
          {stop500Mutation => (

        <Mutation mutation={START_TOP_150_ACTIVITIES}>
          {start150Activities => (

        <Mutation mutation={STOP_TOP_150_ACTIVITIES}>
          {stop150Activities => (

        <Mutation mutation={START_TOP_75_ACTIVITIES}>
          {start75Activities => (

        <Mutation mutation={STOP_TOP_75_ACTIVITIES}>
          {stop75Mutation => (

        <Mutation mutation={START_TOP_30_ACTIVITIES}>
          {start30Activities => (

        <Mutation mutation={STOP_TOP_30_ACTIVITIES}>
          {stop30Mutation => (

        <Mutation mutation={START_TOP_20_ACTIVITIES}>
          {start20Activities => (

        <Mutation mutation={STOP_TOP_20_ACTIVITIES}>
          {stop20Mutation => (

        <Mutation mutation={START_TOP_10_ACTIVITIES}>
          {start10Activities => (

        <Mutation mutation={STOP_TOP_10_ACTIVITIES}>
          {stop10Mutation => (

        <Mutation mutation={START_TOP_5_ACTIVITIES}>
          {start5Activities => (

        <Mutation mutation={STOP_TOP_5_ACTIVITIES}>
          {stop5Mutation => (
            
        <Query query={CONTENT_STAGES}>
          {({ loading, error, data, refetch }) => {

            if (loading) return "Loading...";
            if (error) return `Error! ${error.message}`;

            const { contestStages } = data;
            const switchPermission = userPermissions.includes("updateContestStage");

            let onlineVoting = false;
            let stopOnlineVoting = false;
            let top500 = false;
            let stopTop500 = false;
            let top150 = false;
            let stopTop150 = false;
            let top75 = false;
            let stopTop75 = false;
            let top30 = false;
            let stopTop30 = false;
            let top20 = false;
            let stopTop20 = false;
            let top10 = false;
            let stopTop10 = false;
            let top5 = false;
            let stopTop5 = false;

            contestStages.forEach(({ stage, active }) => {
              if (stage === "online_voting") onlineVoting = active;
              if (stage === "stop_online_voting") stopOnlineVoting = active;
              if (stage === "top500") top500 = active;
              if (stage === "stop_top500") stopTop500 = active;
              if (stage === "top150") top150 = active;
              if (stage === "stop_top150") stopTop150 = active;
              if (stage === "top75") top75 = active;
              if (stage === "stop_top75") stopTop75 = active;
              if (stage === "top30") top30 = active;
              if (stage === "stop_top30") stopTop30 = active;
              if (stage === "top20") top20 = active;
              if (stage === "stop_top20") stopTop20 = active;
              if (stage === "top10") top10 = active;
              if (stage === "stop_top10") stopTop10 = active;
              if (stage === "top5") top5 = active;
              if (stage === "stop_top5") stopTop5 = active;
            });

            return (
              <Card className="gx-card" title="Contest Stages">
                <Row>
                  <Col span={12} className="padding-bottom-10px gx-mt-3 rightAlign">
                    <div className="biggerBolderText">
                      {onlineVoting && !stopOnlineVoting ? "Currently Active: " : null} Online Voting
                    </div>

                    {!onlineVoting && !stopOnlineVoting ? (
                      <div className="smallerText">
                        Activating this would lock the approved profiles as final for online voting.
                        An e-mail would be sent to selected contestants, indicating the start of online voting phase.
                      </div>
                    ) : onlineVoting && !stopOnlineVoting ? (
                      <div className="smallerText">
                        <strong>CAUTION:</strong> Deactivate the switch to stop online voting.
                        <br />
                        <strong>Use this ONLY when ready to move to next stage, and never before.</strong>
                      </div>
                    ) : null}
                  </Col>

                  <Col span={4} className="padding-bottom-10px gx-mt-3">
                    {onlineVoting ? (
                      <Popconfirm
                        title="Are you sure to stop online voting?"
                        visible={onlineVotingConfirmVisible}
                        onConfirm={()=> handlePopConfirmOk(stopOnlineVotingMutation, refetch, "stopOnlineVoting")}
                        okButtonProps={{ loading: confirmLoading }}
                        onCancel={()=> handleCancel("stopOnlineVoting")}
                      >
                        <Switch
                          checked={stopOnlineVoting ? false : onlineVoting}
                          disabled={!switchPermission || stopOnlineVoting || top150 || top30 || top20 || top10 || top5}
                          onChange={()=> showPopconfirm("stopOnlineVoting")}
                        />
                      </Popconfirm>
                    ) : (
                      <Switch
                        checked={onlineVoting}
                        disabled={!switchPermission || stopOnlineVoting || top150 || top30 || top20 || top10 || top5}
                        onChange={checked => onChangeSwitch(activateOnlineVoting, checked, refetch, "onlineVoting")}
                      />
                    )}
                  </Col>
                </Row>

                <Row>
                  <Col span={12} className="padding-bottom-10px gx-mt-3 rightAlign">
                    <div className="biggerBolderText">
                      {top500 && !stopTop500 ? "Currently Active: Activities for " : 'Finalise '} Top 1000
                    </div>

                    <div className="smallerText">
                      {!top500 && !stopTop500 ? (
                        <>Activating this would finalise the top 500 males and females each, to be further evaulated for scoring.</>
                      ) : top500 && !stopTop500 ? (
                        <>
                          <strong>CAUTION:</strong> Deactivate the switch to stop the activities of top 1000 candidates.
                          <br />
                          <strong>Use this ONLY when ready to move to next stage, and never before.</strong>
                        </>
                      ) : null}
                    </div>
                  </Col>

                  <Col span={4} className="padding-bottom-10px gx-mt-3">
                    {top500 ? (
                      <Popconfirm
                        title="Are you sure to stop Top-500 activities?"
                        visible={top500ConfirmVisible}
                        onConfirm={() => handlePopConfirmOk(stop500Mutation, refetch, "stopTop500")}
                        okButtonProps={{ loading: confirmLoading }}
                        onCancel={() => handleCancel("stopTop500")}
                      >
                        <Switch
                          checked={stopTop500 ? false : top500}
                          disabled={!switchPermission || !stopOnlineVoting || stopTop500 || top150 || top75 || top30 || top20 || top10 || top5}
                          onChange={() => showPopconfirm("stopTop500")}
                        />
                      </Popconfirm>
                    ) : (
                      <Switch
                        checked={top500}
                        disabled={!switchPermission || !stopOnlineVoting || stopTop500 || top150 || top75 || top30 || top20 || top10 || top5}
                        onChange={checked => onChangeSwitch(finalise500, checked, refetch, "top500")}
                      />
                    )}
                  </Col>
                </Row>

                <Row>
                  <Col span={12} className="padding-bottom-10px gx-mt-3 rightAlign">
                    <div className="biggerBolderText">
                      {top150 && !stopTop150 ? "Currently Active: Activities for " : 'Finalise '} Top 300
                    </div>

                    <div className="smallerText">
                      {!top150 && !stopTop150 ? (
                        <>Activating this would finalise the top 150 males and females each, to be further evaulated for scoring.</>
                      ) : top150 && !stopTop150 ? (
                        <>
                          <strong>CAUTION:</strong> Deactivate the switch to stop the activities of top 300 candidates.
                          <br />
                          <strong>Use this ONLY when ready to move to next stage, and never before.</strong>
                        </>
                      ) : null}
                    </div>
                  </Col>

                  <Col span={4} className="padding-bottom-10px gx-mt-3">
                    {top150 ? (
                      <Popconfirm
                        title="Are you sure to stop Top-150 activities?"
                        visible={top150ConfirmVisible}
                        onConfirm={() => handlePopConfirmOk(stop150Activities, refetch, "stopTop150")}
                        okButtonProps={{ loading: confirmLoading }}
                        onCancel={() => handleCancel("stopTop150")}
                      >
                        <Switch
                          checked={stopTop150 ? false : top150}
                          disabled={!switchPermission || !stopTop500 || stopTop150 || top75 || top30 || top20 || top10 || top5}
                          onChange={() => showPopconfirm("stopTop150")}
                        />
                      </Popconfirm>
                    ) : (
                      <Switch
                        checked={top150}
                        disabled={!switchPermission || !stopTop500 || stopTop150 || top75 || top30 || top20 || top10 || top5}
                        onChange={checked => onChangeSwitch(start150Activities, checked, refetch, "top150")}
                      />
                    )}
                  </Col>
                </Row>

                <Row>
                  <Col span={12} className="padding-bottom-10px gx-mt-3 rightAlign">
                    <div className="biggerBolderText">
                      {top75 && !stopTop75 ? "Currently Active: Activities for " : 'Finalise '} Top 150
                    </div>

                    <div className="smallerText">
                      {!top75 && !stopTop75 ? (
                        <>Activating this would finalise the top 75 males and females each, to be further evaulated for scoring.</>
                      ) : top75 && !stopTop75 ? (
                        <>
                          <strong>CAUTION:</strong> Deactivate the switch to stop the activities of top 150 candidates.
                          <br />
                          <strong>Use this ONLY when ready to move to next stage, and never before.</strong>
                        </>
                      ) : null}
                    </div>
                  </Col>

                  <Col span={4} className="padding-bottom-10px gx-mt-3">
                    {top75 ? (
                      <Popconfirm
                        title="Are you sure to stop Top-75 activities?"
                        visible={top75ConfirmVisible}
                        onConfirm={() => handlePopConfirmOk(stop75Mutation, refetch, "stopTop75")}
                        okButtonProps={{ loading: confirmLoading }}
                        onCancel={() => handleCancel("stopTop75")}
                      >
                        <Switch
                          checked={stopTop75 ? false : top75}
                          disabled={!switchPermission || !stopTop150 || stopTop75 || top30 || top20 || top10 || top5}
                          onChange={() => showPopconfirm("stopTop75")}
                        />
                      </Popconfirm>
                    ) : (
                      <Switch
                        checked={top75}
                        disabled={!switchPermission || !stopTop150 || stopTop75 || top30 || top20 || top10 || top5}
                        onChange={checked => onChangeSwitch(start75Activities, checked, refetch, "top75")}
                      />
                    )}
                  </Col>
                </Row>

                <Row>
                  <Col span={12} className="padding-bottom-10px gx-mt-3 rightAlign">
                    <div className="biggerBolderText">
                      {top30 && !stopTop30 ? "Currently Active: Activities for " : 'Finalise '} Top 60
                    </div>

                    <div className="smallerText">
                      {!top30 && !stopTop30 ? (
                        <>Activating this would finalise the top 30 males and females each, to be further evaulated for scoring.</>
                      ) : top30 && !stopTop30 ? (
                        <>
                          <strong>CAUTION:</strong> Deactivate the switch to stop the activities of top 60 candidates.
                          <br />
                          <strong>Use this ONLY when ready to move to next stage, and never before.</strong>
                        </>
                      ) : null}
                    </div>
                  </Col>

                  <Col span={4} className="padding-bottom-10px gx-mt-3">
                    {top30 ? (
                      <Popconfirm
                        title="Are you sure to stop Top-30 activities?"
                        visible={top30ConfirmVisible}
                        onConfirm={() => handlePopConfirmOk(stop30Mutation, refetch, "stopTop30")}
                        okButtonProps={{ loading: confirmLoading }}
                        onCancel={() => handleCancel("stopTop30")}
                      >
                        <Switch
                          checked={stopTop30 ? false : top30}
                          disabled={!switchPermission || !stopTop75 || stopTop30 || top20 || top10 || top5}
                          onChange={() => showPopconfirm("stopTop30")}
                        />
                      </Popconfirm>
                    ) : (
                      <Switch
                        checked={top30}
                        disabled={!switchPermission || !stopTop75 || stopTop30 || top20 || top10 || top5}
                        onChange={checked => onChangeSwitch(start30Activities, checked, refetch, "top30")}
                      />
                    )}
                  </Col>
                </Row>
                
                <Row>
                  <Col span={12} className="padding-bottom-10px gx-mt-3 rightAlign">
                    <div className="biggerBolderText">
                      {top20 && !stopTop20 ? "Currently Active: Activities for " : 'Finalise '} Top 40
                    </div>

                    <div className="smallerText">
                      {!top20 && !stopTop20 ? (
                        <>Activating this would finalise the top 20 males and females each, to be further evaulated for scoring.</>
                      ) : top20 && !stopTop20 ? (
                        <>
                          <strong>CAUTION:</strong> Deactivate the switch to stop the activities of top 40 candidates.
                          <br />
                          <strong>Use this ONLY when ready to move to next stage, and never before.</strong>
                        </>
                      ) : null}
                    </div>
                  </Col>

                  <Col span={4} className="padding-bottom-10px gx-mt-3">
                    {top20 ? (
                      <Popconfirm
                        title="Are you sure to stop Top-40 activities?"
                        visible={top20ConfirmVisible}
                        onConfirm={() => handlePopConfirmOk(stop20Mutation, refetch, "stopTop20")}
                        okButtonProps={{ loading: confirmLoading }}
                        onCancel={() => handleCancel("stopTop20")}
                      >
                        <Switch
                          checked={stopTop20 ? false : top20}
                          disabled={!switchPermission || !stopTop30 || stopTop20 || top10 || top5}
                          onChange={() => showPopconfirm("stopTop20")}
                        />
                      </Popconfirm>
                    ) : (
                      <Switch
                        checked={top20}
                        disabled={!switchPermission || !stopTop30 || stopTop20 || top10 || top5}
                        onChange={checked => onChangeSwitch(start20Activities, checked, refetch, "top20")}
                      />
                    )}
                  </Col>
                </Row>
                
                <Row>
                  <Col span={12} className="padding-bottom-10px gx-mt-3 rightAlign">
                    <div className="biggerBolderText">
                      {top10 && !stopTop10 ? "Currently Active: Activities for " : 'Finalise '} Top 20
                    </div>

                    <div className="smallerText">
                      {!top10 && !stopTop10 ? (
                        <>Activating this would finalise the top 10 males and females each, to be further evaulated for scoring.</>
                      ) : top10 && !stopTop10 ? (
                        <>
                          <strong>CAUTION:</strong> Deactivate the switch to stop the activities of top 20 candidates.
                          <br />
                          <strong>Use this ONLY when ready to move to next stage, and never before.</strong>
                        </>
                      ) : null}
                    </div>
                  </Col>

                  <Col span={4} className="padding-bottom-10px gx-mt-3">
                    {top10 ? (
                      <Popconfirm
                        title="Are you sure to stop Top-10 activities?"
                        visible={top10ConfirmVisible}
                        onConfirm={() => handlePopConfirmOk(stop10Mutation, refetch, "stopTop10")}
                        okButtonProps={{ loading: confirmLoading }}
                        onCancel={() => handleCancel("stopTop10")}
                      >
                        <Switch
                          checked={stopTop10 ? false : top10}
                          disabled={!switchPermission || !stopTop20 || stopTop10 || top5}
                          onChange={() => showPopconfirm("stopTop10")}
                        />
                      </Popconfirm>
                    ) : (
                      <Switch
                        checked={top10}
                        disabled={!switchPermission || !stopTop20 || stopTop10 || top5}
                        onChange={checked => onChangeSwitch(start10Activities, checked, refetch, "top10")}
                      />
                    )}
                  </Col>
                </Row>

                <Row>
                  <Col span={12} className="padding-bottom-10px gx-mt-3 rightAlign">
                    <div className="biggerBolderText">
                      {top5 && !stopTop5 ? "Currently Active: Activities for " : 'Finalise '} Top 10
                    </div>

                    <div className="smallerText">
                      {!top5 && !stopTop5 ? (
                        <>Activating this would finalise the top 5 males and females each, to be further evaulated for scoring.</>
                      ) : top5 && !stopTop5 ? (
                        <>
                          <strong>CAUTION:</strong> Deactivate the switch to stop the activities of top 10 candidates.
                          <br />
                          <strong>Use this ONLY when ready to move to next stage, and never before.</strong>
                        </>
                      ) : null}
                    </div>
                  </Col>

                  <Col span={4} className="padding-bottom-10px gx-mt-3">
                    {top5 ? (
                      <Popconfirm
                        title="Are you sure to stop Top-10 activities?"
                        visible={top5ConfirmVisible}
                        onConfirm={() => handlePopConfirmOk(stop5Mutation, refetch, "stopTop5")}
                        okButtonProps={{ loading: confirmLoading }}
                        onCancel={() => handleCancel("stopTop5")}
                      >
                        <Switch
                          checked={stopTop5 ? false : top5}
                          disabled={!switchPermission || !stopTop10 || stopTop5}
                          onChange={() => showPopconfirm("stopTop5")}
                        />
                      </Popconfirm>
                    ) : (
                      <Switch
                        checked={top5}
                        disabled={!switchPermission || !stopTop10 || stopTop5}
                        onChange={checked => onChangeSwitch(start5Activities, checked, refetch, "top5")}
                      />
                    )}
                  </Col>
                </Row>
              </Card>
            );
          }}
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

        )}
      </Mutation>

        )}
      </Mutation>

        )}
      </Mutation>
    );
  else {
    props.history.push("/error-404");
    return null;
  }
};

//get the mapStateToProps
const mapStateToProps = ({ auth }) => {
  let userPermissions = window.atob(auth.userPermissions);
  return { userPermissions };
};

export default connect(mapStateToProps)(StagesForm);
