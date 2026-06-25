import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    define: {
      __PAGAMENTO_ON__: JSON.stringify(env.PAGAMENTO_ON ?? env.VITE_PAGAMENTO_ON ?? 'true'),
    },
  };
});
