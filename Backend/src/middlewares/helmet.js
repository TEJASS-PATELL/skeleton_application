import helmet from "helmet";

const helmetConfig = helmet({
  contentSecurityPolicy: false, 
  crossOriginEmbedderPolicy: false,
  referrerPolicy: { policy: "no-referrer" },
  hsts: { maxAge: 31536000, includeSubDomains: true },
});

export default helmetConfig;
