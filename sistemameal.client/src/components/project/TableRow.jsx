import { useNavigate } from "react-router-dom"
import CryptoJS from 'crypto-js';

const TableRow = ({ row, flexRender }) => {
    const navigate = useNavigate();

    const handleRowClick = () => {
        const id = `${row.original.proAno}${row.original.proCod}`;
        // Encripta el ID
        const ciphertext = CryptoJS.AES.encrypt(id, 'secret key 123').toString();
        // Codifica la cadena cifrada para que pueda ser incluida de manera segura en una URL
        const encodedCiphertext = encodeURIComponent(ciphertext);
        navigate(`/new-project/${encodedCiphertext}`);
    }

    return (
        <tr 
            onClick={handleRowClick}
            className='pointer' 
            key={row.id}>
            {row.getVisibleCells().map(cell => (
                <td style={{ width: cell.column.getSize() }} key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
            ))}
        </tr>
)};

export default TableRow