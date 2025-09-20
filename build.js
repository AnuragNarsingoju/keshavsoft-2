const fs = require('fs');
const path = require('path');
const nunjucks = require('nunjucks');

// Configure Nunjucks
const env = nunjucks.configure('src/templates', {
    autoescape: true,
    noCache: true
});

// Load site data
const siteData = JSON.parse(fs.readFileSync('src/data/site.json', 'utf8'));

// Global data for templates
const globalData = {
    site: siteData,
    pages: {
        home: { title: 'Home', active: true },
        about: { title: 'About', active: false },
        contact: { title: 'Contact', active: false },
    }
};

// Ensure dist directory exists
if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist', { recursive: true });
}

// Copy assets
function copyAssets() {
    const assetsDir = 'src/assets';
    const distAssetsDir = 'dist/assets';
    
    if (fs.existsSync(assetsDir)) {
        if (!fs.existsSync(distAssetsDir)) {
            fs.mkdirSync(distAssetsDir, { recursive: true });
        }
        
        // Copy CSS
        const cssDir = path.join(assetsDir, 'css');
        if (fs.existsSync(cssDir)) {
            const distCssDir = path.join(distAssetsDir, 'css');
            if (!fs.existsSync(distCssDir)) {
                fs.mkdirSync(distCssDir, { recursive: true });
            }
            const cssFiles = fs.readdirSync(cssDir);
            cssFiles.forEach(file => {
                fs.copyFileSync(
                    path.join(cssDir, file),
                    path.join(distCssDir, file)
                );
            });
        }
        
        // Copy JS
        const jsDir = path.join(assetsDir, 'js');
        if (fs.existsSync(jsDir)) {
            const distJsDir = path.join(distAssetsDir, 'js');
            if (!fs.existsSync(distJsDir)) {
                fs.mkdirSync(distJsDir, { recursive: true });
            }
            const jsFiles = fs.readdirSync(jsDir);
            jsFiles.forEach(file => {
                fs.copyFileSync(
                    path.join(jsDir, file),
                    path.join(distJsDir, file)
                );
            });
        }
        
        // Copy images
        const imagesDir = path.join(assetsDir, 'images');
        if (fs.existsSync(imagesDir)) {
            const distImagesDir = path.join(distAssetsDir, 'images');
            if (!fs.existsSync(distImagesDir)) {
                fs.mkdirSync(distImagesDir, { recursive: true });
            }
            const imageFiles = fs.readdirSync(imagesDir);
            imageFiles.forEach(file => {
                fs.copyFileSync(
                    path.join(imagesDir, file),
                    path.join(distImagesDir, file)
                );
            });
        }
    }
}

// Process HTML templates
function processTemplates() {
    const templates = ['index.html', 'about.html', 'contact.html'];
    
    templates.forEach(template => {
        const templatePath = path.join('src/templates', template);
        
        if (fs.existsSync(templatePath)) {
            console.log(`Processing ${template}...`);
            
            // Set active page
            const pageName = template.replace('.html', '');
            const data = {
                ...globalData,
                page: globalData.pages[pageName] || { title: pageName, active: false }
            };
            
            // Render template
            const rendered = nunjucks.render(template, data);
            
            // Write to dist
            fs.writeFileSync(path.join('dist', template), rendered);
            console.log(`✓ ${template} processed successfully`);
        }
    });
}

// Main build function
function build() {
    console.log('🚀 Starting build process...');
    
    // Copy assets
    console.log('📁 Copying assets...');
    copyAssets();
    
    // Process templates
    console.log('🔧 Processing templates...');
    processTemplates();
    
    console.log('✅ Build completed successfully!');
    console.log('📦 Output directory: dist/');
}

// Run build
build();
