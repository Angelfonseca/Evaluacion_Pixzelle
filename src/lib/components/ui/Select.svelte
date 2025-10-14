<script>
  /** @type {string} */
  export let name = '';
  
  /** @type {string} */
  export let value = '';
  
  /** @type {string} */
  export let placeholder = 'Seleccionar...';
  
  /** @type {string} */
  export let label = '';
  
  /** @type {boolean} */
  export let required = false;
  
  /** @type {boolean} */
  export let disabled = false;
  
  /** @type {string} */
  export let error = '';
  
  /** @type {string} */
  export let helperText = '';
  
  /** @type {string} */
  export let size = 'md'; // 'sm', 'md', 'lg'
  
  /** @type {Array<{value: string, label: string}>} */
  export let options = [];

  // Clases base
  const baseClasses = 'w-full border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed bg-white';

  // Tamaños
  const sizes = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  };

  // Estados
  $: stateClasses = error 
    ? 'border-red-300 focus:ring-red-500' 
    : 'border-gray-300 focus:ring-blue-500';

  $: classes = `${baseClasses} ${sizes[size]} ${stateClasses}`;
</script>

<div class="space-y-1">
  {#if label}
    <label for={name} class="block text-sm font-medium text-gray-700">
      {label}
      {#if required}
        <span class="text-red-500">*</span>
      {/if}
    </label>
  {/if}

  <select
    id={name}
    {name}
    {required}
    {disabled}
    bind:value
    class={classes}
    on:change
    on:blur
    on:focus
  >
    {#if placeholder}
      <option value="" disabled selected={!value}>{placeholder}</option>
    {/if}
    {#each options as option}
      <option value={option.value}>{option.label}</option>
    {/each}
  </select>

  {#if error}
    <p class="text-sm text-red-600">{error}</p>
  {:else if helperText}
    <p class="text-sm text-gray-500">{helperText}</p>
  {/if}
</div>