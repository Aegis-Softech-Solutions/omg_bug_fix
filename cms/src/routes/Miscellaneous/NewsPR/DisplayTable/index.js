import React from "react";
import { Mutation } from "react-apollo";
import { connect } from "react-redux";
import { ALL_NEWS, CHANGE_NEWS_STATUS } from "../queries";
import DisplayTable from "../../../../pixelsComponents/DisplayTable";

const ProgramsTable = props => {
  sessionStorage.clear();
  const { userPermissions } = props;

  return (
    <Mutation mutation={CHANGE_NEWS_STATUS}>
      {changeStatus => {
        const columnList = [
          // {
          //   title: 'Featured Image',
          //   dataIndex: 'featured_image',
          //   key: 'featured_image',
          //   width: 160,
          //   filterableYN: 'N',
          //   sortableYN: 'N',
          //   fieldType: 'image',
          //   imgFolderUrl: process.env.REACT_APP_MISC_URL,
          //   placeholderType: 'general' // values to be passed: "general", or, "profile"
          // },
          {
            title: "Title",
            dataIndex: "title",
            key: "title",
            filterableYN: "N",
            sortableYN: "Y",
            redirectYN: "Y",
            redirectString: "/misc/news-and-pr/update/"
          },
          {
            title: "Publish Date",
            dataIndex: "publish_at",
            key: "publish_at",
            fieldType: "date",
            filterableYN: "N",
            sortableYN: "Y"
          },
          {
            title: "Active",
            dataIndex: "active",
            key: "active",
            fieldType: "mutationSwitch",
            mutation: changeStatus,
            variables: [{ varName: "news_id", varValue: "id" }],
            statusVariableName: "status",
            disabled: !(
              userPermissions && userPermissions.includes("updateNews")
            ),
            filterableYN: "N",
            sortableYN: "N"
          }
        ];

        return (
          <DisplayTable
            columns={columnList}
            selectQuery={ALL_NEWS}
            title="News & PR"
            showCreateButton="Y"
            createLink="/misc/news-and-pr/create/"
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

export default connect(mapStateToProps)(ProgramsTable);
