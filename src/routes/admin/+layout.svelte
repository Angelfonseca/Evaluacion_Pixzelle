<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { isAuthenticated, user, checkAuthStatus, logout } from '$lib/stores/auth.js';

  let loading = true;

  onMount(() => {
    // Verificar estado de autenticación al cargar
    checkAuthStatus();
    loading = false;

    // Suscribirse a cambios en el estado de autenticación
    const unsubscribe = isAuthenticated.subscribe(value => {
      if (!loading && !value && $page.url.pathname !== '/admin/login') {
        goto('/admin/login');
      }
    });

    return unsubscribe;
  });

  /**
   * Maneja el cierre de sesión
   */
  function handleLogout() {
    logout();
    goto('/admin/login');
  }
</script>

{#if loading}
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <div class="animate-spin w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"></div>
      <p class="text-gray-600">Verificando autenticación...</p>
    </div>
  </div>
{:else if $isAuthenticated || $page.url.pathname === '/admin/login'}
  {#if $page.url.pathname === '/admin/login'}
    <slot />
  {:else}
    <!-- Admin Layout with Navigation -->
    <div class="min-h-screen bg-gray-50">
      <!-- Top Navigation -->
      <nav class="bg-white shadow-sm border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <!-- Logo and Title -->
            <div class="flex items-center">
              <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
              </div>
              <h1 class="text-xl font-semibold text-gray-900">Panel de Administración</h1>
            </div>

            <!-- Navigation Links -->
            <div class="hidden md:flex items-center space-x-8">
              <a 
                href="/admin" 
                class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                class:text-blue-600={$page.url.pathname === '/admin'}
                class:bg-blue-50={$page.url.pathname === '/admin'}
              >
                Dashboard
              </a>
              <a 
                href="/admin/models" 
                class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                class:text-blue-600={$page.url.pathname === '/admin/models'}
                class:bg-blue-50={$page.url.pathname === '/admin/models'}
              >
                Modelos
              </a>
              <a 
                href="/admin/brands" 
                class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                class:text-blue-600={$page.url.pathname === '/admin/brands'}
                class:bg-blue-50={$page.url.pathname === '/admin/brands'}
              >
                Marcas
              </a>
            </div>

            <!-- User Menu -->
            <div class="flex items-center space-x-4">
              <div class="hidden md:flex items-center space-x-3">
                <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                </div>
                <span class="text-sm text-gray-700">{$user?.name || 'Administrador'}</span>
              </div>
              
              <button
                on:click={handleLogout}
                class="text-gray-600 hover:text-gray-900 p-2 rounded-md transition-colors"
                title="Cerrar sesión"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile Navigation -->
        <div class="md:hidden border-t border-gray-200">
          <div class="px-2 pt-2 pb-3 space-y-1">
            <a 
              href="/admin" 
              class="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              class:text-blue-600={$page.url.pathname === '/admin'}
              class:bg-blue-50={$page.url.pathname === '/admin'}
            >
              Dashboard
            </a>
            <a 
              href="/admin/models" 
              class="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              class:text-blue-600={$page.url.pathname === '/admin/models'}
              class:bg-blue-50={$page.url.pathname === '/admin/models'}
            >
              Modelos
            </a>
            <a 
              href="/admin/brands" 
              class="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              class:text-blue-600={$page.url.pathname === '/admin/brands'}
              class:bg-blue-50={$page.url.pathname === '/admin/brands'}
            >
              Marcas
            </a>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <slot />
      </main>

      <!-- Back to Site Link -->
      <div class="fixed bottom-4 left-4">
        <a 
          href="/" 
          class="inline-flex items-center px-4 py-2 bg-white text-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          Volver al sitio
        </a>
      </div>
    </div>
  {/if}
{:else}
  <!-- Redirecting to login -->
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <div class="animate-spin w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"></div>
      <p class="text-gray-600">Redirigiendo al login...</p>
    </div>
  </div>
{/if}