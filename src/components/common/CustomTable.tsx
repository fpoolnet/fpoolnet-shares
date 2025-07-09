import React, { useEffect, useState } from 'react';
import { IQueryParams } from '@interfaces/IQueryParams';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { gridClasses, GridColumnVisibilityModel } from '@mui/x-data-grid';
import CustomTableToolbar from '@components/common/CustomTableToolbar';
import StyledDataGrid from '@components/styled/StyledDataGrid';

interface CustomTableProps {
  columns: any;
  rows: any;
  hidePagination?: boolean;
  selectItem?: boolean;
  multiSelection?: boolean;
  stripedRows?: boolean;
  rowCount?: number;
  editAction?: boolean;
  deleteAction?: boolean;
  addAction?: boolean;
  statusAction?: boolean;
  isLoading?: boolean;
  filters?: boolean;
  autoSelectAll?: boolean;
  onRowAdd?: () => void;
  onRowEdit?: (id: string) => void;
  onRowDelete?: (id: string) => void;
  onPaginationChange?: (paginationModel: any) => void;
  onRowStatusChange?: (id: string, is_active: boolean) => void;
  onSelectionChange?: (collection: string[]) => void;
}

const CustomTable = (props: CustomTableProps) => {
  const {
    columns,
    hidePagination,
    selectItem,
    multiSelection,
    stripedRows,
    filters,
    editAction,
    addAction,
    deleteAction,
    statusAction,
    rows,
    rowCount,
    autoSelectAll,
    isLoading,
    onRowEdit,
    onRowAdd,
    onRowDelete,
    onSelectionChange,
    onRowStatusChange,
    onPaginationChange
  } = props;

  const [paginationModel, setPaginationModel] = React.useState<any>({
    pageSize: 50,
    page: 0
  });

  const [selectionModel, setSelectionModel] = useState<any>();
  const [columnVisibilityModel, setColumnVisibilityModel] = useState<GridColumnVisibilityModel>();

  const tableColumns = columns({
    editAction,
    deleteAction,
    statusAction,
    onRowDelete,
    onRowEdit,
    onRowStatusChange
  });

  useEffect(() => {
    if (onPaginationChange) {
      const queryParams: IQueryParams = {
        p: paginationModel.page + 1,
        l: paginationModel.pageSize
      };
      onPaginationChange(queryParams);
    }
  }, [paginationModel]);

  useEffect(() => {
    if (tableColumns && !columnVisibilityModel) {
      const maskedColumns = tableColumns?.reduce((acc: any, column: any) => {
        const { field, masked } = column;

        acc[field] = !masked;
        return acc;
      }, {});
      setColumnVisibilityModel(maskedColumns);
    }
  }, [tableColumns]);

  useEffect(() => {
    if (onSelectionChange) onSelectionChange(selectionModel);
  }, [selectionModel]);

  useEffect(() => {
    if (autoSelectAll && rows.length > 1) {
      const rowIds = rows.forEach((row: any) => row.id);
      setSelectionModel(rowIds);
    }
  }, [autoSelectAll, rows]);

  return (
    <>
      {columns && rows && (
        <StyledDataGrid
          pagination
          checkboxSelection={selectItem}
          loading={isLoading}
          rows={rows}
          rowCount={rowCount || 0}
          columnVisibilityModel={columnVisibilityModel}
          onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
          columns={tableColumns}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          disableColumnMenu={!filters}
          pageSizeOptions={[10, 25, 50, 100]}
          rowSelectionModel={selectionModel}
          initialState={{
            density: 'compact'
          }}
          onRowSelectionModelChange={(selection: any) => {
            if (multiSelection === false && selection.length > 1) {
              const selectionSet = new Set(selectionModel);
              const result = selection.filter((s: string) => !selectionSet.has(s));
              setSelectionModel(result);
            } else {
              setSelectionModel(selection);
            }
          }}
          slots={{
            detailPanelExpandIcon: KeyboardArrowDown,
            detailPanelCollapseIcon: KeyboardArrowUp,
            toolbar: addAction
              ? () => <CustomTableToolbar addAction={addAction} handleAddNewRow={onRowAdd} />
              : undefined
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
