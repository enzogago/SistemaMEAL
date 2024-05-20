import Search from '../../../icons/Search';

const SearchTagsInput = ({searchTags, inputValue, handleInputChange, handleKeyDown, removeTag}) => {
    return (
        <div className="flex-grow-1 overflow-auto">
            <div className="flex overflow-auto" style={{border: '1px solid var(--naranja-ayuda)', borderRadius: '5px'}}>
                <div className="flex ai-center">
                    {searchTags.map(tag => (
                        <span key={tag} className="PowerMas_InputTag flex">
                            <span className="f_75 flex ai-center">{tag}</span>
                            <button className="f_75" onClick={() => removeTag(tag)}>x</button>
                        </span>
                    ))}
                </div>
                <div className="Phone_12 flex ai-center relative">
                    <span className='flex f1_25' style={{ position: 'absolute', left: '0.5rem'}}>
                        <Search />
                    </span>
                    <input 
                        className='PowerMas_Input_Filter Phone_12 Large-p_5'
                        type="search"
                        placeholder='Buscar'
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        value={inputValue}
                        maxLength={50}
                    />
                </div>
            </div>
        </div>
    );
};

export default SearchTagsInput;
