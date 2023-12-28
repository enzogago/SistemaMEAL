const MenuItem = ({ menu, level, handleToggle, handleCheck, openMenus, checkedMenus }) => (
    <li key={menu.menCod} style={{ marginBottom: level === 1 ? '2rem' : '0'}} >
        <div >
            <label>
                <input 
                    type="checkbox" 
                    value={menu.menCod} 
                    checked={!!checkedMenus[menu.menCod]}
                    onChange={(event) => handleCheck(menu, event.target.checked)}
                />
                {menu.menNom}
            </label>
            {level === 1 && 
            <span 
                className={openMenus[menu.menCod] ? 'open' : 'closed'}
                onClick={level === 1 ? () => handleToggle(menu) : null}
            > 
                &gt; 
            </span>}
        </div>
        {menu.subMenus.length > 0 && (
            <ul className={openMenus[menu.menCod] || level !== 1 ? 'menu active' : 'menu'}>
                {menu.subMenus.map(subMenu => (
                    <MenuItem 
                        key={subMenu.menCod} 
                        menu={subMenu} 
                        level={level + 1} 
                        handleToggle={handleToggle} 
                        handleCheck={handleCheck} 
                        openMenus={openMenus} 
                        checkedMenus={checkedMenus} 
                    />
                ))}
            </ul>
        )}
    </li>
);

export default MenuItem