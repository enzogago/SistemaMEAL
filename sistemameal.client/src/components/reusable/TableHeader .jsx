// En un archivo separado, por ejemplo, 'TableHeader.js'
import { FaPlus, FaSearch, FaSortDown } from 'react-icons/fa';
import Excel_Icon from '../../img/PowerMas_Excel_Icon.svg';
import Pdf_Icon from '../../img/PowerMas_Pdf_Icon.svg';

const TableHeader = ({ title, searchFilter, setSearchFilter, actions, openModal, dropdownOpen, setDropdownOpen, Export_Excel, Export_PDF }) => {
    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    }

    return (
        <div className="">
            <h1 className="Large-f1_5">{title}</h1>
            <div className="flex ">
                <div className="PowerMas_Search_Container Large_6 Large-m_5">
                    <FaSearch className="Large_1 search-icon" />
                    <input 
                        className='PowerMas_Input_Filter Large_12 Large-p_5'
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
    );
}

export default TableHeader;
