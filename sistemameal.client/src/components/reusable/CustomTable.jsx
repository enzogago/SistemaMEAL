import { FaPlus, FaSearch, FaSortDown } from 'react-icons/fa';
import { TiArrowSortedUp ,TiArrowSortedDown } from "react-icons/ti";
import Excel_Icon from '../../img/PowerMas_Excel_Icon.svg';
import Pdf_Icon from '../../img/PowerMas_Pdf_Icon.svg';
import Pagination from '../reusable/Pagination';
import {
    flexRender, 
} from '@tanstack/react-table';

const CustomTable = ({ title, searchFilter, setSearchFilter, actions, openModal, dropdownOpen, setDropdownOpen, Export_Excel, Export_PDF, table }) => {
    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    }

    return (
        <div className='TableMainContainer Large-p1'>
            <div className="">
                <h1 className="Large-f1_5">{title}</h1>
                <div className="flex">
                    <div className="PowerMas_Search_Container Large_6 Large-m_5">
                        <FaSearch className="Large_1 search-icon" />
                        <input 
                            className='PowerMas_Input_Filter Large_12 p_5'
                            type="search"
                            placeholder='Buscar'
                            value={searchFilter}
                            onChange={e => setSearchFilter(e.target.value)}
                        />
                    </div>
                    {
                        actions.add && 
                        <button 
                            className=' flex jc-space-between Large_3 Large-m_5 Large-p_5 PowerMas_ButtonStatus'
                            onClick={() => openModal()} 
                            disabled={!actions.add}
                        >
                            Nuevo <FaPlus className='Large_1' /> 
                        </button>
                    }
                    <div className={`PowerMas_Dropdown_Export Large_3 Large-m_5 ${dropdownOpen ? 'open' : ''}`}>
                        <button className="Large_12 Large-p_5 flex ai-center jc-space-between" onClick={toggleDropdown}>Exportar <FaSortDown className='Large_1' /></button>
                        <div className="PowerMas_Dropdown_Export_Content Phone_12">
                            <a onClick={Export_Excel} className='flex jc-space-between p_5'>Excel <img className='Large_1' src={Excel_Icon} alt="" /> </a>
                            <a onClick={Export_PDF} className='flex jc-space-between p_5'>PDF <img className='Large_1' src={Pdf_Icon} alt="" /></a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="PowerMas_TableContainer">
                <table className="Large_12 PowerMas_TableStatus">
                    <thead>
                        {
                            table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id}>
                                    {
                                        headerGroup.headers.map(header =>(
                                            <th className='' style={{ width: header.getSize(), position: 'relative'  }} key={header.id} onClick={header.column.getToggleSortingHandler()}>
                                                <div>
                                                    {
                                                        flexRender(header.column.columnDef.header, header.getContext())
                                                    }
                                                   <div className='flex flex-column ai-center jc-center'>
                                                        {header.column.getIsSorted() === 'asc' && !header.column.columnDef.disableSorting ? 
                                                            <TiArrowSortedUp className={`sort-icon active`} /> :
                                                            header.column.getIsSorted() === 'desc' && !header.column.columnDef.disableSorting ? 
                                                            <TiArrowSortedDown className={`sort-icon active`} /> :
                                                            !header.column.columnDef.disableSorting &&
                                                            <>
                                                                <TiArrowSortedUp className={`sort-icon`} />
                                                                <TiArrowSortedDown className={`sort-icon`} />
                                                            </>
                                                        }
                                                    </div>
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
                                    <tr key={row.id}>
                                        {row.getVisibleCells().map(cell => (
                                            <td style={{ width: cell.column.getSize() }} key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            :   <tr className='PowerMas_TableEmpty'>
                                    <td colSpan={3} className='Large-p1 center'>
                                        No se encontraron registros
                                    </td>
                                </tr>
                        }
                    </tbody>
                </table>
            </div>
            <Pagination table={table} />
        </div>
    );
}

export default CustomTable;
