import React from 'react';
import { Col, Row } from 'antd';
import { connect } from 'react-redux';
import Auxiliary from 'util/Auxiliary';
import UserTable from './DisplayTable/UserTable';
import UserForm from './Form/UserForm';

const User = (props) => {
  const { userPermissions, authUser } = props;
  const { useraction, id } = props.match.params;

  switch (useraction) {
    case 'create':
      if (userPermissions.includes('createUser')) {
        return (
          <Auxiliary>
            <UserForm user_id={id} page_history={props.history} crud="create" />
          </Auxiliary>
        );
      } else {
        props.history.push('/error-404');
        return null;
      }

    case 'read':
      if (id && (userPermissions.includes('readUser') || Number(authUser) === Number(id))) {
        return (
          <Auxiliary>
            <UserForm user_id={id} page_history={props.history} crud="read" />
          </Auxiliary>
        );
      } else {
        props.history.push('/error-404');
        return null;
      }

    case 'update':
      if (id && (userPermissions.includes('updateUser') || Number(authUser) === Number(id))) {
        return (
          <Auxiliary>
            <UserForm user_id={id} page_history={props.history} crud="update" />
          </Auxiliary>
        );
      } else {
        props.history.push('/error-404');
        return null;
      }

    default:
      if (userPermissions.includes('readUser')) {
        return (
          <Row>
            <Col span={24}>
              <UserTable />
            </Col>
          </Row>
        );
      } else {
        props.history.push('/error-404');
        return null;
      }
  }
};

const mapStateToProps = ({ auth }) => {
  let userPermissions = window.atob(auth.userPermissions);
  let authUser = auth.authUser;
  return { userPermissions, authUser };
};

export default connect(mapStateToProps)(User);
