import url from 'url';
import { dirname } from 'path';

export function getDirname(path) {
  return dirname(url.fileURLToPath(path)).replace(/\\/g, '/');
}

export function getDirnameForEndpointTest(path) {
  return getDirname(path).replace(/.*\/src\/api/, '');
}
