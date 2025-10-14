<script>
  /**
   * @type {Object | null}
   */
  export let model = null;
  
  /**
   * @type {() => void}
   */
  export let onClose = () => {};

  /**
   * Maneja el evento de teclado para cerrar el modal
   * @param {KeyboardEvent} e
   */
  function handleKeydown(e) {
    if (e.key === 'Escape') {
      onClose();
    }
  }

  /**
   * Maneja el clic en el overlay - no hace nada para evitar cierre accidental
   * @param {MouseEvent} e
   */
  function handleOverlayClick(e) {
    // No cerrar el modal al hacer clic en el overlay
  }

  /**
   * Maneja el clic en el botón de cerrar
   * @param {MouseEvent} e
   */
  function handleCloseClick(e) {
    onClose();
  }
</script>

{#if model}
  <!-- Modal Overlay -->
  <div 
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    on:click={handleOverlayClick}
    on:keydown={handleKeydown}
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
    tabindex="-1"
  >
    <!-- Modal Content -->
    <div 
      class="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      on:click|stopPropagation
      role="document"
    >
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <div>
          <h2 id="modal-title" class="text-2xl font-bold text-gray-900">{model?.name || 'Modelo desconocido'}</h2>
          <p class="text-gray-600">{model?.company || 'Marca desconocida'}</p>
        </div>
        <button
          class="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          on:click={handleCloseClick}
          aria-label="Cerrar modal"
          title="Cerrar modal"
        >
          <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="p-6">
        <!-- Image -->
        {#if model.image_url}
          <div class="w-full h-64 mb-6 rounded-lg overflow-hidden bg-gray-100">
            <img 
              src={model.image_url} 
              alt={model.name}
              class="w-full h-full object-cover"
              on:error={(e) => {
                const target = e.target;
                if (target instanceof HTMLImageElement) {
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling;
                  if (fallback instanceof HTMLElement) {
                    fallback.style.display = 'flex';
                  }
                }
              }}
            />
            <div class="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center" style="display: none;">
              <svg class="w-24 h-24 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
              </svg>
            </div>
          </div>
        {:else}
          <!-- Image placeholder -->
          <div class="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center mb-6">
            <svg class="w-24 h-24 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
            </svg>
          </div>
        {/if}

        <!-- Description -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Descripción</h3>
          <p class="text-gray-600 leading-relaxed">{model.description}</p>
        </div>

        <!-- Specifications -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Especificaciones</h3>
            <div class="space-y-3">
              {#if model.specifications}
                {#each Object.entries(model.specifications) as [key, value]}
                  <div class="flex justify-between py-2 border-b border-gray-100">
                    <span class="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span class="text-gray-900 font-medium">{value}</span>
                  </div>
                {/each}
              {/if}
            </div>
          </div>

          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Información</h3>
            <div class="space-y-3">
              <div class="flex justify-between py-2 border-b border-gray-100">
                <span class="text-gray-600">Fecha de lanzamiento</span>
                <span class="text-gray-900 font-medium">
                  {new Date(model.releaseDate).toLocaleDateString('es-ES')}
                </span>
              </div>
              {#if model.price}
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="text-gray-600">Precio</span>
                  <span class="text-gray-900 font-medium">${model.price}</span>
                </div>
              {/if}
              {#if model.category}
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="text-gray-600">Categoría</span>
                  <span class="text-gray-900 font-medium">{model.category}</span>
                </div>
              {/if}
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex justify-end space-x-3 p-6 border-t border-gray-200">
        <button
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          on:click={handleCloseClick}
          aria-label="Cerrar modal"
        >
          Cerrar
        </button>
      </div>
    </div>
  </div>
{/if}