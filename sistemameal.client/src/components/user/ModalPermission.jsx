import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { fetchDataReturn } from '../reusable/fetchs';
import Notiflix from 'notiflix';

const ModalPermission = ({modalVisible, estadoEditado, closeModal, user}) => {
    const [ permisos, setPermisos ] = useState([])
    const [ permisosActuales, setPermisosActuales ] = useState(new Set());
    const [ permisosIniciales, setPermisosIniciales ] = useState(new Set());
    const [selectAll, setSelectAll] = useState(false);

    const handleSelectAllChange = (event) => {
        setSelectAll(event.target.checked);
        if (event.target.checked) {
            // Si el usuario ha seleccionado "Seleccionar todos", selecciona todos los permisos
            setPermisosActuales(new Set(permisos.map(permiso => permiso.perCod)));
        } else {
            // Si el usuario ha deseleccionado "Seleccionar todos", deselecciona todos los permisos
            setPermisosActuales(new Set());
        }
    };
    
    
    useEffect(() => {
        if (modalVisible && estadoEditado) {
            // Inicia el bloqueo de Notiflix
            Notiflix.Loading.pulse();

            Promise.all([
                fetchDataReturn(`Permiso/${estadoEditado.menRef}`),
                fetchDataReturn(`Permiso/${user.usuAno}/${user.usuCod}`),
            ]).then(([menuData, permissionAccessData]) => {
                setPermisos(menuData)
                const permisosInicialesSet = new Set(permissionAccessData.map(permiso => permiso.perCod));
                setPermisosIniciales(permisosInicialesSet);
                setPermisosActuales(permisosInicialesSet);

                // Establece el estado inicial de "Seleccionar todos"
                setSelectAll(permisosInicialesSet.size === menuData.length);
            }).catch(error => {
                // Maneja los errores
                console.error('Error:', error);
                Notiflix.Notify.failure('Ha ocurrido un error al cargar los datos.');
            }).finally(() => {
                // Quita el bloqueo de Notiflix una vez que todas las peticiones han terminado
                Notiflix.Loading.remove();
            });

        }
    }, [modalVisible, estadoEditado])

    const handleCheckboxChange = (perCod) => {
        setPermisosActuales(current => {
            const newPermisos = new Set(current);
            if (newPermisos.has(perCod)) {
                newPermisos.delete(perCod);
            } else {
                newPermisos.add(perCod);
            }
    
            // Actualiza el estado de 'selectAll'
            setSelectAll(newPermisos.size === permisos.length);
    
            return newPermisos;
        });
    };

    const closeModalAndReset = () => {
        closeModal();
        setPermisos([]);
        setSelectAll(false);
    }

    const handleSubmit = async() => {
        const permisosInsertar = [...permisosActuales].filter(perCod => !permisosIniciales.has(perCod));
        const permisosAEliminar = [...permisosIniciales].filter(perCod => !permisosActuales.has(perCod));
        
        const PermisoUsuarioDto = {
            PermisoUsuarioInsertar: permisosInsertar.map(perCod => ({ perCod })),
            PermisoUsuarioEliminar: permisosAEliminar.map(perCod => ({ perCod })),
            Usuario: user
        };

        try {
            Notiflix.Loading.pulse();
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/Permiso/usuario`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(PermisoUsuarioDto),
            });
            const data = await response.json();
            if (!response.ok) {
                Notiflix.Notify.failure(data.message)
                return;
            }
            Notiflix.Notify.success(data.message)
        } catch (error) {
            console.error('Error:', error);
        } finally {
            Notiflix.Loading.remove();
        }

        closeModalAndReset();
    };

    return (
        <Modal
            isOpen={modalVisible}
            onRequestClose={closeModalAndReset}
            contentLabel="Permisos del menú"
            ariaHideApp={false}
            closeTimeoutMS={200}
            style={{
                content: {
                    background: 'white',
                    borderRadius: '5px',
                    color: 'rgb(51, 51, 51)',
                    display: 'inline',
                    maxHeight: '100vh',
                    width: '30%',
                    outline: 'none',
                    padding: '20px',
                    position: 'none'
                },
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    top: 0,
                    position: 'fixed',
                }
            }}
        >
            <div className='flex flex-column permission-block'>
                <div className='overflow-auto relative'>
                    <span 
                        className="PowerMas_CloseModal" 
                        onClick={closeModalAndReset}
                    >
                        ×
                    </span>
                    <h2 className='PowerMas_Title_Modal_Permission center f1_25'>Permisos del menú</h2>
                    <h2 className='PowerMas_Title_Modal_Permission center f1_25'>{estadoEditado && estadoEditado.menNom}</h2>
                </div>
                <hr className='PowerMas_Hr m_5' />
                {  
                    permisos.length ?
                    <div className='flex flex-column ai-center gap_5'>
                        <p className='PowerMas_Description_Modal_Permission center f_75'>
                            Selecciona las funcionalidades(acciones) que deseas otorgar para este usuario.
                        </p>
                        <div className='flex p_25 gap_25'>
                            <input
                                id='all'
                                type="checkbox"
                                checked={selectAll}
                                onChange={handleSelectAllChange}
                            />
                            <label htmlFor='all'>Seleccionar todos</label>
                        </div>
                        <div className='flex flex-column'>
                            {estadoEditado && permisos.map((permission, index) => (
                                <div className='flex p_25 gap_5' key={index}>
                                    <input
                                        id={permission.perCod}
                                        type="checkbox"
                                        className='m0'
                                        value={permission.perCod} 
                                        checked={permisosActuales.has(permission.perCod)}
                                        onChange={() => handleCheckboxChange(permission.perCod)}
                                    />
                                    <label style={{textTransform: 'capitalize', textWrap: 'nowrap'}} htmlFor={permission.perCod}>
                                        {permission.perNom.toLowerCase()}
                                    </label>
                                </div>
                            ))}
                        </div>
                        <button className='PowerMas_Buttom_Primary Large_6' onClick={handleSubmit}>Guardar</button>
                    </div>
                    :
                    <p className='PowerMas_Description_Modal_Permission center f_75'>
                        No se encontraron Acciones para este menú.
                    </p>
                }
            </div>
        </Modal>
    )
}

export default ModalPermission