/**
 * Mock API para simular respuestas del backend
 * Ahora utiliza el servicio de datos basado en JSON para permitir operaciones CRUD
 */

// Importar todas las funciones del servicio de datos
export {
  fetchPhoneModels,
  fetchPhoneModel,
  fetchBrands,
  fetchBrand,
  searchPhones,
  fetchPhonesByBrand,
  createBrand,
  updateBrand,
  deleteBrand,
  createPhoneModel,
  updatePhoneModel,
  deletePhoneModel,
  getStats,
  resetData
} from './dataService.js';