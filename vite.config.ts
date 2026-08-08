import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import express from 'express';
import {defineConfig, loadEnv} from 'vite';

const vercelApiPlugin = () => ({
  name: 'vercel-api-plugin',
  configureServer(server: any) {
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.all('/api/*', async (req, res) => {
      try {
        const relPath = req.path.replace('/api/', '');
        let filePath = '';

        if (relPath.startsWith('admin/')) {
          const route = relPath.replace('admin/', '');
          req.query.route = route;
          filePath = path.resolve(process.cwd(), 'api', 'admin_api.ts');
        } else {
          const publicRoutes = ['notifications', 'bookings', 'donate', 'godana', 'contact', 'notify-failure', 'create-order', 'verify-payment'];
          if (publicRoutes.includes(relPath)) {
            req.query.route = relPath;
            filePath = path.resolve(process.cwd(), 'api', 'public_api.ts');
          } else {
            filePath = path.resolve(process.cwd(), 'api', relPath);
            if (!fs.existsSync(filePath)) {
              if (fs.existsSync(`${filePath}.ts`)) {
                filePath = `${filePath}.ts`;
              } else if (fs.existsSync(path.join(filePath, 'index.ts'))) {
                filePath = path.join(filePath, 'index.ts');
              } else {
                return res.status(404).json({ success: false, message: 'API Route Not Found' });
              }
            }
          }
        }

        const module = await server.ssrLoadModule(filePath);
        const handler = module.default;
        
        await handler(req, res);
      } catch (err: any) {
        console.error(`[API Error] ${req.path}:`, err);
        res.status(500).json({ success: false, error: err.message });
      }
    });

    server.middlewares.use(app);
  }
});

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  
  // Expose backend env vars to the Vite SSR environment so API functions can access them
  process.env = { ...process.env, ...env };

  return {
    plugins: [react(), tailwindcss(), vercelApiPlugin()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
