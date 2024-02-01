const TableRow = ({ row, flexRender }) => (
    <tr className='' key={row.id}>
        {row.getVisibleCells().map(cell => (
            <td style={{ width: cell.column.getSize(), whiteSpace: 'nowrap' }} key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
        ))}
    </tr>
);

export default TableRow