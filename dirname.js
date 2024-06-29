// dirname.js
import { fileURLToPath } from 'url';
import { dirname as pathDirname } from 'path';

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = pathDirname(__filename);
