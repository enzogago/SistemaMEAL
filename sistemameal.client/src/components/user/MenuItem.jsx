import { useState } from 'react';
import Modal from 'react-modal';

const MenuItem = ({ menu, level, handleToggle, handleCheck, openMenus, checkedMenus, handlePermissionCheck, checkedPermissions }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const openModal = () => {
        setModalIsOpen(true);
        console.log(menu);
    }

    const closeModal = () => {
        setModalIsOpen(false);
    }

    return (
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
                {level === 1 && (menu.subMenus.length > 0) &&
                <span 
                    className={openMenus[menu.menCod] ? 'open' : 'closed'}
                    onClick={level === 1 ? () => handleToggle(menu) : null}
                > 
                    &gt; 
                </span>}
            </div>
            {
            menu.permissions.length > 0 &&
            <>
                <button onClick={openModal}>Ver permisos de {menu.menNom}</button>
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    contentLabel="Permisos del menú"
                    ariaHideApp={false}
                    style={{
                        content: {
                            top: '50%',
                            left: '50%',
                            right: 'auto',
                            bottom: 'auto',
                            marginRight: '-50%',
                            transform: 'translate(-50%, -50%)',
                            backgroundColor: '#f0f0f0',
                            width: 'auto',
                            border: '1px solid #ccc',
                            padding: '20px'
                        },
                        overlay: {
                            backgroundColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }}
                >
                    <h2>Permisos del menú {menu.menNom}</h2>
                    {menu.permissions.map(permission => (
                        <div key={permission.perCod}>
                            <label>
                                <input 
                                    type="checkbox" 
                                    value={permission.perCod} 
                                    onChange={(event) => handlePermissionCheck(permission, event.target.checked)}
                                    checked={checkedPermissions[permission.perCod]}
                                />
                                {permission.perNom}
                            </label>
                        </div>
                    ))}
                    <button onClick={closeModal}>Aceptar</button>
                </Modal>
            </>
            }
            {menu.subMenus.length > 0 && (
                <ul className={openMenus[menu.menCod] || level !== 1 ? 'menu active' : 'menu'}>
                    {menu.subMenus.map(subMenu => (
                        <MenuItem 
                            key={subMenu.menCod} 
                            menu={subMenu} 
                            level={level + 1} 
                            handleToggle={handleToggle} 
                            handleCheck={handleCheck} 
                            handlePermissionCheck={handlePermissionCheck}
                            openMenus={openMenus} 
                            checkedMenus={checkedMenus} 
                            checkedPermissions={checkedPermissions}
                        />
                    ))}
                </ul>
            )}
        </li>
    )
};

export default MenuItem