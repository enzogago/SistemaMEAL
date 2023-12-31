import { useNavigate } from 'react-router-dom';
import { useContext, useMemo, useState } from 'react';
import { FaPenNib, FaPlus, FaSortDown, FaSortUp, FaTrash } from 'react-icons/fa';
import {
    useReactTable, 
    getCoreRowModel, 
    flexRender, 
    getPaginationRowModel,
    getSortedRowModel, 
} from '@tanstack/react-table';
import Pagination from '../reusable/Pagination';
import TableRow from './TableRow';
import { AuthContext } from '../../context/AuthContext';

const Table = ({data}) => {
    const navigate = useNavigate();
    // Variables State AuthContext 
    const { authActions } = useContext(AuthContext);
    const { setUserMaint } = authActions;
    // Estados locales para el filtrado
    const [sorting, setSorting] = useState([]);
    const [anoFilter, setAnoFilter] = useState('');
    const [codigoFilter, setCodigoFilter] = useState('');
    const [nombreFilter, setNombreFilter] = useState('');
    const [apellidoFilter, setApellidoFilter] = useState('');
    const [cargoFilter, setCargoFilter] = useState('');
    const [rolFilter, setRolFilter] = useState('');
    const [estadoFilter, setEstadoFilter] = useState('');
    const [correoFilter, setCorreoFilter] = useState('');

    const filteredData = useMemo(() => 
        data.filter(item => 
            item.usuAno.includes(anoFilter.toUpperCase()) &&
            item.usuCod.includes(codigoFilter.toUpperCase()) &&
            item.usuNom.includes(nombreFilter.toUpperCase()) &&
            item.usuApe.includes(apellidoFilter.toUpperCase()) &&
            item.usuCorEle.includes(correoFilter.toUpperCase()) &&
            item.cargo.carNom.includes(cargoFilter.toUpperCase()) &&
            item.rol.rolNom.includes(rolFilter.toUpperCase()) &&
            item.usuEst.includes(estadoFilter.toUpperCase())
        ), [data, codigoFilter, nombreFilter, apellidoFilter, cargoFilter, estadoFilter, correoFilter]
    );

    const columns = [
        {
            header: "Año",
            accessorKey: "usuAno"
        },
        {
            header: "Código",
            accessorKey: "usuCod"
        },
        {
            header: "Nombre",
            accessorKey: "usuNom"
        },
        {
            header: "Apellido",
            accessorKey: "usuApe"
        },
        {
            header: "Correo",
            accessorKey: "usuCorEle"
        },
        {
            header: "Cargo",
            accessorKey: "cargo.carNom"
        },
        {
            header: "Rol",
            accessorKey: "rol.rolNom"
        },
        {
            header: "Estado",
            accessorKey: "usuEst"
        },
    ]
    
    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting
        },
        onSortingChange: setSorting,
        columnResizeMode: "onChange"
    })

    const handleRowClick = (usuAno,usuCod) => {
        const selectedUser = data.find(user => user.usuAno === usuAno && user.usuCod === usuCod);
        const userValues = {
            usuAno: selectedUser.usuAno,
            usuCod: selectedUser.usuCod,
            docIdeCod: selectedUser.docIdeCod,
            usuNumDoc: selectedUser.usuNumDoc,
            usuCorEle: selectedUser.usuCorEle,
            usuNom: selectedUser.usuNom,
            usuApe: selectedUser.usuApe,
            usuTel: selectedUser.usuTel,
            rolCod: selectedUser.rolCod,
            carCod: selectedUser.carCod,
            usuEst: selectedUser.usuEst,
            usuFecNac: selectedUser.usuFecNac,
            usuSex: selectedUser.usuSex,
            usuFecInc: selectedUser.usuFecInc,
            usuNomUsu: selectedUser.usuNomUsu,
            usuPas: selectedUser.usuPas
        };
        setUserMaint(userValues);
        navigate('/form-user');
    };
    
    
    const handleNewClick = () => {
        navigate('/form-user');
        setUserMaint({});
    };
    
    return (
        <div className='TableMainContainer Large-p2'>
            <div className="flex jc-space-between">
                <h1 className="flex left Large-f1_75">Listado de usuarios</h1>
                <button className='Large-p_5 PowerMas_ButtonStatus' onClick={handleNewClick}>
                    Nuevo <FaPlus /> 
                </button>
            </div>
            <div className="PowerMas_TableContainer">
                <table className="Large_12 PowerMas_TableStatus">
                    <thead>
                        <tr>
                        <th>
                                <input 
                                    type="search"
                                    placeholder='Filtrar'
                                    value={anoFilter}
                                    onChange={e => setAnoFilter(e.target.value)}
                                />
                            </th>
                            <th>
                                <input 
                                    type="search"
                                    placeholder='Filtrar'
                                    value={codigoFilter}
                                    onChange={e => setCodigoFilter(e.target.value)}
                                />
                            </th>
                            <th>
                                <input 
                                    type="search"
                                    placeholder='Filtrar'
                                    value={nombreFilter}
                                    onChange={e => setNombreFilter(e.target.value)}
                                />
                            </th>
                            <th>
                                <input 
                                    type="search"
                                    placeholder='Filtrar'
                                    value={apellidoFilter}
                                    onChange={e => setApellidoFilter(e.target.value)}
                                />
                            </th>
                            <th>
                                <input 
                                    type="search"
                                    placeholder='Filtrar'
                                    value={correoFilter}
                                    onChange={e => setCorreoFilter(e.target.value)}
                                />
                            </th>
                            <th>
                                <input 
                                    type="search"
                                    placeholder='Filtrar'
                                    value={cargoFilter}
                                    onChange={e => setCargoFilter(e.target.value)}
                                />
                            </th>
                            <th>
                                <input 
                                    type="search"
                                    placeholder='Filtrar'
                                    value={rolFilter}
                                    onChange={e => setRolFilter(e.target.value)}
                                />
                            </th>
                            <th>
                                <input 
                                    type="search"
                                    placeholder='Filtrar'
                                    value={estadoFilter}
                                    onChange={e => setEstadoFilter(e.target.value)}
                                />
                            </th>
                        </tr>
                        {
                            table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id}>
                                    {
                                        headerGroup.headers.map(header =>(
                                            <th style={{ width: header.getSize(), position: 'relative'  }} key={header.id} onClick={header.column.getToggleSortingHandler()}>
                                                <div>
                                                    {
                                                    flexRender(header.column.columnDef.header, header.getContext())
                                                    }
                                                    {
                                                        {
                                                            asc: <FaSortUp />,
                                                            desc: <FaSortDown />
                                                        }[header.column.getIsSorted() ?? null]
                                                    }
                                                </div>
                                                <span 
                                                    onMouseDown={
                                                        header.getResizeHandler()
                                                    }
                                                    onTouchStart={
                                                        header.getResizeHandler()
                                                    }

                                                    className={header.column.getIsResizing() 
                                                    ? "resizer isResizing" 
                                                    : "resizer"} >
                                                </span>

                                                
                                            </th>
                                        ))
                                    }
                                </tr>
                            ))
                        }
                    </thead>
                    <tbody>
                        {
                            table.getRowModel().rows.length > 0 ?
                                table.getRowModel().rows.map(row => (
                                    <TableRow key={row.id} row={row} handleRowClick={handleRowClick} flexRender={flexRender} />
                                ))
                            : <tr className='PowerMas_TableEmpty'><td colSpan={8} className='Large-p1 center'>No se encontraron registros</td></tr>
                        }
                    </tbody>
                </table>
            </div>
            <Pagination table={table} />
        </div>
    )
}

export default Table