import React, { useState } from 'react';
import Excel_Icon from '../../../img/PowerMas_Excel_Icon.svg';
import Pdf_Icon from '../../../img/PowerMas_Pdf_Icon.svg';
import { exportToExcel, exportToPdf } from '../../reusable/export';
import Expand from '../../../icons/Expand';

const ExportMenu = ({ filteredData, headers, title, properties, format, actions }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    }

    if (!actions.pdf && !actions.excel) {
       return; 
    }

    return (
        <div className={`PowerMas_Dropdown_Export Large_3 ${dropdownOpen ? 'open' : ''}`}>
            <button className="Large_12 Large-p_5 flex ai-center jc-space-between" onClick={toggleDropdown}>
                Exportar <Expand />
            </button>
            <div className="PowerMas_Dropdown_Export_Content Phone_12">
                {actions.pdf &&
                    <a onClick={() => {
                        exportToPdf(filteredData, headers, title, properties, format);
                        toggleDropdown();
                    }} className='flex jc-space-between p_5'>
                        PDF <img className='Large_1' src={Pdf_Icon} alt="Export to PDF" />
                    </a>
                }
                {actions.excel &&
                    <a onClick={() => {
                        exportToExcel(filteredData, headers, title, properties);
                        toggleDropdown();
                    }} className='flex jc-space-between p_5'>
                        Excel <img className='Large_1' src={Excel_Icon} alt="Export to Excel" />
                    </a>
                }
            </div>
        </div>
    );
};

export default ExportMenu;
