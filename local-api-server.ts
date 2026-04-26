import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

// Helper to handle Vercel functions
const handleVercelFunction = async (filePath: string, req: any, res: any) => {
  try {
    const module = await import(`file://${filePath}`);
    const handler = module.default;
    await handler(req, res);
  } catch (err: any) {
    console.error(`Error in ${filePath}:`, err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Map /api requests to files in the api directory
app.all('/api/*', async (req, res) => {
  const relPath = req.path.replace('/api/', '');
  let filePath = path.resolve(process.cwd(), 'api', relPath);

  // Handle directory index or missing extension
  if (!fs.existsSync(filePath)) {
    if (fs.existsSync(`${filePath}.ts`)) {
      filePath = `${filePath}.ts`;
    } else if (fs.existsSync(path.join(filePath, 'index.ts'))) {
      filePath = path.join(filePath, 'index.ts');
    } else {
      console.warn(`404: ${filePath}`);
      return res.status(404).json({ success: false, message: 'API Route Not Found' });
    }
  }

  console.log(`[API] ${req.method} ${req.path} -> ${path.basename(filePath)}`);
  await handleVercelFunction(filePath, req, res);
});

app.listen(port, () => {
  console.log(`\x1b[32m[API Server] Running at http://localhost:${port}\x1b[0m`);
});
