import { defineConfig } from 'vite'
import { resolve } from 'path'
import fs from 'fs'
import nunjucks from 'nunjucks'

// Custom Nunjucks plugin
function nunjucksPlugin() {
  return {
    name: 'nunjucks',
    buildStart() {
      // Configure Nunjucks
      const env = nunjucks.configure('src/templates', {
        autoescape: true,
        noCache: true
      })

      // Global data
      const globalData = {
        site: {
          name: 'KeshavSoft',
          description: 'Creating innovative software solutions that drive business growth and digital transformation.',
          url: 'https://keshavsoft.com',
          email: 'info@keshavsoft.com',
          phone: '+1 (555) 123-4567',
          address: '123 Tech Street, Innovation City'
        },
        pages: {
          home: { title: 'Home', active: true },
          about: { title: 'About', active: false },
          contact: { title: 'Contact', active: false }
        }
      }

      // Process HTML files
      const htmlFiles = ['index.html', 'about.html', 'contact.html']
      
      htmlFiles.forEach(file => {
        const templatePath = `src/templates/${file}`
        if (fs.existsSync(templatePath)) {
          const template = fs.readFileSync(templatePath, 'utf8')
          const rendered = nunjucks.renderString(template, globalData)
          fs.writeFileSync(`dist/${file}`, rendered)
        }
      })
    }
  }
}

export default defineConfig({
  plugins: [nunjucksPlugin()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/templates/index.html'),
        about: resolve(__dirname, 'src/templates/about.html'),
        contact: resolve(__dirname, 'src/templates/contact.html')
      }
    }
  },
  server: {
    port: 3000,
    open: true
  },
  css: {
    postcss: {
      plugins: [
        require('autoprefixer')
      ]
    }
  }
})