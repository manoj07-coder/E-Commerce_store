import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import hpp from "hpp";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";

export function applySecurity(app, origin) {
  app.use(helmet());
  app.use(cors({ origin, credentials: true }));
  app.use(compression());
  app.use(hpp());
  app.use(xss());
  app.use(mongoSanitize());
}
