<script>
  import { onMount } from 'svelte';
  import { fetchPhoneModels, fetchBrands } from '$lib/api/mockApi.js';
  import Button from '$lib/components/ui/Button.svelte';
  import Toast from '$lib/components/ui/Toast.svelte';
  import { toastStore, toast } from '$lib/stores/toast.js';

  /**
   * @type {Array<Object>}
   */
  let models = [];

  /**
   * @type {Array<Object>}
   */
  let brands = [];

  /**
   * @type {boolean}
   */
  let loading = true;

  /**
   * @type {string}
   */
  let error = '';

  /**
   * @type {Object}
   */
  let stats = {
    totalModels: 0,
    totalBrands: 0,
    averagePrice: 0,
    newestModel: null
  };

  /**
   * Carga los datos del dashboard
   * @returns {Promise<void>}
   */
  async function loadDashboardData() {
    try {
      loading = true;
      error = '';
      
      const [modelsResponse, brandsResponse] = await Promise.all([
        fetchPhoneModels(1, 100), // Obtener todos los modelos
        fetchBrands()
      ]);

      if (modelsResponse.success) {
        models = modelsResponse.data;
        stats.totalModels = models.length;
        
        // Calcular precio promedio
        const totalPrice = models.reduce((sum, model) => sum + model.price, 0);
        stats.averagePrice = totalPrice / models.length;
        
        // Encontrar el modelo más reciente
        stats.newestModel = models.reduce((newest, model) => {
          return new Date(model.release_date) > new Date(newest.release_date) ? model : newest;
        }, models[0]);
      }

      if (brandsResponse.success) {
        brands = brandsResponse.data;
        stats.totalBrands = brands.length;
      }
    } catch (err) {
      error = err instanceof Error ? err.message : 'Error desconocido';
      console.error('Error loading dashboard data:', err);
    } finally {
      loading = false;
    }
  }

  onMount(loadDashboardData);
</script>

<div class="space-y-8">
    <!-- Header -->
    <div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
      <h1 class="text-3xl font-bold mb-2">Panel de Administración</h1>
      <p class="text-blue-100">Gestiona modelos, marcas y configuraciones del sistema</p>
    </div>

    {#if loading}
      <div class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    {:else if error}
      <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div class="text-red-600 font-medium mb-2">Error al cargar los datos</div>
        <div class="text-red-500 text-sm">{error}</div>
        <div class="mt-4">
          <Button 
            variant="danger"
            on:click={loadDashboardData}
          >
            Reintentar
          </Button>
        </div>
      </div>
    {:else}
      <!-- Estadísticas -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white rounded-xl shadow-lg p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Modelos</p>
              <p class="text-3xl font-bold text-gray-900">{stats.totalModels}</p>
            </div>
            <div class="p-3 bg-blue-100 rounded-full">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-lg p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Marcas</p>
              <p class="text-3xl font-bold text-gray-900">{stats.totalBrands}</p>
            </div>
            <div class="p-3 bg-green-100 rounded-full">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-6m-2-5.5V9a2 2 0 012-2h2a2 2 0 012 2v7.5M5 21h6m0 0v-5.5a2 2 0 00-2-2H7a2 2 0 00-2 2V21"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-lg p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Precio Promedio</p>
              <p class="text-3xl font-bold text-gray-900">${stats.averagePrice.toFixed(0)}</p>
            </div>
            <div class="p-3 bg-yellow-100 rounded-full">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-lg p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Modelo Más Reciente</p>
              <p class="text-lg font-bold text-gray-900 truncate">{stats.newestModel?.name || 'N/A'}</p>
              <p class="text-sm text-gray-500">{stats.newestModel ? new Date(stats.newestModel.release_date).toLocaleDateString('es-ES') : ''}</p>
            </div>
            <div class="p-3 bg-purple-100 rounded-full">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Acciones Rápidas -->
      <div class="bg-white rounded-xl shadow-lg p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-6">Acciones Rápidas</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <a 
            href="/admin/models" 
            class="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow border-l-4 border-blue-500"
          >
            <div class="flex items-center">
              <div class="p-3 bg-blue-100 rounded-lg">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-semibold text-gray-900">Gestionar Modelos</h3>
                <p class="text-gray-600">Agregar, editar y eliminar modelos de teléfonos</p>
              </div>
            </div>
          </a>

          <a 
            href="/admin/brands" 
            class="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow border-l-4 border-green-500"
          >
            <div class="flex items-center">
              <div class="p-3 bg-green-100 rounded-lg">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-semibold text-gray-900">Gestionar Marcas</h3>
                <p class="text-gray-600">Agregar, editar y eliminar marcas de teléfonos</p>
              </div>
            </div>
          </a>
        </div>
      </div>

      <!-- Modelos Recientes -->
      <div class="bg-white rounded-xl shadow-lg p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-900">Modelos Recientes</h2>
          <a href="/admin/models" class="text-blue-600 hover:text-blue-700 font-medium">Ver todos</a>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modelo</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marca</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              {#each models.slice(0, 5) as model (model.id)}
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <img class="h-10 w-10 rounded-lg object-cover" src={model.image_url} alt={model.name} />
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">{model.name}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{model.brand_name}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${model.price}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(model.release_date).toLocaleDateString('es-ES')}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex space-x-2">
                      <Button variant="primary" size="sm">Editar</Button>
                      <Button variant="danger" size="sm">Eliminar</Button>
                    </div>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    {/if}
  </div>

<Toast />