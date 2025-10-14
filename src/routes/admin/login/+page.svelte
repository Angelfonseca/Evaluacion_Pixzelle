<script>
  import { goto } from '$app/navigation';
  import { login, isAuthenticated } from '$lib/stores/auth.js';
  import { onMount } from 'svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import Toast from '$lib/components/ui/Toast.svelte';
  import { toast } from '$lib/stores/toast.js';

  let username = '';
  let password = '';
  let loading = false;
  let error = '';
  let showPassword = false;

  // Redirigir si ya está autenticado
  onMount(() => {
    const unsubscribe = isAuthenticated.subscribe(value => {
      if (value) {
        goto('/admin');
      }
    });
    
    return unsubscribe;
  });

  /**
   * Maneja el envío del formulario de login
   * @param {Event} event
   */
  async function handleSubmit(event) {
    event.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      error = 'Por favor, completa todos los campos';
      return;
    }

    loading = true;
    error = '';

    try {
      const result = await login(username.trim(), password);
      
      if (result.success) {
        // La redirección se maneja automáticamente por el onMount
      } else {
        error = result.message;
      }
    } catch (err) {
      error = 'Error de conexión. Inténtalo de nuevo.';
      console.error('Login error:', err);
    } finally {
      loading = false;
    }
  }

  /**
   * Alterna la visibilidad de la contraseña
   */
  function togglePasswordVisibility() {
    showPassword = !showPassword;
  }
</script>

<svelte:head>
  <title>Iniciar Sesión - Panel de Administración</title>
  <meta name="description" content="Acceso al panel de administración del sistema de gestión de teléfonos" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4">
  <div class="max-w-md w-full">
    <!-- Logo/Header -->
    <div class="text-center mb-8">
      <div class="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
        </svg>
      </div>
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Panel de Administración</h1>
      <p class="text-gray-600">Inicia sesión para acceder al sistema</p>
    </div>

    <!-- Login Form -->
    <div class="bg-white rounded-xl shadow-lg p-8">
      <form on:submit={handleSubmit} class="space-y-6">
        <!-- Username Field -->
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
            Usuario
          </label>
          <Input
            type="text"
            bind:value={username}
            placeholder="Ingresa tu usuario"
            disabled={loading}
            required
          />
        </div>

        <!-- Password Field -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
            Contraseña
          </label>
          <div class="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              bind:value={password}
              placeholder="Ingresa tu contraseña"
              disabled={loading}
              required
            />
            <button
              type="button"
              class="absolute inset-y-0 right-0 pr-3 flex items-center"
              on:click={togglePasswordVisibility}
              disabled={loading}
            >
              {#if showPassword}
                <svg class="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"/>
                </svg>
              {:else}
                <svg class="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
              {/if}
            </button>
          </div>
        </div>

        <!-- Error Message -->
        {#if error}
          <div class="bg-red-50 border border-red-200 rounded-lg p-4">
            <div class="flex items-center">
              <svg class="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <p class="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        {/if}

        <!-- Submit Button -->
        <Button
          type="submit"
          variant="primary"
          disabled={loading}
          loading={loading}
        >
          {#if loading}
            Iniciando sesión...
          {:else}
            Iniciar Sesión
          {/if}
        </Button>
      </form>

      <!-- Demo Credentials -->
      <div class="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 class="text-sm font-medium text-gray-700 mb-2">Credenciales de demostración:</h3>
        <div class="text-sm text-gray-600 space-y-1">
          <p><strong>Usuario:</strong> admin</p>
          <p><strong>Contraseña:</strong> admin123</p>
        </div>
      </div>
    </div>

    <!-- Back to Home -->
    <div class="text-center mt-6">
      <a 
        href="/" 
        class="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
      >
        ← Volver al inicio
      </a>
    </div>
  </div>
</div>

<Toast />