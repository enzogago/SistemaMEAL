import Search from "../../../icons/Search";

const SearchInput = ({ value, onChange }) => {
    return (
        <div className="Phone_12 flex ai-center relative" style={{position: 'relative', borderRadius: '5px'}}>
            <span className='flex f1_25' style={{ position: 'absolute', left: '0.5rem'}}>
                <Search />
            </span>
            <input 
                style={{paddingLeft: '2rem'}}
                className='Large_12 Large-p_5'
                type="search"
                placeholder='Buscar'
                onChange={onChange}
                value={value}
                autoComplete="off"
            />
        </div>
    );
}

export default SearchInput;