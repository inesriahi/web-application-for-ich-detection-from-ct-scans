import React, { useMemo } from "react";
import { Container } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import TableContainer from "../../../Extensions/Table/TableContainer";
import { SelectColumnFilter } from "../../../Extensions/Table/filters";

const MetadataTable = ({ metadata }) => {
  const columns = useMemo(
    () => [
      {
        Header: "Tag",
        accessor: "tag",
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Value",
        accessor: "value",
        disableSortBy: true,
        disableFilters: true,
      },
      {
        Header: "VR",
        accessor: "vr",
        Filter: SelectColumnFilter,
      },
    ],
    []
  );

  return (
    <Container fluid>
      <div className="table">
        <TableContainer columns={columns} data={metadata} />
      </div>
    </Container>
  );
};

export default MetadataTable;
