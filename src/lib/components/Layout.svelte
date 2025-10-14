<script>
  export let title = "CMS Móviles";
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <!-- Header -->
  <header class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center space-x-4">
          <div class="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
            </svg>
          </div>
          <h1 class="text-xl font-bold text-gray-900">{title}</h1>
        </div>
        
        <nav class="hidden md:flex space-x-8">
          <a href="/" class="text-gray-600 hover:text-blue-600 transition-colors duration-200">Inicio</a>
          <a href="/models" class="text-gray-600 hover:text-blue-600 transition-colors duration-200">Modelos</a>
          <a href="/brands" class="text-gray-600 hover:text-blue-600 transition-colors duration-200">Marcas</a>
          <a href="/admin" class="text-gray-600 hover:text-blue-600 transition-colors duration-200">Administración</a>
        </nav>
      </div>
    </div>
  </header>
  
  <!-- Main Content -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <slot />
  </main>
  
  <!-- Footer -->
  <footer class="bg-white border-t border-gray-200 mt-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="text-center text-gray-500">
        <p>&copy; 2024 CMS Móviles. Todos los derechos reservados.</p>
      </div>
    </div>
  </footer>
</div>