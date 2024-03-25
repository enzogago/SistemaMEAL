import { FaPlus, FaSearch, FaSortDown } from 'react-icons/fa';
import { TiArrowSortedUp ,TiArrowSortedDown } from "react-icons/ti";
import Excel_Icon from '../../../img/PowerMas_Excel_Icon.svg';
import Pdf_Icon from '../../../img/PowerMas_Pdf_Icon.svg';
import Pagination from './Pagination';
import {
    flexRender, 
} from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import { GrNext, GrPrevious } from 'react-icons/gr';
import { useRef } from 'react';

const CustomTable = ({ 
    title, 
    searchFilter, 
    setSearchFilter, 
    actions, 
    openModal, 
    dropdownOpen, 
    setDropdownOpen, 
    Export_Excel, 
    Export_PDF, 
    table, 
    showPagination = true, 
    navigatePath = '', 
    scrolled,
    resize = true,
    handleInputChange,
    handleKeyDown,
    inputValue,
    removeTag,
    searchTags,
    setSearchTags,
    sums,
    isLargePagination = false
}) => {
    const navigate = useNavigate();
    
    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    }

    const tableRef = useRef(); 

    const animateScroll = (element, to, duration) => {
        const start = element.scrollLeft,
            change = to - start,
            increment = 20;
        let currentTime = 0;
    
        const animateScroll = () => {
            currentTime += increment;
            const val = Math.easeInOutQuad(currentTime, start, change, duration);
            element.scrollLeft = val;
            if(currentTime < duration) {
                setTimeout(animateScroll, increment);
            }
        };
        animateScroll();
    }
    
    Math.easeInOutQuad = function (t, b, c, d) {
        t /= d/2;
        if (t < 1) return c/2*t*t + b;
        t--;
        return -c/2 * (t*(t-2) - 1) + b;
    };
    
    const scrollTable = (direction) => {
        if (tableRef.current) {
            const distance = tableRef.current.offsetWidth * 0.8;  // 50% del ancho de la tabla
            const to = tableRef.current.scrollLeft + distance * direction;
            animateScroll(tableRef.current, to, 500);
        }
    }

    return (
        <div className='TableMainContainer Large-p1 Medium-p1 Small-p_5'>
            <div className="">
                <h1 className="Large-f1_5"> { title && `Listado de ${title}`}</h1>
                <div className="flex">
                    {setSearchFilter && 
                        <div className="PowerMas_Search_Container Large_6 Large-m_5 flex-grow-1">
                            <FaSearch className="Large_1 search-icon" />
                            <input 
                                className='PowerMas_Input_Filter Large_12 p_25'
                                type="search"
                                placeholder='Buscar'
                                value={searchFilter}
                                onChange={e => setSearchFilter(e.target.value)}
                            />
                        </div>
                    }
                    {
                        setSearchTags && removeTag &&
                        <div className="PowerMas_Search_Container Large_6 Large-m_5 flex-grow-1">
                            <div className="PowerMas_Input_Filter_Container flex">
                                <div className="flex ai-center">
                                    {searchTags && searchTags.map(tag => (
                                        <span key={tag} className="PowerMas_InputTag flex ai-center jc-center p_25 gap_5">
                                            <span className="f_75 flex ai-center">{tag}</span>
                                            <button className="f1 bold p0" onClick={() => removeTag(tag)}>x</button>
                                        </span>
                                    ))}
                                </div>
                                <div className="Phone_12 relative">
                                    <FaSearch className="search-icon" />
                                    <input 
                                        className='PowerMas_Input_Filter Large_12 Large-p_25'
                                        type="search"
                                        placeholder='Buscar'
                                        onChange={handleInputChange}
                                        onKeyDown={handleKeyDown}
                                        value={inputValue}
                                    />
                                </div>
                            </div>
                        </div>
                    }
                    {
                        actions && actions.add && 
                        <>
                            <button 
                                className='flex jc-space-between Large_3 Large-m_5 Large-p_5 PowerMas_ButtonStatus'
                                onClick={() => {openModal ? openModal() : navigate(`/${navigatePath}`)}} 
                                disabled={!actions.add}
                            >
                                Nuevo <FaPlus className='Large_1' /> 
                            </button>
                        </>
                    }
                    {
                        ((actions && actions.pdf) || (actions && actions.excel)) &&
                        <div className={`PowerMas_Dropdown_Export Large_3 Large-m_5 ${dropdownOpen ? 'open' : ''}`}>
                            <button className="Large_12 Large-p_5 flex ai-center jc-space-between" onClick={toggleDropdown}>Exportar <FaSortDown className='Large_1' /></button>
                            <div className="PowerMas_Dropdown_Export_Content Phone_12">
                                {actions.pdf &&
                                    <a onClick={() => {
                                        Export_PDF();
                                        setDropdownOpen(false);
                                    }} className='flex jc-space-between p_5'>PDF <img className='Large_1' src={Pdf_Icon} alt="" /></a>
                                }
                                {actions.excel &&
                                    <a onClick={() => {
                                        Export_Excel();
                                        setDropdownOpen(false);
                                    }} className='flex jc-space-between p_5'>Excel <img className='Large_1' src={Excel_Icon} alt="" /> </a>
                                }
                            </div>
                        </div>
                    }
                </div>
            </div>
            <div className="PowerMas_TableContainer flex-column" ref={tableRef}>
                <table className={`Large_12 PowerMas_TableStatus ${scrolled ? 'w-300' : ''}`}>
                    <thead>
                        {
                            table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id} style={{zIndex: 10}}>
                                    {
                                        headerGroup.headers.map((header, index, array) => (
                                            <th 
                                                className='ws-nowrap' 
                                                style={{ 
                                                    width: resize ? header.getSize():  '', 
                                                    position: header.column.columnDef.stickyRight !== undefined ? 'sticky' : 'relative', 
                                                    textTransform: 'capitalize',
                                                    right: header.column.columnDef.stickyRight !== undefined ? `${header.column.columnDef.stickyRight}px` : 'auto',
                                                    backgroundColor: '#fff', 
                                                }} 
                                                key={header.id} 
                                                onClick={header.column.getToggleSortingHandler()}
                                            >
                                                <div>
                                                    {
                                                        flexRender(header.column.columnDef.header, header.getContext())
                                                    }
                                                    <div className='flex flex-column ai-center jc-center PowerMas_Icons_Sorter'>
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

                                                {header.column.columnDef.stickyRight === undefined && resize && index !== array.length - 1 &&  // Muestra el elemento <span> solo si la columna no es "sticky" y no es el último encabezado
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
                                                }

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
                                <>
                                    {table.getRowModel().rows.map(row => (
                                        <tr key={row.id}>
                                            {row.getVisibleCells().map(cell => (
                                                !resize ?
                                                    <td 
                                                        key={cell.id} 
                                                        className="p_5 ws-nowrap"
                                                        style={{
                                                            position: cell.column.columnDef.stickyRight !== undefined ? 'sticky' : '', 
                                                            right: cell.column.columnDef.stickyRight !== undefined ? `${cell.column.columnDef.stickyRight}px` : 'auto',
                                                            backgroundColor: cell.column.columnDef.stickyRight !== undefined ? '#fff': '', 
                                                        }}
                                                    >
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </td>
                                                :
                                                    <td className='ws-nowrap' style={{ width:  cell.column.getSize() }} key={cell.id}>
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </td>
                                            ))}
                                        </tr>
                                    ))}
                                    {
                                        sums &&
                                        <tr className='PowerMas_Totales_Monitoreo'>
                                            <td>Totales</td>
                                            <td>{sums.metMetTec.toLocaleString()}</td>
                                            <td>{sums.metEjeTec.toLocaleString()}</td>
                                            <td>{((sums.metEjeTec/sums.metMetTec)*100).toFixed(2)}%</td>
                                            <td>${sums.metMetPre.toLocaleString()}</td>
                                            <td>${sums.metEjePre.toLocaleString()}</td>
                                            <td>{((sums.metEjePre/sums.metMetPre)*100).toFixed(2)}%</td>
                                            <td colSpan={50}></td>
                                        </tr>
                                    }
                                </>
                            :   <tr className='PowerMas_TableEmpty'>
                                    <td colSpan={20} className='Large-p1 center'>
                                        No se encontraron registros
                                    </td>
                                </tr>
                        }
                    </tbody>
                </table>
                {
                    scrolled &&
                    <>
                        <GrPrevious className="slider" style={{left: '0'}} onClick={() => scrollTable(-1)} />
                        <GrNext className="slider" style={{right: '0'}} onClick={() => scrollTable(1)} />
                    </>
                }
            </div>
            { showPagination && <Pagination table={table} isLargePagination={isLargePagination} />}
        </div>
    );
}

export default CustomTable;
