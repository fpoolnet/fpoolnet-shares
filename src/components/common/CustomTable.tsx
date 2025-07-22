import StyledDataGrid from '@components/styled/StyledDataGrid';
import { gridClasses } from '@mui/x-data-grid';

interface CustomTableProps {
  columns: any;
  rows: any;
  hidePagination?: boolean;
  stripedRows?: boolean;
  isLoading?: boolean;
  filters?: boolean;
  autoSelectAll?: boolean;
  initialState?: any;
}

const CustomTable = (props: CustomTableProps) => {
  const {
    columns,
    hidePagination,
    stripedRows,
    filters,
    rows,
    isLoading,
    initialState
  } = props;


  return (
    <>
      {columns && rows && (
        <StyledDataGrid
          pagination
          loading={isLoading}
          rows={rows}
          columns={columns}
          disableColumnMenu={!filters}
          pageSizeOptions={[10, 25, 50, 100]}
          initialState={initialState ? {
            density: 'compact',
            ...initialState
          } : {
            density: 'compact'
          }}
          sx={{
            '& .MuiDataGrid-columnHeader': {
              backgroundColor: 'unset'
            },
            '& .MuiDataGrid-footerContainer': {
              display: hidePagination || !rows.length ? 'none' : 'block'
            },
            [`& .${gridClasses.cell}:focus, & .${gridClasses.cell}:focus-within`]: {
              outline: 'none'
            },
            [`& .${gridClasses.columnHeader}:focus, & .${gridClasses.columnHeader}:focus-within`]: {
              outline: 'none'
            }
          }}
          disableRowSelectionOnClick
          getRowClassName={(params) => {
            let classNames = '';
            if (params.row.is_active == false) {
              classNames += 'disabled ';
            }
            if (stripedRows) {
              classNames += params.indexRelativeToCurrentPage % 2 === 0 ? 'even ' : 'odd ';
            }
            return classNames;
          }}
        />
      )}
    </>
  );
};

export default CustomTable;
