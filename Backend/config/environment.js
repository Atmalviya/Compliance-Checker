import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const result = dotenv.config({ path: join(dirname(__dirname), '.env') });

if (result.error) {
    throw new Error('Error loading .env file: ' + result.error.message);
}
