import React, {useMemo} from 'react'
import { Container } from "reactstrap"
import "bootstrap/dist/css/bootstrap.min.css"
import TableContainer from './TableContainer'
import { SelectColumnFilter } from './filters'

const MetadataTable = ({metadata}) => {
    const columns = useMemo(
        () => [
            {
                Header: "Tag",
                accessor: "tag"
            },
            {
                Header: "Name",
                accessor: "name"
            },
            {
                Header: "Value",
                accessor: "value",
                disableSortBy: true,
                disableFilters: true
            },  
            {
                Header: "VR",
                accessor: "vr",
                Filter: SelectColumnFilter,
            }, 
        ], [])

        console.log(metadata)
        return (
            <Container fluid>
              <TableContainer columns={columns} data={metadata} />
            </Container>
          )
}

export default MetadataTable
