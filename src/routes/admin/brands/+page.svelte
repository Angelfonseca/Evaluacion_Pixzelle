<script>
  import { onMount } from 'svelte';
  import { fetchBrands, createBrand, updateBrand, deleteBrand as deleteBrandAPI } from '$lib/api/dataService.js';
  import Button from '$lib/components/ui/Button.svelte';
  import Modal from '$lib/components/ui/Modal.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import Toast from '$lib/components/ui/Toast.svelte';
  import { toast, toastStore } from '$lib/stores/toast.js';

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
   * @type {boolean}
   */
  let showAddModal = false;

  /**
   * @type {Object|null}
   */
  let editingBrand = null;

  /**
   * @type {string}
   */
  let searchTerm = '';

  /**
   * @type {Array<Object>}
   */
  let filteredBrands = [];

  /**
   * Carga las marcas
   * @returns {Promise<void>}
   */
  async function loadBrands() {
    try {
      loading = true;
      error = '';
      
      const response = await fetchBrands();
      if (response.success) {
        brands = response.data;
        filteredBrands = brands;
      } else {
        error = response.message;
      }
    } catch (err) {
      error = err instanceof Error ? err.message : 'Error desconocido';
      console.error('Error loading brands:', err);
    } finally {
      loading = false;
    }
  }

  /**
   * Filtra las marcas según el término de búsqueda
   */
  function filterBrands() {
    if (!searchTerm.trim()) {
      filteredBrands = brands;
    } else {
      filteredBrands = brands.filter(brand => 
        brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        brand.country.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  }

  /**
   * Abre el modal para agregar una nueva marca
   */
  function openAddModal() {
    editingBrand = null;
    showAddModal = true;
  }

  /**
   * Abre el modal para editar una marca
   * @param {Object} brand - Marca a editar
   */
  function openEditModal(brand) {
    editingBrand = { ...brand };
    showAddModal = true;
  }

  /**
   * Cierra el modal
   */
  function closeModal() {
    showAddModal = false;
    editingBrand = null;
  }

  /**
   * Elimina una marca usando dataService
   * @param {number} brandId - ID de la marca a eliminar
   */
  async function deleteBrand(brandId) {
    if (confirm('¿Estás seguro de que quieres eliminar esta marca?')) {
      try {
        const response = await deleteBrandAPI(brandId);
        if (response.success) {
          await loadBrands(); // Recargar la lista
          toast.success('Marca eliminada exitosamente');
        } else {
          toast.error(response.message || 'Error al eliminar la marca');
        }
      } catch (error) {
        console.error('Error al eliminar marca:', error);
        toast.error('Error al eliminar la marca');
      }
    }
  }

  /**
   * Guarda una marca usando dataService
   * @param {Event} event - Evento del formulario
   */
  async function saveBrand(event) {
    event.preventDefault();
    const form = /** @type {HTMLFormElement} */ (event.target);
    const formData = new FormData(form);
    
    const brandData = {
      name: /** @type {string} */ (formData.get('name')) || '',
      country: /** @type {string} */ (formData.get('country')) || '',
      founded_year: parseInt(/** @type {string} */ (formData.get('founded_year')) || '0'),
      description: /** @type {string} */ (formData.get('description')) || '',
      logo_url: /** @type {string} */ (formData.get('logo_url')) || 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop&crop=center'
    };

    try {
      if (editingBrand) {
        // Editar marca existente
        await updateBrand(editingBrand.id, brandData);
        toast.success('Marca actualizada exitosamente');
      } else {
        // Agregar nueva marca
        await createBrand(brandData);
        toast.success('Marca agregada exitosamente');
      }

      await loadBrands(); // Recargar la lista
      closeModal();
    } catch (error) {
      console.error('Error al guardar marca:', error);
      toast.error('Error al guardar la marca');
    }
  }

  // Reactivo para filtrar cuando cambie el término de búsqueda
  $: if (searchTerm !== undefined) {
    filterBrands();
  }

  onMount(loadBrands);
</script>

<div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Gestión de Marcas</h1>
        <p class="text-gray-600">Administra las marcas de teléfonos en el sistema</p>
      </div>
      <Button variant="primary" on:click={openAddModal}>
        Agregar Marca
      </Button>
    </div>

    <!-- Búsqueda -->
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <Input
            type="text"
            placeholder="Buscar marcas..."
            bind:value={searchTerm}
          />
        </div>
        <div class="text-sm text-gray-500 flex items-center">
          {filteredBrands.length} de {brands.length} marcas
        </div>
      </div>
    </div>

    {#if loading}
      <div class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    {:else if error}
      <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div class="text-red-600 font-medium mb-2">Error al cargar las marcas</div>
        <div class="text-red-500 text-sm">{error}</div>
        <Button variant="danger" on:click={loadBrands}>
          Reintentar
        </Button>
      </div>
    {:else}
      <!-- Grid de marcas -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each filteredBrands as brand (brand.id)}
          <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div class="aspect-w-16 aspect-h-9 bg-gray-100 p-6">
              <img 
                src={brand.logo_url} 
                alt={brand.name}
                class="w-full h-24 object-contain"
                loading="lazy"
              />
            </div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-2">
                <h3 class="text-lg font-semibold text-gray-900">{brand.name}</h3>
                <span class="text-sm text-gray-500">{brand.country}</span>
              </div>
              <p class="text-gray-600 text-sm mb-4 line-clamp-2">{brand.description}</p>
              
              <div class="space-y-2 text-sm mb-4">
                <div class="flex justify-between">
                  <span class="text-gray-500">Fundada:</span>
                  <span class="font-medium">{brand.founded_year}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Modelos:</span>
                  <span class="font-medium">{brand.phoneCount || 0}</span>
                </div>
              </div>

              <div class="flex space-x-2">
                <Button 
                  variant="primary" 
                  size="sm" 
                  on:click={() => openEditModal(brand)}
                >
                  Editar
                </Button>
                <Button 
                  variant="danger" 
                  size="sm" 
                  on:click={() => deleteBrand(brand.id)}
                >
                  Eliminar
                </Button>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>

  <!-- Modal para agregar/editar marca -->
  <Modal 
    show={showAddModal} 
    title={editingBrand ? 'Editar Marca' : 'Agregar Marca'}
    size="lg"
    on:close={closeModal}
  >
    <form on:submit={saveBrand} class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Nombre de la Marca"
          name="name"
          value={editingBrand?.name || ''}
          required
        />
        <Input
          label="País"
          name="country"
          value={editingBrand?.country || ''}
          required
        />
      </div>

      <Input
        label="Año de Fundación"
        type="number"
        name="founded_year"
        value={editingBrand?.founded_year || ''}
        required
      />

      <Input
        label="URL del Logo"
        type="url"
        name="logo_url"
        value={editingBrand?.logo_url || ''}
        placeholder="https://ejemplo.com/logo.jpg"
      />

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
        <textarea
          name="description"
          rows="3"
          value={editingBrand?.description || ''}
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        ></textarea>
      </div>

      <div class="flex justify-end space-x-3 pt-6">
        <Button
          type="button"
          variant="secondary"
          on:click={closeModal}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="primary"
        >
          {editingBrand ? 'Actualizar' : 'Agregar'}
        </Button>
      </div>
    </form>
  </Modal>

  <!-- Toast para notificaciones -->
  <Toast />

<style>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>