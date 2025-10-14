<script>
  import { onMount } from 'svelte';
  import { fetchPhoneModels, deletePhoneModel, updatePhoneModel, createPhoneModel } from '$lib/api/dataService.js';
  import Button from '$lib/components/ui/Button.svelte';
  import Modal from '$lib/components/ui/Modal.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import Select from '$lib/components/ui/Select.svelte';
  import Toast from '$lib/components/ui/Toast.svelte';
  import { toastStore, toast } from '$lib/stores/toast.js';

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
   * @type {boolean}
   */
  let showAddModal = false;

  /**
   * @type {Object|null}
   */
  let editingModel = null;

  /**
   * @type {string}
   */
  let searchTerm = '';

  /**
   * @type {Array<Object>}
   */
  let filteredModels = [];

  /**
   * @type {Array<{value: string, label: string}>}
   */
  let brandOptions = [];

  /**
   * Carga los modelos
   * @returns {Promise<void>}
   */
  async function loadModels() {
    try {
      loading = true;
      error = '';
      
      const response = await fetchPhoneModels(1, 100);
      if (response.success) {
        models = response.data;
        filteredModels = models;
        
        // Extraer marcas únicas para el desplegable
        const uniqueBrands = [...new Set(models.map(model => model.brand_name))];
        brandOptions = uniqueBrands.map(brand => ({
          value: brand,
          label: brand
        }));
      } else {
        error = response.message;
      }
    } catch (err) {
      error = err instanceof Error ? err.message : 'Error desconocido';
      console.error('Error loading models:', err);
    } finally {
      loading = false;
    }
  }

  /**
   * Filtra los modelos según el término de búsqueda
   */
  function filterModels() {
    if (!searchTerm.trim()) {
      filteredModels = models;
    } else {
      filteredModels = models.filter(model => 
        model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.brand_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  }

  /**
   * Abre el modal para agregar un nuevo modelo
   */
  function openAddModal() {
    editingModel = null;
    showAddModal = true;
  }

  /**
   * Abre el modal para editar un modelo
   * @param {Object} model - Modelo a editar
   */
  function openEditModal(model) {
    editingModel = { ...model };
    showAddModal = true;
  }

  /**
   * Cierra el modal
   */
  function closeModal() {
    showAddModal = false;
    editingModel = null;
  }

  /**
   * Elimina un modelo usando dataService
   * @param {number} modelId - ID del modelo a eliminar
   */
  async function deleteModel(modelId) {
    if (confirm('¿Estás seguro de que quieres eliminar este modelo?')) {
      try {
        await deletePhoneModel(modelId);
        await loadModels(); // Recargar la lista
        toast.success('Modelo eliminado exitosamente');
      } catch (error) {
        console.error('Error al eliminar modelo:', error);
        toast.error('Error al eliminar el modelo');
      }
    }
  }

  /**
   * Guarda un modelo usando dataService
   * @param {Event} event - Evento del formulario
   */
  async function saveModel(event) {
    event.preventDefault();
    const form = /** @type {HTMLFormElement} */ (event.target);
    const formData = new FormData(form);
    
    const modelData = {
      name: /** @type {string} */ (formData.get('name')) || '',
      brand_name: /** @type {string} */ (formData.get('brand_name')) || '',
      price: parseFloat(/** @type {string} */ (formData.get('price')) || '0'),
      description: /** @type {string} */ (formData.get('description')) || '',
      release_date: /** @type {string} */ (formData.get('release_date')) || '',
      image_url: /** @type {string} */ (formData.get('image_url')) || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=600&fit=crop&crop=center'
    };

    try {
      if (editingModel) {
        // Editar modelo existente
        await updatePhoneModel(editingModel.id, modelData);
        toast.success('Modelo actualizado exitosamente');
      } else {
        // Agregar nuevo modelo
        await createPhoneModel(modelData);
        toast.success('Modelo agregado exitosamente');
      }

      await loadModels(); // Recargar la lista
      closeModal();
    } catch (error) {
      console.error('Error al guardar modelo:', error);
      toast.error('Error al guardar el modelo');
    }
  }

  // Reactivo para filtrar cuando cambie el término de búsqueda
  $: if (searchTerm !== undefined) {
    filterModels();
  }

  onMount(loadModels);
</script>

<div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Gestión de Modelos</h1>
        <p class="text-gray-600">Administra los modelos de teléfonos en el sistema</p>
      </div>
      <Button 
        variant="primary"
        on:click={openAddModal}
      >
        Agregar Modelo
      </Button>
    </div>

    <!-- Búsqueda -->
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <Input
            placeholder="Buscar modelos..."
            bind:value={searchTerm}
          />
        </div>
        <div class="text-sm text-gray-500 flex items-center">
          {filteredModels.length} de {models.length} modelos
        </div>
      </div>
    </div>

    {#if loading}
      <div class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    {:else if error}
      <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div class="text-red-600 font-medium mb-2">Error al cargar los modelos</div>
        <div class="text-red-500 text-sm">{error}</div>
        <Button 
          variant="danger"
          on:click={loadModels}
        >
          Reintentar
        </Button>
      </div>
    {:else}
      <!-- Tabla de modelos -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
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
              {#each filteredModels as model (model.id)}
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <img class="h-12 w-12 rounded-lg object-cover" src={model.image_url} alt={model.name} />
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">{model.name}</div>
                        <div class="text-sm text-gray-500 truncate max-w-xs">{model.description}</div>
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
                      <Button 
                        variant="primary" 
                        size="sm" 
                        on:click={() => openEditModal(model)}
                      >
                        Editar
                      </Button>
                      <Button 
                        variant="danger" 
                        size="sm" 
                        on:click={() => deleteModel(model.id)}
                      >
                        Eliminar
                      </Button>
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

  <!-- Modal para agregar/editar modelo -->
  <Modal 
    show={showAddModal} 
    title={editingModel ? 'Editar Modelo' : 'Agregar Modelo'}
    size="lg"
    on:close={closeModal}
  >
    <form on:submit={saveModel} class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Nombre del Modelo"
          name="name"
          value={editingModel?.name || ''}
          required
        />
        <Select
          label="Marca"
          name="brand_name"
          value={editingModel?.brand_name || ''}
          options={brandOptions}
          placeholder="Seleccionar marca..."
          required
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Precio"
          type="number"
          name="price"
          value={editingModel?.price || ''}
          required
        />
        <Input
          label="Fecha de Lanzamiento"
          type="date"
          name="release_date"
          value={editingModel?.release_date || ''}
          required
        />
      </div>

      <Input
        label="URL de Imagen"
        type="url"
        name="image_url"
        value={editingModel?.image_url || ''}
        placeholder="https://ejemplo.com/imagen.jpg"
      />

      <Input
        label="Descripción"
        type="textarea"
        name="description"
        value={editingModel?.description || ''}
        required
      />

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
          {editingModel ? 'Actualizar' : 'Agregar'}
        </Button>
      </div>
    </form>
  </Modal>

  <Toast />