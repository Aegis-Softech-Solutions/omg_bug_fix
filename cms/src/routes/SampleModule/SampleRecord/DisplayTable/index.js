import React from "react";
import { SAMPLE_RECORDS } from "../queries";

import DisplayTable from "../../../../pixelsComponents/DisplayTable";

const SampleRecords = () => {
  let columnList = [
    {
      title: "Sample Record Name",
      dataIndex: "sample_record_name",
      key: "sample_record_name",
      filterableYN: "Y",
      sortableYN: "Y",
      redirectYN: "Y",
      redirectString: "/sample-module/sample-records/read/"
    }
  ];

  return (
    <DisplayTable
      columns={columnList}
      selectQuery={SAMPLE_RECORDS}
      title="Sample Records"
      showCreateButton="Y"
      createLink="/sample-module/sample-records/create/"
    />
  );
};

export default SampleRecords;
