<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { fetchPhoneModels, fetchBrands, fetchPhonesByBrand } from '$lib/api/mockApi.js';
  import Layout from '$lib/components/Layout.svelte';
  import ModelDetails from '$lib/components/ModelDetails.svelte';
  import BrandList from '$lib/components/BrandList.svelte';

  /**
   * @type {Array<Object>}
   */
  let models = [];

  /**
   * @type {Array<Object>}
   */
  let brands = [];

  /**
   * @type {Object | null}
   */
  let selectedModel = null;

  /**
   * @type {boolean}
   */
  let loading = true;

  /**
   * @type {string}
   */
  let error = '';

  /**
   * @type {Object | null}
   */
  let selectedBrand = null;

  /**
   * Carga los datos iniciales
   * @returns {Promise<void>}
   */
  async function loadData() {
    try {
      loading = true;
      error = '';
      
      const [modelsData, brandsData] = await Promise.all([
        fetchPhoneModels(),
        fetchBrands()
      ]);
      
      models = modelsData.data || [];
      brands = brandsData.data || [];
      
    } catch (err) {
      error = err instanceof Error ? err.message : 'Error desconocido';
      console.error('Error loading data:', err);
    } finally {
      loading = false;
    }
  }

  /**
   * Maneja la selección de una marca
   * @param {Object} brand
   * @returns {Promise<void>}
   */
  async function handleBrandSelect(brand) {
    try {
      loading = true;
      selectedBrand = brand;
      const phonesByBrand = await fetchPhonesByBrand(brand.id);
      models = phonesByBrand.data || [];
      selectedModel = null; // Limpiar selección de modelo
    } catch (err) {
      error = err instanceof Error ? err.message : 'Error al cargar modelos de la marca';
      console.error('Error loading brand models:', err);
    } finally {
      loading = false;
    }
  }

  /**
   * Maneja la selección de un modelo específico
   * @param {Object} model
   */
  function handleModelSelect(model) {
    selectedModel = model;
  }

  /**
   * Resetea los filtros y muestra todos los modelos
   */
  async function showAllModels() {
    selectedBrand = null;
    await loadData();
  }

  onMount(async () => {
    await loadData();
    
    // Verificar si hay un parámetro de marca en la URL
    const brandId = $page.url.searchParams.get('brand');
    if (brandId) {
      const brand = brands.find(b => b.id === parseInt(brandId));
      if (brand) {
        await handleBrandSelect(brand);
      }
    }
  });
</script>

<svelte:head>
  <title>Phone CMS - Gestión de Teléfonos</title>
  <meta name="description" content="Sistema de gestión de contenido para teléfonos móviles" />
</svelte:head>

<Layout>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
    {#if loading}
      <div class="flex items-center justify-center min-h-96">
        <div class="text-center">
          <div class="animate-spin w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"></div>
          <p class="text-gray-600">Cargando modelos...</p>
        </div>
      </div>
    {:else if error}
      <div class="max-w-md mx-auto pt-20">
        <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-red-900 mb-2">Error al cargar</h3>
          <p class="text-red-700 text-sm">{error}</p>
          <button 
            class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            on:click={loadData}
          >
            Reintentar
          </button>
        </div>
      </div>
    {:else}
      <!-- Hero Section -->
      <div class="relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10"></div>
        <div class="relative max-w-7xl mx-auto px-4 py-20 sm:py-24">
          <div class="text-center">
            <h1 class="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Descubre el <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Futuro</span>
            </h1>
            <p class="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              Explora los últimos modelos de smartphones con especificaciones detalladas, 
              comparativas y toda la información que necesitas para tomar la mejor decisión.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/models" class="inline-flex items-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                </svg>
                Ver Catálogo
              </a>
              <a href="/brands" class="inline-flex items-center px-8 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium border border-gray-300">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
                Ver Marcas
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Section -->
      <div class="max-w-7xl mx-auto px-4 py-16">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
              </svg>
            </div>
            <div class="text-3xl font-bold text-gray-900 mb-2">{models.length}+</div>
            <div class="text-gray-600 font-medium">Modelos Disponibles</div>
          </div>
          <div class="text-center bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
            </div>
            <div class="text-3xl font-bold text-gray-900 mb-2">{brands.length}+</div>
            <div class="text-gray-600 font-medium">Marcas Principales</div>
          </div>
          <div class="text-center bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="text-3xl font-bold text-gray-900 mb-2">24/7</div>
            <div class="text-gray-600 font-medium">Información Actualizada</div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="max-w-7xl mx-auto px-4 pb-16">
        <!-- Filter Section -->
        <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div class="flex-1 min-w-0">
              <h2 class="text-xl font-bold text-gray-900 truncate">
                {selectedBrand ? `Modelos de ${selectedBrand.name}` : 'Todos los Modelos'}
              </h2>
              <p class="text-gray-600 text-sm sm:text-base break-words">
                {selectedBrand ? `${models.length} modelos disponibles` : `Explora ${models.length} modelos de ${brands.length} marcas`}
              </p>
            </div>
            {#if selectedBrand}
              <button
                class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex-shrink-0"
                on:click={showAllModels}
              >
                Ver Todos
              </button>
            {/if}
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <!-- Sidebar -->
          <div class="lg:col-span-1 space-y-6">
            <!-- Brand Filter -->
            <div class="bg-white rounded-xl shadow-lg p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Filtrar por Marca</h3>
              <BrandList {brands} onBrandSelect={handleBrandSelect} />
            </div>

            <!-- Quick Stats -->
            <div class="bg-white rounded-xl shadow-lg p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Estadísticas</h3>
              <div class="space-y-3">
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">Modelos mostrados:</span>
                  <span class="font-semibold text-gray-900">{models.length}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">Marcas totales:</span>
                  <span class="font-semibold text-gray-900">{brands.length}</span>
                </div>
                {#if selectedBrand}
                  <div class="pt-2 border-t border-gray-200">
                    <div class="flex justify-between items-center">
                      <span class="text-gray-600">Marca seleccionada:</span>
                      <span class="font-semibold text-blue-600">{selectedBrand.name}</span>
                    </div>
                  </div>
                {/if}
              </div>
            </div>
          </div>

          <!-- Models Grid -->
          <div class="lg:col-span-3">
            {#if models.length === 0}
              <div class="bg-white rounded-xl shadow-lg p-12 text-center">
                <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">No hay modelos disponibles</h3>
                <p class="text-gray-600">
                  {selectedBrand ? `No se encontraron modelos para ${selectedBrand.name}` : 'No hay modelos para mostrar'}
                </p>
              </div>
            {:else}
              <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {#each models as model}
                  <div 
                    class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden"
                    role="button"
                    tabindex="0"
                    on:click={() => handleModelSelect(model)}
                    on:keydown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleModelSelect(model);
                      }
                    }}
                  >
                    <!-- Image -->
                    <div class="aspect-w-16 aspect-h-10 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                      {#if model.image_url}
                        <img 
                           src={model.image_url} 
                           alt={model.name}
                           class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                           loading="lazy"
                           on:error={(e) => {
                             // Si la imagen falla al cargar, mostrar el placeholder
                             const target = e.target;
                             if (target instanceof HTMLImageElement) {
                               target.style.display = 'none';
                               const placeholder = target.nextElementSibling;
                               if (placeholder instanceof HTMLElement) {
                                 placeholder.style.display = 'flex';
                               }
                             }
                           }}
                         />
                        <!-- Fallback placeholder (oculto por defecto) -->
                        <div class="absolute inset-0 flex items-center justify-center" style="display: none;">
                          <svg class="w-16 h-16 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                          </svg>
                        </div>
                      {:else}
                        <!-- Placeholder cuando no hay imagen -->
                        <div class="absolute inset-0 flex items-center justify-center">
                          <svg class="w-16 h-16 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                          </svg>
                        </div>
                      {/if}
                      <div class="absolute top-4 right-4">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Nuevo
                        </span>
                      </div>
                      <div class="absolute bottom-4 left-4">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/90 text-gray-700">
                          {model.brand_name}
                        </span>
                      </div>
                    </div>

                    <!-- Content -->
                    <div class="p-6">
                      <h3 class="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                        {model.name}
                      </h3>
                      <p class="text-gray-500 text-sm mb-3">{model.company}</p>
                      <p class="text-gray-600 text-sm line-clamp-2 mb-4">
                        {model.description}
                      </p>
                      
                      <!-- Specs preview -->
                      <div class="space-y-2 mb-4">
                        <div class="flex justify-between text-sm">
                          <span class="text-gray-500">Pantalla:</span>
                          <span class="text-gray-700 font-medium">{model.specifications?.display || 'N/A'}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                          <span class="text-gray-500">Precio:</span>
                          <span class="text-green-600 font-bold">${model.price}</span>
                        </div>
                      </div>

                      <div class="flex items-center justify-between">
                        <span class="text-xs text-gray-500">
                          {new Date(model.release_date).toLocaleDateString('es-ES')}
                        </span>
                        <svg class="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                {/each}
              </div>
            {/if}
          </div>
        </div>
      </div>
    {/if}

    <!-- Model Details Modal -->
    {#if selectedModel}
      <ModelDetails model={selectedModel} onClose={() => selectedModel = null} />
    {/if}
  </div>
</Layout>

<style>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
