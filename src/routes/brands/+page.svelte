<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { fetchBrands } from '$lib/api/mockApi.js';
  import Layout from '$lib/components/Layout.svelte';

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
   * Carga las marcas de teléfonos
   * @returns {Promise<void>}
   */
  async function loadBrands() {
    try {
      loading = true;
      error = '';
      
      const brandsData = await fetchBrands();
      brands = brandsData.data || [];
    } catch (err) {
      error = err instanceof Error ? err.message : 'Error desconocido';
      console.error('Error loading brands:', err);
    } finally {
      loading = false;
    }
  }

  /**
   * Navega a la página principal con filtro de marca
   * @param {Object} brand
   */
  function viewBrandModels(brand) {
    goto(`/?brand=${brand.id}`);
  }

  onMount(loadBrands);
</script>

<Layout title="Marcas de Teléfonos">
  <div class="space-y-6">
    <div class="text-center">
      <h1 class="text-3xl font-bold text-gray-900 mb-4">Marcas de Teléfonos</h1>
      <p class="text-gray-600 max-w-2xl mx-auto">
        Descubre las principales marcas de teléfonos móviles y sus características distintivas.
      </p>
    </div>

    {#if loading}
      <div class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    {:else if error}
      <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div class="text-red-600 font-medium mb-2">Error al cargar las marcas</div>
        <div class="text-red-500 text-sm">{error}</div>
        <button 
          class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          on:click={loadBrands}
        >
          Reintentar
        </button>
      </div>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {#each brands as brand (brand.id)}
          <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div class="aspect-w-16 aspect-h-9 bg-gray-100">
              <img 
                src={brand.logo_url} 
                alt={brand.name}
                class="w-full h-32 object-contain p-4"
                loading="lazy"
              />
            </div>
            <div class="p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">{brand.name}</h3>
              <p class="text-gray-600 text-sm mb-4 line-clamp-3">{brand.description}</p>
              
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-500">País:</span>
                  <span class="font-medium">{brand.country}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Fundada:</span>
                  <span class="font-medium">{brand.founded_year}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Modelos:</span>
                  <span class="font-medium">{brand.model_count || 0}</span>
                </div>
              </div>

              {#if brand.specialties && brand.specialties.length > 0}
                <div class="mt-4">
                  <div class="text-xs text-gray-500 mb-2">Especialidades:</div>
                  <div class="flex flex-wrap gap-1">
                    {#each brand.specialties.slice(0, 3) as specialty}
                      <span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        {specialty}
                      </span>
                    {/each}
                  </div>
                </div>
              {/if}

              <div class="mt-4 pt-4 border-t border-gray-100">
                <button 
                  class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  on:click={() => viewBrandModels(brand)}
                >
                  Ver Modelos
                </button>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</Layout>

<style>
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>