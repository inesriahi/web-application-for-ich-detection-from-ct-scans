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

        // const data = []
        // for (const [key, value] of Object.entries(metadata)){
        //     const entry = {'tag': key};
        //     for (const [subkey, subvalue] of Object.entries(value)){
        //         if (subkey === 'Value') {
        //             entry['value'] = subvalue.toString();
        //         } else{
        //             entry[subkey] = subvalue;
        //         }
        //     }
        //     data.push(entry);
        // }
        console.log(metadata)
        return (
            <Container fluid>
              <TableContainer columns={columns} data={metadata} />
            </Container>
          )
}

export default MetadataTable
