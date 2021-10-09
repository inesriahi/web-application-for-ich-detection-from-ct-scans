import React, {useMemo} from 'react'
import { Container } from "reactstrap"
import "bootstrap/dist/css/bootstrap.min.css"
import TableContainer from './TableContainer'

const MetadataTable = ({metadata}) => {
    const columns = useMemo(
        () => [
            {
                Header: "Tag",
                accessor: "tag"
            },
            {
                Header: "Value",
                accessor: "value"
            },  
            {
                Header: "VR",
                accessor: "vr"
            }, 
        ], [])

        const data = []
        for (const [key, value] of Object.entries(metadata)){
            const entry = {'tag': key};
            for (const [subkey, subvalue] of Object.entries(value)){
                if (subkey === 'Value') {
                    entry['value'] = subvalue.toString();
                } else{
                    entry[subkey] = subvalue;
                }
            }
            data.push(entry);
        }
        console.log(data)
        return (
            <Container fluid>
              <TableContainer columns={columns} data={data} />
            </Container>
          )
}

export default MetadataTable
