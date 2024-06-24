// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "shadcn-nuxt",
    "nuxt3-leaflet",
    "nuxt-lodash",
    "nuxt-gtag",
    "@nuxt/icon"
  ],
  gtag: {
    id: 'G-BWBFQ7P0HR'
  },
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui'
  },
  runtimeConfig: {
    public: {
      apiUrl: '',
    }
  },
  app: {
    head: {
      link: [{ rel: 'icon', type: 'image/png', href: '/icon.png' }],
      title: "I2MO",
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: 'I2MO est votre partenaire de confiance pour des décisions immobilières éclairées grâce à des données précises et fiables.' },
        { hid: 'keywords', name: 'keywords', content: 'immobilier, investissement immobilier, gestion locative, analyse de marché, automatisation, I2MO' },
        { hid: 'author', name: 'author', content: 'I2MO' },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:title', content: 'I2MO - Décisions immobilières éclairées' },
        { property: 'og:description', content: 'I2MO facilite l\'investissement immobilier et la gestion locative grâce à l\'analyse de données et l\'automatisation des processus.' },
        { property: 'og:image', content: '/og-image.png' },
        { property: 'og:url', content: 'https://www.i2mo.com' },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'I2MO - Décisions immobilières éclairées' },
        { name: 'twitter:description', content: 'I2MO facilite l\'investissement immobilier et la gestion locative grâce à l\'analyse de données et l\'automatisation des processus.' },
        { name: 'twitter:image', content: '/twitter-image.png' },
      ]
    }
  },
})