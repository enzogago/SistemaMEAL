import Search from "../../../icons/Search";

const SearchInput = ({ value, onChange }) => {
    return (
        <div className="Phone_12 flex ai-center relative" style={{border: '1px solid var(--naranja-ayuda)', borderRadius: '5px'}}>
            <span className='flex f1_25' style={{ position: 'absolute', left: '0.5rem'}}>
                <Search />
            </span>
            <input 
                className='PowerMas_Input_Filter Large_12 Large-p_5'
                type="text"
                placeholder='Buscar'
                onChange={onChange}
                value={value}
                autoComplete="off"
            />
        </div>
    );
}

export default SearchInput;