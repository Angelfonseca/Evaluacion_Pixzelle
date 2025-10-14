<script>
  import { onMount } from 'svelte';
  import { fetchPhoneModels } from '$lib/api/mockApi.js';
  import Layout from '$lib/components/Layout.svelte';

  /**
   * @type {Array<Object>}
   */
  let models = [];

  /**
   * @type {boolean}
   */
  let loading = true;

  /**
   * @type {string}
   */
  let error = '';

  /**
   * Carga los modelos de teléfonos
   * @returns {Promise<void>}
   */
  async function loadModels() {
    try {
      loading = true;
      error = '';
      
      const modelsData = await fetchPhoneModels();
      models = modelsData.data || [];
    } catch (err) {
      error = err instanceof Error ? err.message : 'Error desconocido';
      console.error('Error loading models:', err);
    } finally {
      loading = false;
    }
  }

  onMount(loadModels);
</script>

<Layout title="Modelos de Teléfonos">
  <div class="space-y-6">
    <div class="text-center">
      <h1 class="text-3xl font-bold text-gray-900 mb-4">Modelos de Teléfonos</h1>
      <p class="text-gray-600 max-w-2xl mx-auto">
        Explora nuestra colección completa de modelos de teléfonos con las últimas tecnologías y especificaciones.
      </p>
    </div>

    {#if loading}
      <div class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    {:else if error}
      <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div class="text-red-600 font-medium mb-2">Error al cargar los modelos</div>
        <div class="text-red-500 text-sm">{error}</div>
        <button 
          class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          on:click={loadModels}
        >
          Reintentar
        </button>
      </div>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each models as model (model.id)}
          <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div class="aspect-w-16 aspect-h-9 bg-gray-100">
              <img 
                src={model.image_url} 
                alt={model.name}
                class="w-full h-48 object-cover"
                loading="lazy"
              />
            </div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-2">
                <h3 class="text-lg font-semibold text-gray-900">{model.name}</h3>
                <span class="text-sm text-gray-500">{model.brand_name}</span>
              </div>
              <p class="text-gray-600 text-sm mb-4 line-clamp-2">{model.description}</p>
              <div class="flex items-center justify-between">
                <span class="text-2xl font-bold text-blue-600">${model.price}</span>
                <span class="text-sm text-gray-500">
                  {new Date(model.release_date).toLocaleDateString('es-ES')}
                </span>
              </div>
              <div class="mt-4 flex flex-wrap gap-2">
                {#each model.features?.slice(0, 3) || [] as feature}
                  <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {feature}
                  </span>
                {/each}
              </div>
            </div>
          </div>
        {/each}
      </div>
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