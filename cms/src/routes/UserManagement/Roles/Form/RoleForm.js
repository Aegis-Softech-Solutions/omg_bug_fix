import React from "react";
import { Button, Table, Input, Card, Form, Checkbox, notification } from "antd";
import { Link } from "react-router-dom";
import { Mutation } from "react-apollo";
import { validateForm } from "../../../../pixelsComponents/validateForm";

const FormItem = Form.Item;

class RoleForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...this.props.initialState,
      errors: {},
      isIntern: false,
      tabledata: [
        {
          key: Math.random(),
          id: "roles",
          permission: "Roles",
          view: "readRole",
          create: "createRole",
          edit: "updateRole",
          delete: "deleteRole"
        },
        {
          key: Math.random(),
          id: "admins",
          permission: "Admins",
          view: "readUser",
          create: "createUser",
          edit: "updateUser",
          delete: "deleteUser"
        },
        {
          key: Math.random(),
          id: "customers",
          permission: "Customers",
          view: "readCustomer",
          create: "createCustomer",
          edit: "updateCustomer",
          delete: "deleteCustomer"
        },
        {
          key: Math.random(),
          id: "customerProfiles",
          permission: "Approve / Reject Profile",
          view: "readProfile",
          create: "createProfile",
          edit: "updateProfile",
          delete: "deleteProfile"
        },
        {
          key: Math.random(),
          id: "transactions",
          permission: "Transactions",
          view: "readTransaction",
          create: "createTransaction",
          edit: "updateTransaction",
          delete: "deleteTransaction"
        },
        // {
        //   key: Math.random(),
        //   id: "contestStages",
        //   permission: "Contest Stages",
        //   view: "readContestStage",
        //   create: "createContestStage",
        //   edit: "updateContestStage",
        //   delete: "deleteContestStage"
        // },
        {
          key: Math.random(),
          id: "voteProfiles",
          permission: "Approved Profiles for Voting",
          view: "readVote",
          create: "createVote",
          edit: "updateVote",
          delete: "deleteVote"
        },
        {
          key: Math.random(),
          id: "top500",
          permission: "Top 1000 Profiles & Scoring",
          view: "readTop500",
          create: "createTop500",
          edit: "updateTop500",
          delete: "deleteTop500"
        },
        {
          key: Math.random(),
          id: "top150",
          permission: "Top 300 Profiles & Scoring",
          view: "readTop150",
          create: "createTop150",
          edit: "updateTop150",
          delete: "deleteTop150"
        },
        {
          key: Math.random(),
          id: "top75",
          permission: "Top 150 Profiles & Scoring",
          view: "readTop75",
          create: "createTop75",
          edit: "updateTop75",
          delete: "deleteTop75"
        },
        {
          key: Math.random(),
          id: "top30",
          permission: "Top 60 Profiles & Scoring",
          view: "readTop30",
          create: "createTop30",
          edit: "updateTop30",
          delete: "deleteTop30"
        },
        {
          key: Math.random(),
          id: "top20",
          permission: "Top 40 Profiles & Scoring",
          view: "readTop20",
          create: "createTop20",
          edit: "updateTop20",
          delete: "deleteTop20"
        },
        {
          key: Math.random(),
          id: "top10",
          permission: "Top 20 Profiles & Scoring",
          view: "readTop10",
          create: "createTop10",
          edit: "updateTop10",
          delete: "deleteTop10"
        },
        {
          key: Math.random(),
          id: "top5",
          permission: "Top 10 Profiles & Scoring",
          view: "readTop05",
          create: "createTop05",
          edit: "updateTop05",
          delete: "deleteTop05"
        },
        // {
        //   key: Math.random(),
        //   id: "winner",
        //   permission: "Winner Profile & Scoring",
        //   view: "readWinner",
        //   create: "createWinner",
        //   edit: "updateWinner",
        //   delete: "deleteWinner"
        // },
        {
          key: Math.random(),
          id: "news",
          permission: "News & PR",
          view: "readNews",
          create: "createNews",
          edit: "updateNews",
          delete: "deleteNews"
        },
        {
          key: Math.random(),
          id: "banners",
          permission: "Banners",
          view: "readBanner",
          create: "createBanner",
          edit: "updateBanner",
          delete: "deleteBanner"
        },
        {
          key: Math.random(),
          id: "webinars",
          permission: "Webinars",
          view: "readWebinar",
          create: "createWebinar",
          edit: "updateWebinar",
          delete: "deleteWebinar"
        },
        {
          key: Math.random(),
          id: "competitions",
          permission: "Competitions",
          view: "readCompetition",
          create: "createCompetition",
          edit: "updateCompetition",
          delete: "deleteCompetition"
        },
        {
          key: Math.random(),
          id: "submissions",
          permission: "Competition Submissions",
          view: "readSubmission",
          create: "createSubmission",
          edit: "updateSubmission",
          delete: "deleteSubmission"
        },
        {
          key: Math.random(),
          id: "coupons",
          permission: "Coupons",
          view: "readCoupon",
          create: "createCoupon",
          edit: "updateCoupon",
          delete: "deleteCoupon"
        }
      ]
    };
  }

  renderColumns = (text, record, column) => (
    <Checkbox
      onChange={e => this.onChangeCheckbox(e, record, column)}
      id={column}
      checked={this.state.permissions.includes(text) ? true : false}
      disabled={
        Number(this.props.id) === 1 ||
        Number(this.props.id) === 4 ||
        (text.includes("delete") && text !== "deleteSubmission") ||
        text === "updateTransaction" ||
        text === "createProfile"
          ? true
          : false
      }
    />
  );

  onChangeCheckbox = (e, record, column) => {
    const { checked } = e.target;
    let { permissions } = this.state;
    permissions = JSON.parse(permissions);

    // Get the permission value if it exists already
    const permValue = record[column];
    // Find the index of the existing value. If non-existent, then it will return -1.
    const permIndex = permissions.findIndex(i => i === permValue);

    if (permIndex > -1) {
      if (!checked) permissions.splice(permIndex, 1);
    } else permissions.push(permValue);

    this.setState({ permissions: JSON.stringify(permissions) });
  };

  onChangeInternCheckbox = e => {
    const { checked } = e.target;
    let { permissions } = this.state;
    permissions = JSON.parse(permissions);

    const permIndex = permissions.findIndex(i => i === "isIntern");

    if (permIndex > -1) {
      if (!checked) permissions.splice(permIndex, 1);
    } else permissions.push("isIntern");

    this.setState({ permissions: JSON.stringify(permissions) });
  };

  onSubmit = (event, manageRole) => {
    event.preventDefault();

    //Define Props for validateForm
    let validationArray = [
      {
        fieldName: "title",
        fieldValue: this.state.title,
        checkNotEmpty: "Y"
      }
    ];
    //Catch return data in variable
    let validationData = validateForm(validationArray);
    if (validationData.formIsValid === false) {
      //if validation fails, set the errors into state. Use this to display error below the Input field
      this.setState({ errors: validationData.errors });
    } else {
      //if validation succeeds, call the Mutation Here
      manageRole().then(async ({ data }) => {
        notification.success({
          message: "Success",
          description: "Saved Successfully."
        });
        this.props.page_history.push("/user-management/roles");
      });
    }
  };

  render() {
    const { tabledata, title, permissions, isIntern, errors } = this.state;
    const columns = [
      {
        title: "Module",
        dataIndex: "permission",
        key: "permission"
      },
      {
        title: "View",
        dataIndex: "view",
        key: "view",
        render: (text, record) => this.renderColumns(text, record, "view")
      },
      {
        title: "Create",
        dataIndex: "create",
        key: "create",
        render: (text, record) => this.renderColumns(text, record, "create")
      },
      {
        title: "Edit",
        dataIndex: "edit",
        key: "edit",
        render: (text, record) => this.renderColumns(text, record, "edit")
      },
      {
        title: "Delete",
        dataIndex: "delete",
        key: "delete",
        render: (text, record) => this.renderColumns(text, record, "delete")
      }
    ];

    return (
      <Mutation
        mutation={this.props.roleMutation}
        variables={
          this.props.id
            ? {
                id: this.props.id,
                title,
                permissions
              }
            : {
                title,
                permissions
              }
        }
      >
        {(manageRole, { data, loading, error }) => (
          <Card className="gx-card" title="Create Role">
            <Form layout={"vertical"}>
              <FormItem>
                <label htmlFor="title">Title*</label>
                <Input
                  name="title"
                  value={title}
                  onChange={e => this.setState({ title: e.target.value })}
                  placeholder="Role Title"
                  id="title"
                  disabled={
                    Number(this.props.id) === 1 || Number(this.props.id) === 4
                  }
                />
                <span className="error-below-input">{errors.title || ""}</span>
                <br />
                <br />

                <span>
                  <Checkbox
                    onChange={e => this.onChangeInternCheckbox(e)}
                    id="isIntern"
                    checked={permissions.includes("isIntern")}
                    disabled={
                      Number(this.props.id) === 1 || Number(this.props.id) === 4
                    }
                  />
                  &nbsp; Is Intern ?
                </span>
              </FormItem>

              <Table
                columns={columns}
                dataSource={tabledata}
                bordered
                size=""
                rowKey="id"
                pagination={false}
                // onChange={this.onTableChange}
              />
              <br />

              {Number(this.props.id) !== 1 && Number(this.props.id) !== 4 ? (
                <Button
                  type="primary"
                  onClick={event => this.onSubmit(event, manageRole)}
                  disabled={
                    Number(this.props.id) === 1 || Number(this.props.id) === 4
                  }
                >
                  {this.props.id ? "Save" : "Create"}
                </Button>
              ) : null}

              <Link to="/user-management/roles">
                <Button>Cancel</Button>
              </Link>
            </Form>
          </Card>
        )}
      </Mutation>
    );
  }
}
export default RoleForm;
