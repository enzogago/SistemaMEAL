// useEntityActions.js
import { useContext, useMemo } from 'react';
import { AuthContext } from '../context/AuthContext';

const useEntityActions = (entityName) => {
    const { authInfo } = useContext(AuthContext);
    const { userPermissions } = authInfo;

    const actions = useMemo(() => ({
        add: userPermissions.some(permission => permission.perNom === `INSERTAR ${entityName}`),
        delete: userPermissions.some(permission => permission.perNom === `ELIMINAR ${entityName}`),
        edit: userPermissions.some(permission => permission.perNom === `MODIFICAR ${entityName}`),
        pdf: userPermissions.some(permission => permission.perNom === `EXPORTAR PDF ${entityName}`),
        excel: userPermissions.some(permission => permission.perNom === `EXPORTAR EXCEL ${entityName}`),
    }), [userPermissions, entityName]);

    return actions;
};

export default useEntityActions;
