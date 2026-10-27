import helmet from 'helmet';
import type { Request, Response, NextFunction } from 'express';
export function helmetSecurity() {
  return helmet({
    frameguard: { action: 'sameorigin' },
    crossOriginResourcePolicy: { policy: 'same-site' },
    crossOriginEmbedderPolicy: false,
    hsts: process.env.NODE_ENV === 'production'
      ? { maxAge: 31536000, includeSubDomains: true, preload: true }
      : false,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    
    contentSecurityPolicy: {
      directives: {
        "default-src": ["'self'"],
        "script-src": ["'self'"],
        "style-src": ["'self'", "'unsafe-inline'"],
        "img-src": ["'self'", "data:", "blob:", "http:", "https:"],
        "connect-src": ["'self'", "http://192.168.6.16:3030"],
        "frame-src": ["'self'"],
        "frame-ancestors": ["'self'"],
        "object-src": ["'self'", "data:", "blob:", "http:", "https:"],
      },
    },
    

  }); 
}
export function permissionsPolicy() {
  return (_req: Request, res: Response, next: NextFunction) => {
    res.setHeader(
      'Permissions-Policy',
      'camera=(), microphone=(), geolocation=(), payment=(), usb=(), fullscreen=(self)'
    );
    next();
  };
}