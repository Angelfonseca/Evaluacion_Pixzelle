/**
 * Servicio de datos que maneja la lectura y escritura de archivos JSON
 * Permite operaciones CRUD sobre modelos y marcas
 */

import brandsData from '../data/brands.json';
import modelsData from '../data/models.json';

// Datos en memoria para simular persistencia
let brands = [...brandsData];
let models = [...modelsData];

/**
 * Simula delay de red
 * @param {number} ms - Milisegundos de delay
 */
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// ==================== OPERACIONES DE MARCAS ====================

/**
 * Obtiene todas las marcas
 * @returns {Promise<Object>} Respuesta con las marcas
 */
export async function fetchBrands() {
  await delay(600);
  
  // Calcular el número de modelos por marca
  const brandsWithCount = brands.map(brand => ({
    ...brand,
    phoneCount: models.filter(model => model.brand_id === brand.id).length
  }));
  
  return {
    success: true,
    data: brandsWithCount,
    message: "Marcas obtenidas exitosamente"
  };
}

/**
 * Obtiene una marca por ID
 * @param {number} id - ID de la marca
 * @returns {Promise<Object>} Respuesta con la marca
 */
export async function fetchBrand(id) {
  await delay(400);
  const brand = brands.find(b => b.id === parseInt(String(id)));
  
  if (!brand) {
    return {
      success: false,
      data: null,
      message: "Marca no encontrada"
    };
  }
  
  return {
    success: true,
    data: brand,
    message: "Marca obtenida exitosamente"
  };
}

/**
 * Crea una nueva marca
 * @param {Object} brandData - Datos de la nueva marca
 * @returns {Promise<Object>} Respuesta con la marca creada
 */
export async function createBrand(brandData) {
  await delay(800);
  
  const newId = Math.max(...brands.map(b => b.id), 0) + 1;
  const newBrand = {
    id: newId,
    phoneCount: 0,
    ...brandData
  };
  
  brands.push(newBrand);
  
  return {
    success: true,
    data: newBrand,
    message: "Marca creada exitosamente"
  };
}

/**
 * Actualiza una marca existente
 * @param {number} id - ID de la marca
 * @param {Object} brandData - Nuevos datos de la marca
 * @returns {Promise<Object>} Respuesta con la marca actualizada
 */
export async function updateBrand(id, brandData) {
  await delay(700);
  
  const index = brands.findIndex(b => b.id === parseInt(String(id)));
  
  if (index === -1) {
    return {
      success: false,
      data: null,
      message: "Marca no encontrada"
    };
  }
  
  brands[index] = { ...brands[index], ...brandData };
  
  return {
    success: true,
    data: brands[index],
    message: "Marca actualizada exitosamente"
  };
}

/**
 * Elimina una marca
 * @param {number} id - ID de la marca
 * @returns {Promise<Object>} Respuesta de eliminación
 */
export async function deleteBrand(id) {
  await delay(600);
  
  const index = brands.findIndex(b => b.id === parseInt(String(id)));
  
  if (index === -1) {
    return {
      success: false,
      data: null,
      message: "Marca no encontrada"
    };
  }
  
  // Verificar si hay modelos asociados
  const associatedModels = models.filter(m => m.brand_id === parseInt(String(id)));
  if (associatedModels.length > 0) {
    return {
      success: false,
      data: null,
      message: `No se puede eliminar la marca. Tiene ${associatedModels.length} modelos asociados.`
    };
  }
  
  brands.splice(index, 1);
  
  return {
    success: true,
    data: null,
    message: "Marca eliminada exitosamente"
  };
}

// ==================== OPERACIONES DE MODELOS ====================

/**
 * Obtiene modelos con paginación
 * @param {number} page - Número de página
 * @param {number} limit - Límite de resultados por página
 * @returns {Promise<Object>} Respuesta con los modelos paginados
 */
export async function fetchPhoneModels(page = 1, limit = 10) {
  await delay(800);
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedModels = models.slice(startIndex, endIndex);
  
  return {
    success: true,
    data: paginatedModels,
    pagination: {
      page,
      limit,
      total: models.length,
      totalPages: Math.ceil(models.length / limit)
    },
    message: "Modelos obtenidos exitosamente"
  };
}

/**
 * Obtiene un modelo por ID
 * @param {number} id - ID del modelo
 * @returns {Promise<Object>} Respuesta con el modelo
 */
export async function fetchPhoneModel(id) {
  await delay(500);
  
  const model = models.find(m => m.id === parseInt(String(id)));
  
  if (!model) {
    return {
      success: false,
      data: null,
      message: "Modelo no encontrado"
    };
  }
  
  return {
    success: true,
    data: model,
    message: "Modelo obtenido exitosamente"
  };
}

/**
 * Crea un nuevo modelo
 * @param {Object} modelData - Datos del nuevo modelo
 * @returns {Promise<Object>} Respuesta con el modelo creado
 */
export async function createPhoneModel(modelData) {
  await delay(900);
  
  const newId = Math.max(...models.map(m => m.id), 0) + 1;
  const newModel = {
    id: newId,
    ...modelData
  };
  
  models.push(newModel);
  
  // Actualizar contador de teléfonos en la marca
  const brand = brands.find(b => b.id === modelData.brand_id);
  if (brand) {
    brand.phoneCount = models.filter(m => m.brand_id === brand.id).length;
  }
  
  return {
    success: true,
    data: newModel,
    message: "Modelo creado exitosamente"
  };
}

/**
 * Actualiza un modelo existente
 * @param {number} id - ID del modelo
 * @param {Object} modelData - Nuevos datos del modelo
 * @returns {Promise<Object>} Respuesta con el modelo actualizado
 */
export async function updatePhoneModel(id, modelData) {
  await delay(800);
  
  const index = models.findIndex(m => m.id === parseInt(String(id)));
  
  if (index === -1) {
    return {
      success: false,
      data: null,
      message: "Modelo no encontrado"
    };
  }
  
  const oldBrandId = models[index].brand_id;
  models[index] = { ...models[index], ...modelData };
  
  // Actualizar contadores de teléfonos si cambió la marca
  if (modelData.brand_id && modelData.brand_id !== oldBrandId) {
    // Decrementar contador de la marca anterior
    const oldBrand = brands.find(b => b.id === oldBrandId);
    if (oldBrand) {
      oldBrand.phoneCount = models.filter(m => m.brand_id === oldBrand.id).length;
    }
    
    // Incrementar contador de la nueva marca
    const newBrand = brands.find(b => b.id === modelData.brand_id);
    if (newBrand) {
      newBrand.phoneCount = models.filter(m => m.brand_id === newBrand.id).length;
    }
  }
  
  return {
    success: true,
    data: models[index],
    message: "Modelo actualizado exitosamente"
  };
}

/**
 * Elimina un modelo
 * @param {number} id - ID del modelo
 * @returns {Promise<Object>} Respuesta de eliminación
 */
export async function deletePhoneModel(id) {
  await delay(600);
  
  const index = models.findIndex(m => m.id === parseInt(String(id)));
  
  if (index === -1) {
    return {
      success: false,
      data: null,
      message: "Modelo no encontrado"
    };
  }
  
  const brandId = models[index].brand_id;
  models.splice(index, 1);
  
  // Actualizar contador de teléfonos en la marca
  const brand = brands.find(b => b.id === brandId);
  if (brand) {
    brand.phoneCount = models.filter(m => m.brand_id === brand.id).length;
  }
  
  return {
    success: true,
    data: null,
    message: "Modelo eliminado exitosamente"
  };
}

// ==================== OPERACIONES DE BÚSQUEDA ====================

/**
 * Busca modelos por texto
 * @param {string} query - Texto de búsqueda
 * @returns {Promise<Object>} Respuesta con los modelos encontrados
 */
export async function searchPhones(query) {
  await delay(700);
  
  const filteredModels = models.filter(model => 
    model.name.toLowerCase().includes(query.toLowerCase()) ||
    model.brand_name.toLowerCase().includes(query.toLowerCase()) ||
    model.description.toLowerCase().includes(query.toLowerCase())
  );
  
  return {
    success: true,
    data: filteredModels,
    query,
    message: `Se encontraron ${filteredModels.length} resultados`
  };
}

/**
 * Obtiene modelos por marca
 * @param {number} brandId - ID de la marca
 * @returns {Promise<Object>} Respuesta con los modelos de la marca
 */
export async function fetchPhonesByBrand(brandId) {
  await delay(500);
  
  const brandModels = models.filter(model => model.brand_id === parseInt(String(brandId)));
  
  return {
    success: true,
    data: brandModels,
    brandId,
    message: `Se encontraron ${brandModels.length} modelos para la marca`
  };
}

// ==================== UTILIDADES ====================

/**
 * Obtiene estadísticas generales
 * @returns {Promise<Object>} Respuesta con estadísticas
 */
export async function getStats() {
  await delay(300);
  
  return {
    success: true,
    data: {
      totalBrands: brands.length,
      totalModels: models.length,
      averagePrice: models.length > 0 ? models.reduce((sum, model) => sum + (Number(model.price) || 0), 0) / models.length : 0,
      latestModel: models.sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime())[0]
    },
    message: "Estadísticas obtenidas exitosamente"
  };
}

/**
 * Resetea los datos a su estado inicial
 * @returns {Promise<Object>} Respuesta de reset
 */
export async function resetData() {
  await delay(1000);
  
  brands = [...brandsData];
  models = [...modelsData];
  
  return {
    success: true,
    data: null,
    message: "Datos reseteados exitosamente"
  };
}

// Exportar datos para uso directo si es necesario
export { brands, models };