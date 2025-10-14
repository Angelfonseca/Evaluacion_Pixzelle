import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Store para el estado de autenticación
export const isAuthenticated = writable(false);
export const user = writable(null);

// Credenciales de administrador (en un proyecto real, esto estaría en el backend)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

/**
 * Función para iniciar sesión
 * @param {string} username 
 * @param {string} password 
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function login(username, password) {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    const userData = {
      id: 1,
      username: 'admin',
      role: 'administrator',
      name: 'Administrador'
    };
    
    // Actualizar stores
    isAuthenticated.set(true);
    user.set(userData);
    
    // Guardar en localStorage si estamos en el navegador
    if (browser) {
      localStorage.setItem('auth_token', 'admin_token_123');
      localStorage.setItem('user_data', JSON.stringify(userData));
    }
    
    return { success: true, message: 'Inicio de sesión exitoso' };
  } else {
    return { success: false, message: 'Credenciales incorrectas' };
  }
}

/**
 * Función para cerrar sesión
 */
export function logout() {
  isAuthenticated.set(false);
  user.set(null);
  
  if (browser) {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  }
}

/**
 * Función para verificar si hay una sesión activa
 */
export function checkAuthStatus() {
  if (browser) {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        isAuthenticated.set(true);
        user.set(parsedUser);
        return true;
      } catch (error) {
        console.error('Error parsing user data:', error);
        logout();
        return false;
      }
    }
  }
  return false;
}