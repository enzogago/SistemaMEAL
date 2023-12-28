const TableRow = ({ row, handleRowClick, flexRender }) => (
    <tr className='pointer' key={row.id} onClick={() => handleRowClick(row.original.usuAno,row.original.usuCod)}>
        {row.getVisibleCells().map(cell => (
            <td style={{ width: cell.column.getSize() }} key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
        ))}
    </tr>
);

export default TableRow