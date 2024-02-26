import Notiflix from 'notiflix';
import { useState } from 'react';
import Modal from 'react-modal';

const MenuItem = ({ menu, level, handleToggle, handleCheck, openMenus, checkedMenus, handlePermissionCheck, checkedPermissions }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const openModal = () => {
        setModalIsOpen(true);
    }
    const closeModal = () => {
        Notiflix.Notify.success("Se actualizaron los permisos");
        setModalIsOpen(false);
    }

    return (
        <li className='' style={{ marginBottom: level === 1 ? '1rem' : '0', fontSize: level === 1 ? '1rem': '0.75rem', color: level === 1 ? '#F7775A' : '#000'}} >
            <div className='p_25 PowerMas_Menu_Dropdown flex ai-center jc-space-between gap_5'>
                <div className=''>
                    <input
                        id={menu.menAno+menu.menCod}
                        type="checkbox" 
                        value={menu.menCod} 
                        checked={!!checkedMenus[menu.menCod]}
                        onChange={(event) => handleCheck(menu, event.target.checked)}
                        className='m_5'
                    />
                    <label htmlFor={menu.menAno+menu.menCod} className=''>
                        {menu.menNom}
                    </label>
                </div>
                {
                menu.permissions.length > 0 &&
                (
                    <button className='PowerMas_Button_Permissions f_75' onClick={openModal}>Permisos</button>
                )
                }
                {level === 1 && (menu.subMenus.length > 0) &&
                <span 
                    className={`m_25 p_25 bold ${openMenus[menu.menCod] ? 'open-user' : 'closed'}`}
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
                            handlePermissionCheck={handlePermissionCheck}
                            openMenus={openMenus} 
                            checkedMenus={checkedMenus} 
                            checkedPermissions={checkedPermissions}
                        />
                    ))}
                </ul>
            )}
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    contentLabel="Permisos del menú"
                    ariaHideApp={false}
                    closeTimeoutMS={200}
                    style={{
                        content: {
                            top: '50%',
                            left: '50%',
                            right: 'auto',
                            bottom: 'auto',
                            width: '25%',
                            marginRight: '-50%',
                            transform: 'translate(-50%, -50%)',
                            backgroundColor: '#fff',
                            border: '1px solid #ccc',
                            padding: '20px'
                        },
                        overlay: {
                            backgroundColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }}
                >
                    <div className='flex flex-column Large_12'>
                        <div className='overflow-auto'>
                            <span 
                                className="PowerMas_CloseModal" 
                                onClick={closeModal}
                            >
                                ×
                            </span>
                            <br />
                            <h2 className='PowerMas_Title_Modal_Permission center f1_25'>Permisos del menú</h2>
                            <h2 className='PowerMas_Title_Modal_Permission center f1_25'>{menu.menNom}</h2>
                        </div>
                        <hr className='PowerMas_Hr m_5' />
                        <p className='PowerMas_Description_Modal_Permission center f_75'>Selecciona las funcionalidades(acciones) que deseas otorgar para este usuario.</p>
                        <br />
                        <div className='flex flex-column ai-center'>
                            {menu.permissions.map((permission, index) => (
                                <div className='flex p_5 gap_5' key={index}>
                                    <input
                                        id={permission.perCod}
                                        type="checkbox"
                                        className='m0'
                                        value={permission.perCod} 
                                        onChange={(event) => handlePermissionCheck(permission, event.target.checked)}
                                        checked={checkedPermissions[permission.perCod]}
                                    />
                                    <label style={{textTransform: 'capitalize', textWrap: 'nowrap'}} htmlFor={permission.perCod}>
                                        {permission.perNom.toLowerCase()}
                                    </label>
                                </div>
                            ))}

                        </div>
                        <br />
                        <div className='flex jc-center'>
                            <button className='PowerMas_Buttom_Primary Large_6' onClick={closeModal}>Guardar</button>
                        </div>
                    </div>
                </Modal>
        </li>
    )
};

export default MenuItem