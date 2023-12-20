const Pagination = ({ table }) => {
    return (
        <div className="PowerMas_Pagination Large_12 flex column jc-space-between ai-center">
            <div>
                <button onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>{"<<"}</button>
                <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>{"<"}</button>
                <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>{">"}</button> 
                <button onClick={() => table.setPageIndex(table.getPageCount() -1)} disabled={!table.getCanNextPage()}>{">>"}</button>
            </div>
            <div>
                <select 
                    value={table.options.state.pagination.pageSize} 
                    onChange={(e) => table.setPageSize(e.target.value)}
                > 
                    {[5,10,20,40].map(pageSizeEl => {
                        return  <option key={ pageSizeEl } value={pageSizeEl}> 
                                    {pageSizeEl} 
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