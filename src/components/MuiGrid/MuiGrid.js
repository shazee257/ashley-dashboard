import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useState } from "react";

const MuiGrid = ({ data, columns, clickHanlder }) => {
    const [pageSize, setPageSize] = useState(10);

    return (
        <DataGrid
            rows={data}
            columns={columns}
            rowsPerPageOptions={[10, 20, 50, 100]}
            pageSize={pageSize}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            rowHeight={40}
            checkboxSelection
            autoHeight={true}
            onRowClick={clickHanlder}
            disableSelectionOnClick={true}
            components={{ Toolbar: GridToolbar }}
            componentsProps={{ toolbar: { printOptions: { disableToolbarButton: true } } }}
        />
    )
}

export default MuiGrid