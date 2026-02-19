// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/icon', '@vite-pwa/nuxt', '@nuxtjs/supabase'],

  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/register', '/forgot-password', '/reset-password', '/invite/*'],
    },
  },

  runtimeConfig: {
    supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY || '',
    public: {
      supabase: {
        url: process.env.SUPABASE_URL || '',
        key: process.env.SUPABASE_KEY || '',
      },
    },
  },
})