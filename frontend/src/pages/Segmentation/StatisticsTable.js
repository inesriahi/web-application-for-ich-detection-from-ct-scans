
import React, {useMemo} from 'react'
import "bootstrap/dist/css/bootstrap.min.css"
import TableContainer from '../../components/Extensions/Table/TableContainer'
import { SelectColumnFilter } from '../../components/Extensions/Table/filters'

const StatisticsTable = ({data}) => {
    const columns = useMemo(
        () => [
            {
                Header: "Type",
                accessor: "feature_type",
                Filter: SelectColumnFilter,
            },
            {
                Header: "Descriptor",
                accessor: "feature_name",
                disableSortBy: true
            },
            {
                Header: "Value",
                accessor: "feature_value",
                disableSortBy: true,
                disableFilters: true
            }
        ], [])

        console.log(data)
        return (
              <TableContainer columns={columns} data={data} />
          )
}

export default StatisticsTable