import { DataGrid } from "@material-ui/data-grid";
import { useState } from "react";

const MuiGrid = ({ data, columns }) => {
    const [pageSize, setPageSize] = useState(10);

    return (
        <DataGrid
            rows={data}
            disableSelectionOnClick
            columns={columns}
            rowsPerPageOptions={[10, 20, 50, 100]}
            pageSize={pageSize}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            rowHeight={40}
            checkboxSelection
            autoHeight={true}
        />
    )
}

export default MuiGrid