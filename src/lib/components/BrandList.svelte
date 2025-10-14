<script>
  import { createEventDispatcher } from 'svelte';

  /**
   * @type {Array<Object>}
   */
  export let brands = [];

  /**
   * @type {function}
   */
  export let onBrandSelect = () => {};

  const dispatch = createEventDispatcher();

  /**
   * @type {number | null}
   */
  let selectedBrandId = null;

  /**
   * Maneja la selección de una marca
   * @param {Object} brand
   */
  function handleBrandClick(brand) {
    selectedBrandId = brand.id;
    onBrandSelect(brand);
    dispatch('brandSelect', { brand });
  }
</script>

<div class="brand-list">
  {#if brands.length === 0}
    <div class="text-center py-8">
      <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
        </svg>
      </div>
      <p class="text-gray-500 text-sm">No hay marcas disponibles</p>
    </div>
  {:else}
    <div class="space-y-2">
      {#each brands as brand}
        <button
          class="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          class:selected={selectedBrandId === brand.id}
          on:click={() => handleBrandClick(brand)}
        >
          <div class="flex items-start justify-between">
            <div class="flex items-start space-x-3 flex-1 min-w-0">
              <!-- Logo placeholder -->
              <div class="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center group-hover:from-blue-100 group-hover:to-blue-200 transition-all duration-200 flex-shrink-0">
                <span class="text-lg font-bold text-gray-600 group-hover:text-blue-600">
                  {brand.name.charAt(0).toUpperCase()}
                </span>
              </div>
              
              <div class="flex-1 min-w-0 overflow-hidden">
                <h3 class="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 truncate">
                  {brand.name}
                </h3>
                {#if brand.description}
                  <p class="text-sm text-gray-500 mt-1 line-clamp-2 break-words">
                    {brand.description}
                  </p>
                {/if}
                {#if brand.phoneCount !== undefined}
                  <p class="text-xs text-gray-400 mt-1">
                    {brand.phoneCount} {brand.phoneCount === 1 ? 'modelo' : 'modelos'}
                  </p>
                {/if}
              </div>
            </div>
            
            <!-- Indicador de selección -->
            <div class="flex items-center space-x-2 flex-shrink-0 ml-2">
              {#if selectedBrandId === brand.id}
                <div class="w-2 h-2 bg-blue-600 rounded-full"></div>
              {/if}
              <svg class="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </div>
          </div>
        </button>
      {/each}
    </div>

    <!-- Estadísticas -->
    <div class="mt-6 p-4 bg-gray-50 rounded-lg">
      <div class="flex items-center justify-between text-sm">
        <span class="text-gray-600">Total de marcas:</span>
        <span class="font-semibold text-gray-900">{brands.length}</span>
      </div>
      {#if brands.some(brand => brand.phoneCount !== undefined)}
        <div class="flex items-center justify-between text-sm mt-2">
          <span class="text-gray-600">Total de modelos:</span>
          <span class="font-semibold text-gray-900">
            {brands.reduce((total, brand) => total + (brand.phoneCount || 0), 0)}
          </span>
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .selected {
    border-color: #0284c7;
    background-color: #f0f9ff;
  }
  
  .selected .w-12 {
    background: linear-gradient(to bottom right, #bae6fd, #7dd3fc);
  }
  
  .selected h3 {
    color: #0369a1;
  }

  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>