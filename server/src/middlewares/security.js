import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import hpp from "hpp";
// import sanitizeHtml from "sanitize-html";

// function sanitizeInputs(req, _res, next) {
//   const sanitize = (obj) => {
//     if (!obj || typeof obj !== "object") return;
//     for (const key in obj) {
//       if (typeof obj[key] === "string") {
//         // remove any HTML/JS injection
//         obj[key] = sanitizeHtml(obj[key], { allowedTags: [], allowedAttributes: {} });
//       } else if (typeof obj[key] === "object") {
//         sanitize(obj[key]); // recursively sanitize nested objects
//       }
//     }
//   };
//   sanitize(req.body);
//   sanitize(req.query);
//   sanitize(req.params);
//   next();
// }

export function applySecurity(app, origin) {
  app.use(helmet());
  app.use(
    cors({
      origin,
      credentials: true,
      methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );
  app.use(compression());
  app.use(hpp());
}
