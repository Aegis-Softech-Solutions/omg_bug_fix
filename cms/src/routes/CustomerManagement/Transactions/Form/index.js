import React, { Component } from "react";
import { Mutation } from "react-apollo";
import { withApollo } from "react-apollo";
import { Row, Col, Select, Input, Button, Card, notification } from "antd";
import { validateForm } from "../../../../pixelsComponents/validateForm";
import { ALL_CUSTOMERS_LIST_BY_SEARCH } from "../../Customers/queries";
import { ADD_TRANSACTION } from "../queries";

const { Option } = Select;

class OfflineTransactionForm extends Component {
  state = { errors: {}, searchTerm: null, customers: [], amount: 0 };

  handleSearch = async () => {
    const { searchTerm } = this.state;
    if (searchTerm) {
      const { data } = await this.props.client.query({
        query: ALL_CUSTOMERS_LIST_BY_SEARCH,
        variables: { searchTerm }
      });
      this.setState({ customers: data.customersNamesListBySearch });
    } else this.setState({ customers: [] });
  };

  addTransaction = addOfflineTransaction => {
    const { customer_id, amount } = this.state;
    const { page_history } = this.props;

    let validationArray = [
      { fieldName: "customer_id", fieldValue: customer_id, checkNotEmpty: "Y" }
    ];
    let validationData = validateForm(validationArray);

    if (!validationData.formIsValid) {
      this.setState({ errors: validationData.errors });
      notification.error({
        message: "Incomplete Form!",
        description: "All fields are mandatory."
      });
      return;
    }

    addOfflineTransaction({
      variables: { customer_id, amount: Number(amount) }
    })
      .then(data => {
        page_history.push("/contestant-management/transactions");
        notification.success({
          message: "Transaction successfully updated for the given contestant."
        });
      })
      .catch(error => {
        notification.error({
          message: "Error occured while assigning Subscription.",
          description: error.message
            ? error.message
            : "Please contact system administrator."
        });
      });
  };

  render() {
    const { customer_id, customers, errors, amount } = this.state;

    return (
      <Mutation mutation={ADD_TRANSACTION}>
        {save => (
          <Card
            className="gx-card"
            title="Add succesful transaction for a contestant"
          >
            <Row>
              <Col
                span={6}
                className="padding-bottom-10px"
                style={{ textAlign: "right", marginTop: 10 }}
              >
                Customer<span className="error-below-input"> *</span>
              </Col>
              <Col span={12}>
                <Select
                  showSearch
                  defaultActiveFirstOption={false}
                  value={customer_id}
                  style={{ width: "100%" }}
                  placeholder="Type and press 'ENTER' to search"
                  onChange={e => this.setState({ customer_id: e })}
                  onSearch={e => {
                    let setObj = { searchTerm: e };
                    if (!e) setObj = { ...setObj, customers: [] };
                    this.setState(setObj);
                  }}
                  onInputKeyDown={e => {
                    if (e.key === "Enter") this.handleSearch();
                  }}
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {customers.map(obj => (
                    <Option key={Number(obj.id)} value={Number(obj.id)}>
                      {`${obj.full_name} (${obj.email})`}
                    </Option>
                  ))}
                </Select>
                <br />
                <span className="errorStyle">{errors.customer_id || ""}</span>
              </Col>
            </Row>
            <br />
            <br />

            <Row>
              <Col
                span={6}
                className="padding-bottom-10px"
                style={{ textAlign: "right", marginTop: 10 }}
              >
                Amount<span className="error-below-input"> *</span>
              </Col>
              <Col span={12}>
                <Input
                  type="number"
                  name="amount"
                  value={amount}
                  onChange={e => this.setState({ amount: e.target.value })}
                />
                <br />
                <span className="errorStyle">{errors.amount || ""}</span>
              </Col>
            </Row>
            <br />
            <br />

            <Row style={{ paddingLeft: "16px" }}>
              <Button type="primary" onClick={() => this.addTransaction(save)}>
                Save
              </Button>
            </Row>
          </Card>
        )}
      </Mutation>
    );
  }
}

export default withApollo(OfflineTransactionForm);
