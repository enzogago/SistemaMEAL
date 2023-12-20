import { FaPlus, FaSearch} from 'react-icons/fa';

const SearchBar = ({ openModal, filtering, setFiltering }) => {
    return (
        <div className="flex jc-space-between">
            <div className="">
                <button className='Large-p_5 PowerMas_ButtonStatus' onClick={() => openModal()}>
                    Nuevo <FaPlus /> 
                </button>
            </div>
            <div className="PowerMas_FilterStatus">
                <FaSearch /> 
                <input 
                    className="" 
                    type="text" 
                    value={filtering}
                    onChange={e => setFiltering(e.target.value)}
                    placeholder=""  
                />
            </div>
        </div>
    );
};
export default SearchBar;