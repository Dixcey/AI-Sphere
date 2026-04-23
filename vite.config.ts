import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    // For GitHub Pages project sites, assets live under /<repo>/.
    // In GitHub Actions, GITHUB_REPOSITORY is always "owner/repo", so
    // derive the base path from it. This makes the same build work for
    // any fork (e.g. Dixcey/AI-Sphere or wendylzh6/AI_Sphere) without
    // code changes. Local dev stays at '/'.
    const ghRepo = env.GITHUB_REPOSITORY || process.env.GITHUB_REPOSITORY;
    const isProd = mode === 'production';
    const base = isProd && ghRepo ? `/${ghRepo.split('/')[1]}/` : '/';
    return {
      base,
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
