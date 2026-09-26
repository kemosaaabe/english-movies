export const apiPort = 3000;
export const frontendOrigin = process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173';
export const unsafeMethods = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);
