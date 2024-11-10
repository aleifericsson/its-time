import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';


const distTempPath = path.resolve(__dirname, 'dist-temp');
const distPath = path.resolve(__dirname, 'dist');
const distTempAssets = path.resolve(__dirname, 'dist-temp/assets');
const distAssets = path.resolve(__dirname, 'dist/assets');

function updateManifest(contentScriptFileName) {
  const manifestPath = path.resolve(__dirname, 'public/manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

  // Update the content script with the correct hashed filename
  manifest.content_scripts[0].js = [`assets/${contentScriptFileName}`];
  manifest.web_accessible_resources[0].resources[0] = `assets/${contentScriptFileName}`;
  fs.writeFileSync(path.resolve(__dirname, 'public/manifest.json'), JSON.stringify(manifest, null, 2));
}

function updateManifest2(contentScriptFileName) {
  const manifestPath = path.resolve(__dirname, 'public/manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  manifest.content_scripts[0].css = [`assets/${contentScriptFileName}`];
  manifest.web_accessible_resources[0].resources[1] = `assets/${contentScriptFileName}`;
  fs.writeFileSync(path.resolve(__dirname, 'dist/manifest.json'), JSON.stringify(manifest, null, 2));
}

function moveFilesToDist() {
  let files = fs.readdirSync(distTempAssets);
  files.forEach((file) => {
    const tempFilePath = path.join(distTempAssets, file);
    const distFilePath = path.join(distAssets, file);
    fs.renameSync(tempFilePath, distFilePath);
  })
    
  let sourceFilePath = path.resolve(__dirname, 'dist-temp/content.html');
  let destinationFilePath = path.resolve(__dirname, 'dist/content.html');

  fs.renameSync(sourceFilePath, destinationFilePath);

  files = fs.readdirSync(path.resolve(__dirname, 'dist/assets'));
  const contentScriptFile = files.find(file => file.startsWith('content') && file.endsWith('.js'));
  if (contentScriptFile) {
    updateManifest(contentScriptFile); 
  }
  const contentScriptFile2 = files.find(file => file.startsWith('content') && file.endsWith('.css'));
  if (contentScriptFile2) {
    updateManifest2(contentScriptFile2);
  }
}

function delDistTemp() {
  if (fs.existsSync(distTempPath)) {
    fs.readdirSync(distTempPath).forEach(file => {
      const filePath = path.join(distTempPath, file);
      fs.rmSync(filePath, { recursive: true, force: true });
    });
  } else {
    fs.mkdirSync(distTempPath);
  }
}

export default defineConfig(({ mode }) => {
  
  const isTempBuild = mode === 'content'; 

  return {
    plugins: [
      react(),
      {
        name: 'move-files-plugin',
         closeBundle() {
            if (isTempBuild) {
              moveFilesToDist(); // COMMENT OUT IF YOU GET AN ENOENT ERROR
              console.log('\x1b[32m✓\x1b[35m files moved to dist!\x1b[0m');
            } else {
              delDistTemp(); 
            }
        }
      },
    ],
    build: {
      chunkSizeWarningLimit: 1000,
      outDir: isTempBuild ? 'dist-temp' : 'dist', 
      rollupOptions: isTempBuild ? {
        input: {
          content: path.resolve(__dirname, 'content.html'),
        },
        output: {
          entryFileNames: 'assets/[name].[hash].js',
          assetFileNames: 'assets/[name].[hash].[ext]',
        },}: {
          input: {
            setting: path.resolve(__dirname, 'settings.html'),
          },
          output: {
            entryFileNames: 'assets/[name].[hash].js',
            assetFileNames: 'assets/[name].[hash].[ext]',
          },
        },
      emptyOutDir: isTempBuild ? false : true, // Only empty outDir for the first build
    },
  };
});