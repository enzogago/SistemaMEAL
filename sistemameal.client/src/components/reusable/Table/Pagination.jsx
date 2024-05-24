const Pagination = ({ table, isLargePagination }) => {
    // Define los tamaños de página para la paginación pequeña y grande
    const smallPageSizes = [10, 20, 30, 50];
    const largePageSizes = [100, 200, 300, 500];

    // Usa los tamaños de página correspondientes dependiendo del valor de isLargePagination
    const pageSizes = isLargePagination ? largePageSizes : smallPageSizes;

    return (
        <div className="PowerMas_Pagination Large_12 flex column jc-space-between ai-center Large-p_25">
            <div className="todo">
                <button onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>{"<<"}</button>
                <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>{"<"}</button>
                <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>{">"}</button> 
                <button onClick={() => table.setPageIndex(table.getPageCount() -1)} disabled={!table.getCanNextPage()}>{">>"}</button>
            </div>
            <div>
                <select 
                    value={table.options.state.pagination.pageSize} 
                    onChange={(e) => table.setPageSize(e.target.value)}
                    className="p_5"
                > 
                    {pageSizes.map(pageSize => {
                        return  <option key={pageSize} value={pageSize}> 
                                    {pageSize} 
                                </option>;
                    })}
                </select>
            </div>
            <div>
                <p>
                    Mostrando {table.options.state.pagination.pageIndex * table.options.state.pagination.pageSize + 1} a {Math.min((table.options.state.pagination.pageIndex + 1) * table.options.state.pagination.pageSize, table.options.data.length)} de {table.options.data.length} registros
                </p>
            </div>
        </div>
    );
};
export default Pagination;
