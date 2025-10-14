<script>
  import { createEventDispatcher } from 'svelte';

  /** @type {boolean} */
  export let show = false;
  
  /** @type {string} */
  export let title = '';
  
  /** @type {boolean} */
  export let showCloseButton = true;
  
  /** @type {string} */
  export let size = 'md'; // 'sm', 'md', 'lg', 'xl'

  const dispatch = createEventDispatcher();

  function closeModal() {
    dispatch('close');
  }

  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  }

  function handleKeydown(event) {
    if (event.key === 'Escape') {
      closeModal();
    }
  }

  // Tamaños del modal
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };
</script>

<svelte:window on:keydown={handleKeydown} />

{#if show}
  <!-- Backdrop -->
  <div 
    class="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center p-4 z-50"
    on:click={handleBackdropClick}
    role="dialog"
    aria-modal="true"
    aria-labelledby={title ? 'modal-title' : undefined}
  >
    <!-- Modal Content -->
    <div class="bg-white rounded-xl shadow-xl w-full {sizes[size]} max-h-[90vh] overflow-hidden">
      <!-- Header -->
      {#if title || showCloseButton}
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          {#if title}
            <h2 id="modal-title" class="text-xl font-bold text-gray-900">{title}</h2>
          {:else}
            <div></div>
          {/if}
          
          {#if showCloseButton}
            <button 
              class="text-gray-400 hover:text-gray-600 transition-colors"
              on:click={closeModal}
              aria-label="Cerrar modal"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          {/if}
        </div>
      {/if}

      <!-- Body -->
      <div class="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
        <slot />
      </div>

      <!-- Footer -->
      <slot name="footer" />
    </div>
  </div>
{/if}