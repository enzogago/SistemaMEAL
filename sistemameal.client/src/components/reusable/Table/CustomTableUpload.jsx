import Excel_Icon from '../../../img/PowerMas_Excel_Icon.svg';
import Pdf_Icon from '../../../img/PowerMas_Pdf_Icon.svg';
import Pagination from './Pagination';
import {
    flexRender, 
} from '@tanstack/react-table';
import { useRef } from 'react';
import Search from '../../../icons/Search';

const CustomTableUpload = ({ 
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
    errorCells,
    isLargePagination
}) => {
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
                        <div className="PowerMas_Search_Container Large_6 Large-m_5">
                            <Search />
                            <input 
                                className='PowerMas_Input_Filter Large_12 p_5'
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
                                    <Search />
                                    <input 
                                        className='PowerMas_Input_Filter Large_12 Large-p_5'
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
                        ((actions && actions.pdf) || (actions && actions.excel)) &&
                        <div className={`PowerMas_Dropdown_Export Large_3 Large-m_5 ${dropdownOpen ? 'open' : ''}`}>
                            <button className="Large_12 Large-p_5 flex ai-center jc-space-between" onClick={toggleDropdown}>Exportar <Search /></button>
                            <div className="PowerMas_Dropdown_Export_Content Phone_12">
                                {actions.pdf &&
                                    <a onClick={Export_PDF} className='flex jc-space-between p_5'>PDF <img className='Large_1' src={Pdf_Icon} alt="" /></a>
                                }
                                {actions.excel &&
                                    <a onClick={Export_Excel} className='flex jc-space-between p_5'>Excel <img className='Large_1' src={Excel_Icon} alt="" /> </a>
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
                                        headerGroup.headers.map(header =>(
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
                                                   {/* <div className='flex flex-column ai-center jc-center PowerMas_Icons_Sorter'>
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
                                                    </div> */}
                                                </div>

                                                {header.column.columnDef.stickyRight === undefined && resize &&  // Muestra el elemento <span> solo si la columna no es "sticky"
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
                                table.getRowModel().rows.map(row => (
                                    <tr key={row.id}>
                                        {row.getVisibleCells().map(cell => {
                                            // Verifica si esta celda tiene un error
                                            const hasError = errorCells.some(errorCell => errorCell.row === row.index && errorCell.column === cell.column.columnDef.index);
                                            const errorCell = errorCells.find(errorCell => errorCell.row === row.index && errorCell.column === cell.column.columnDef.index);
                                            const errorMessage = errorCell ? errorCell.message : '';

                                            const cellText = cell.getValue().charAt(0).toUpperCase() + cell.getValue().slice(1);
                                            const shortText = cellText.length > 50 ? cellText.substring(0, 50) + '...' : cellText;

                                            return (
                                                <td 
                                                    key={cell.id} 
                                                    className={`p_5 ws-nowrap`}
                                                    style={{
                                                        position: cell.column.columnDef.stickyRight !== undefined ? 'sticky' : '', 
                                                        right: cell.column.columnDef.stickyRight !== undefined ? `${cell.column.columnDef.stickyRight}px` : 'auto',
                                                        backgroundColor: hasError ? 'red' : '#fff',
                                                        color: hasError ? '#fff' : '#000',
                                                    }}
                                                >
                                                     <div style={{textWrap: 'nowrap'}}>
                                                        <span
                                                            data-tooltip-id="error-tooltip" 
                                                            data-tooltip-content={errorMessage} 
                                                        >
                                                            {hasError ? 'Ver error' : 
                                                                <>
                                                                {
                                                                    cellText.length > 50 ?
                                                                    <div style={{textWrap: 'nowrap'}}>
                                                                        <span
                                                                            data-tooltip-id="info-tooltip" 
                                                                            data-tooltip-content={cellText} 
                                                                        >{shortText}</span>
                                                                    </div> :
                                                                    cellText
                                                                }
                                                                </>
                                                            }
                                                        </span>
                                                    </div>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))
                            :   <tr className='PowerMas_TableEmpty'>
                                    <td colSpan={20} className='Large-p1 center'>
                                        No se encontraron registros
                                    </td>
                                </tr>
                        }
                    </tbody>
                </table>
            </div>
            { showPagination && <Pagination table={table} isLargePagination={isLargePagination} />}
        </div>
    );
}

export default CustomTableUpload;
