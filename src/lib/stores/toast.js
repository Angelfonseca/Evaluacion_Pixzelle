import { writable } from 'svelte/store';

// Store para manejar las notificaciones toast
export const toastStore = writable({
  show: false,
  type: 'info',
  message: '',
  duration: 5000
});

// Funciones helper para mostrar diferentes tipos de toast
export const toast = {
  success: (message, duration = 5000) => {
    toastStore.set({
      show: true,
      type: 'success',
      message,
      duration
    });
  },
  
  error: (message, duration = 5000) => {
    toastStore.set({
      show: true,
      type: 'error',
      message,
      duration
    });
  },
  
  warning: (message, duration = 5000) => {
    toastStore.set({
      show: true,
      type: 'warning',
      message,
      duration
    });
  },
  
  info: (message, duration = 5000) => {
    toastStore.set({
      show: true,
      type: 'info',
      message,
      duration
    });
  },
  
  dismiss: () => {
    toastStore.update(state => ({
      ...state,
      show: false
    }));
  }
};