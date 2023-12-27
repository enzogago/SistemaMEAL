import { jwtDecode } from 'jwt-decode'; // Librarie

// Verificar si el token ha expirado
export function isTokenExpired(token) {
    try {
        const decodedToken = jwtDecode(token);
        const currentDate = new Date();
        if (decodedToken.exp < currentDate.getTime() / 1000) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.error(err);
        return false;
    }
}
