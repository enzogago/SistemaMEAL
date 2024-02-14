const TableRow = ({ row, flexRender }) => (
    <tr key={row.id}>
        {row.getVisibleCells().map(cell => (
            <td key={cell.id} className="p_5">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
        ))}
    </tr>
);

export default TableRow