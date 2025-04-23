import React from 'react';
import { Mutation } from 'react-apollo';
import { connect } from 'react-redux';
import { USERS, CHANGE_STATUS } from '../queries';
import DisplayTable from '../../../../pixelsComponents/DisplayTable';

const Users = (props) => {
  const { userPermissions } = props;

  return (
    <Mutation mutation={CHANGE_STATUS}>
      {(changeStatus) => {
        const columnList = [
          {
            title: 'Profile Pic',
            dataIndex: 'profile_pic',
            key: 'profile_pic',
            width: 100,
            filterableYN: 'N',
            sortableYN: 'N',
            fieldType: 'image',
            imgFolderUrl: process.env.REACT_APP_ADMIN_URL,
            placeholderType: 'profile' // values to be passed: "general", or, "profile"
          },
          {
            title: 'User Name',
            dataIndex: 'full_name',
            key: 'full_name',
            filterableYN: 'N',
            sortableYN: 'Y',
            redirectYN: 'Y',
            redirectString: '/user-management/users/read/'
          },
          {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            filterableYN: 'N',
            sortableYN: 'Y'
          },
          {
            title: 'Role',
            dataIndex: 'title',
            key: 'title',
            filterableYN: 'Y',
            sortableYN: 'Y'
          },
          {
            title: 'Active',
            dataIndex: 'active',
            key: 'active',
            fieldType: 'mutationSwitch',
            mutation: changeStatus,
            variables: [{ varName: 'id', varValue: 'id' }],
            statusVariableName: 'status',
            disabled: !(userPermissions && userPermissions.includes('updateUser')),
            filterableYN: 'N',
            sortableYN: 'N'
          }
        ];

        return (
          <DisplayTable
            columns={columnList}
            selectQuery={USERS}
            title="Admins"
            showCreateButton="Y"
            createLink="/user-management/users/create/"
          />
        );
      }}
    </Mutation>
  );
};

const mapStateToProps = ({ auth }) => {
  let userPermissions = window.atob(auth.userPermissions);
  return { userPermissions };
};

export default connect(mapStateToProps)(Users);
