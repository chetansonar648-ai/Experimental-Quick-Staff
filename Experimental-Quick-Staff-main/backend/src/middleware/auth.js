// import jwt from 'jsonwebtoken'

// export const authenticate = (roles = []) => {
//   const allowedRoles = Array.isArray(roles) ? roles : [roles]
//   return (req, res, next) => {
//     const token = req.headers.authorization?.split(' ')[1]
//     if (!token) return res.status(401).json({ message: 'Unauthorized' })
//     try {
//       const payload = jwt.verify(token, process.env.JWT_SECRET)
//       if (allowedRoles.length && !allowedRoles.includes(payload.role)) {
//         return res.status(403).json({ message: 'Forbidden' })
//       }
//       req.user = payload
//       next()
//     } catch (err) {
//       return res.status(401).json({ message: 'Invalid token' })
//     }
//   }
// }
// import { verifyToken } from '../utils/token.js';

// export const authRequired = (roles = []) => (req, res, next) => {
//   try {
//     const header = req.headers.authorization || '';
//     const token = header.startsWith('Bearer ') ? header.slice(7) : null;
//     const cookieToken = req.cookies?.token;
//     const jwtToken = token || cookieToken;

//     if (!jwtToken) {
//       return res.status(401).json({ message: 'Authentication required' });
//     }

//     const decoded = verifyToken(jwtToken);
//     if (roles.length && !roles.includes(decoded.role)) {
//       return res.status(403).json({ message: 'Forbidden' });
//     }

//     req.user = decoded;
//     return next();
//   } catch (err) {
//     return res.status(401).json({ message: 'Invalid or expired token' });
//   }
// };
// import jwt from "jsonwebtoken";

// export const authenticate = (req, res, next) => {
//   const token = req.cookies.token || req.headers.authorization?.replace("Bearer ", "");
//   if (!token) {
//     return res.status(401).json({ message: "Authentication required" });
//   }
//   try {
//     const payload = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = payload;
//     return next();
//   } catch (err) {
//     return res.status(401).json({ message: "Invalid or expired token" });
//   }
// };

// export const authorize = (...roles) => (req, res, next) => {
//   if (!roles.includes(req.user?.role)) {
//     return res.status(403).json({ message: "Forbidden" });
//   }
//   return next();
// };

import jwt from 'jsonwebtoken';

export const authenticate = (roles = null) => {
  return (req, res, next) => {
    try {
      let token = null;
      const authHeader = req.headers.authorization;

      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.slice(7);
      } else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
      }

      if (!token) {
        return res.status(401).json({ message: 'Authorization token missing' });
      }

      const payload = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user info to req
      req.user = {
        id: payload.id,
        email: payload.email,
        role: payload.role,
        name: payload.name,
      };

      // If roles were passed, enforce role-based access
      if (Array.isArray(roles) && roles.length > 0) {
        if (!roles.includes(req.user.role)) {
          return res.status(403).json({ message: 'Forbidden: insufficient role' });
        }
      }

      return next();
    } catch (err) {
      // Token invalid or expired
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  };
};

export const authRequired = authenticate;
