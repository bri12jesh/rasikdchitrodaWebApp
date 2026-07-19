import express from "express";
import path from "path";
import fs from "fs";
import multer from "multer";
import dotenv from "dotenv";
import pg from "pg";
import ImageKit from "imagekit";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded files statically
app.use("/uploads", express.static(uploadsDir));

// Multer Storage Configuration for Local Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Admin Password
const ADMIN_PASSWORD = "Bri@12JesH";

// ImageKit Configuration & Lazy Initializer
let imagekitInstance: ImageKit | null = null;
function getImageKitInstance(): ImageKit {
  if (!imagekitInstance) {
    const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

    if (!publicKey || !privateKey || !urlEndpoint) {
      throw new Error(
        "ImageKit environment variables (IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, and IMAGEKIT_URL_ENDPOINT) are missing. Please configure them in setup."
      );
    }

    imagekitInstance = new ImageKit({
      publicKey,
      privateKey,
      urlEndpoint
    });
  }
  return imagekitInstance;
}

// PostgreSQL Connection Pool Variables
let pool: pg.Pool | null = null;
let isUsingFallback = true;

// Fallback in-memory/JSON DB storage
let fallbackDB: { products: any[]; projects: any[] } = {
  products: [],
  projects: []
};
const fallbackDBFile = path.join(process.cwd(), "db-fallback.json");

// Handle fallback JSON DB file
function readFallback() {
  try {
    if (fs.existsSync(fallbackDBFile)) {
      fallbackDB = JSON.parse(fs.readFileSync(fallbackDBFile, "utf-8"));
    }
  } catch (err) {
    console.error("Error reading fallback JSON DB:", err);
  }
}

function writeFallback() {
  try {
    fs.writeFileSync(fallbackDBFile, JSON.stringify(fallbackDB, null, 2));
  } catch (err) {
    console.error("Error writing fallback JSON DB:", err);
  }
}

// Database Initialization
async function initDatabase() {
  const hasConnectionString = !!process.env.DATABASE_URL;
  const hasDiscreteConfig = !!(
    (process.env.POSTGRES_HOST || process.env.PGHOST) &&
    (process.env.POSTGRES_USER || process.env.PGUSER) &&
    (process.env.POSTGRES_PASSWORD || process.env.PGPASSWORD) &&
    (process.env.POSTGRES_DATABASE || process.env.PGDATABASE)
  );

  if (!hasConnectionString && !hasDiscreteConfig) {
    console.log("[RASIK D CHITRODA] PostgreSQL/Neon env variables not detected. Running on local JSON fallback database.");
    isUsingFallback = true;
    readFallback();
    return;
  }

  try {
    const sslOption = process.env.POSTGRES_SSL === "false" || process.env.PG_SSL === "false"
      ? false
      : { rejectUnauthorized: false };

    if (hasConnectionString) {
      pool = new pg.Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: sslOption,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      });
    } else {
      const dbHost = process.env.POSTGRES_HOST || process.env.PGHOST;
      const dbPort = parseInt((process.env.POSTGRES_PORT || process.env.PGPORT) || "5432", 10);
      const dbUser = process.env.POSTGRES_USER || process.env.PGUSER;
      const dbPassword = process.env.POSTGRES_PASSWORD || process.env.PGPASSWORD;
      const dbDatabase = process.env.POSTGRES_DATABASE || process.env.PGDATABASE;

      pool = new pg.Pool({
        host: dbHost,
        port: dbPort,
        user: dbUser,
        password: dbPassword,
        database: dbDatabase,
        ssl: sslOption,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      });
    }

    console.log("[RASIK D CHITRODA] Neon Postgres database connection pool created successfully.");

    // Create tables (Standard PostgreSQL syntax)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        price_min DECIMAL(12, 2),
        price_max DECIMAL(12, 2),
        description TEXT,
        image_url VARCHAR(1024),
        key_features TEXT,
        specs TEXT
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        description TEXT,
        image_url VARCHAR(1024),
        client VARCHAR(255),
        location VARCHAR(255),
        completed_year INT,
        contract_type VARCHAR(100),
        gallery_urls TEXT
      );
    `);

    console.log("[RASIK D CHITRODA] Neon Postgres tables verified or created successfully.");
    isUsingFallback = false;

  } catch (err: any) {
    console.error("[RASIK D CHITRODA] Failed to connect/initialize Neon Postgres database. Switching to local JSON storage system.", err);
    isUsingFallback = true;
    readFallback();
  }
}

initDatabase();

// --- API ENDPOINTS ---

// Dynamic SEO Friendly XML Sitemap generator matching current preview/deployment host
app.get("/sitemap.xml", (req, res) => {
  const host = req.get("host") || "rasik-chitroda-furniture.com";
  // Determine protocol (supporting cloud proxy SSL)
  const isSecure = req.secure || req.headers["x-forwarded-proto"] === "https";
  const protocol = isSecure ? "https" : "http";
  const baseUrl = `${protocol}://${host}`;

  res.header("Content-Type", "application/xml");
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Dynamic Sitemaps generated on-the-fly for Rasik D Chitroda Furniture -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>2026-06-04</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/#products</loc>
    <lastmod>2026-06-04</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/#projects</loc>
    <lastmod>2026-06-04</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/#about</loc>
    <lastmod>2026-06-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/#contact</loc>
    <lastmod>2026-06-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>`);
});

// Admin login
app.post("/api/login", (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true, token: "admin-session-rasik-d-chitroda-992288" });
  } else {
    res.status(401).json({ success: false, message: "Invalid administrator password. Access denied." });
  }
});

// GET all products
app.get("/api/products", async (req, res) => {
  try {
    if (isUsingFallback || !pool) {
      const parsedProducts = fallbackDB.products.map(p => ({
        ...p,
        key_features: typeof p.key_features === "string" ? JSON.parse(p.key_features) : (p.key_features || []),
        specs: typeof p.specs === "string" ? JSON.parse(p.specs) : (p.specs || {})
      }));
      res.json(parsedProducts);
    } else {
      const result = await pool.query("SELECT * FROM products ORDER BY id DESC");
      const formattedRows = result.rows.map((r: any) => ({
        ...r,
        price_min: r.price_min ? Number(r.price_min) : null,
        price_max: r.price_max ? Number(r.price_max) : null,
        key_features: r.key_features ? (typeof r.key_features === "string" ? JSON.parse(r.key_features) : r.key_features) : [],
        specs: r.specs ? (typeof r.specs === "string" ? JSON.parse(r.specs) : r.specs) : {}
      }));
      res.json(formattedRows);
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST key product (admin protected)
app.post("/api/products", async (req, res) => {
  const { auth, title, category, price_min, price_max, description, image_url, key_features, specs } = req.body;
  if (auth !== "admin-session-rasik-d-chitroda-992288") {
    return res.status(403).json({ error: "Unauthorized access" });
  }

  try {
    const kfString = typeof key_features === "string" ? key_features : JSON.stringify(key_features || []);
    const specString = typeof specs === "string" ? specs : JSON.stringify(specs || {});

    if (isUsingFallback || !pool) {
      const newProduct = {
        id: Date.now(),
        title,
        category,
        price_min: price_min ? Number(price_min) : null,
        price_max: price_max ? Number(price_max) : null,
        description,
        image_url,
        key_features: JSON.parse(kfString),
        specs: JSON.parse(specString)
      };
      fallbackDB.products.push(newProduct);
      writeFallback();
      res.json(newProduct);
    } else {
      const result = await pool.query(
        `INSERT INTO products (title, category, price_min, price_max, description, image_url, key_features, specs) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
        [title, category, price_min ? Number(price_min) : null, price_max ? Number(price_max) : null, description, image_url, kfString, specString]
      );
      const insertedId = result.rows[0].id;
      res.json({ id: insertedId, title, category });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE product (admin protected)
app.delete("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  const auth = req.headers.authorization;
  if (auth !== "admin-session-rasik-d-chitroda-992288") {
    return res.status(403).json({ error: "Unauthorized access" });
  }

  try {
    if (isUsingFallback || !pool) {
      fallbackDB.products = fallbackDB.products.filter(p => p.id !== Number(id));
      writeFallback();
      res.json({ success: true });
    } else {
      await pool.query("DELETE FROM products WHERE id = $1", [id]);
      res.json({ success: true });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update product (admin protected)
app.put("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  const { auth, title, category, price_min, price_max, description, image_url, key_features, specs } = req.body;
  const incomingAuth = auth || req.headers.authorization;
  if (incomingAuth !== "admin-session-rasik-d-chitroda-992288") {
    return res.status(403).json({ error: "Unauthorized access" });
  }

  try {
    const kfString = typeof key_features === "string" ? key_features : JSON.stringify(key_features || []);
    const specString = typeof specs === "string" ? specs : JSON.stringify(specs || {});

    if (isUsingFallback || !pool) {
      const idx = fallbackDB.products.findIndex(p => p.id === Number(id));
      if (idx > -1) {
        fallbackDB.products[idx] = {
          ...fallbackDB.products[idx],
          title,
          category,
          price_min: price_min ? Number(price_min) : null,
          price_max: price_max ? Number(price_max) : null,
          description,
          image_url,
          key_features: JSON.parse(kfString),
          specs: JSON.parse(specString)
        };
        writeFallback();
        res.json(fallbackDB.products[idx]);
      } else {
        res.status(404).json({ error: "Product not found" });
      }
    } else {
      await pool.query(
        `UPDATE products SET title = $1, category = $2, price_min = $3, price_max = $4, description = $5, image_url = $6, key_features = $7, specs = $8
         WHERE id = $9`,
        [title, category, price_min ? Number(price_min) : null, price_max ? Number(price_max) : null, description, image_url, kfString, specString, id]
      );
      res.json({ id: Number(id), title, category });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET all projects
app.get("/api/projects", async (req, res) => {
  try {
    if (isUsingFallback || !pool) {
      const formatted = fallbackDB.projects.map(p => ({
        ...p,
        gallery_urls: typeof p.gallery_urls === 'string' ? JSON.parse(p.gallery_urls) : (p.gallery_urls || [])
      }));
      res.json(formatted);
    } else {
      const result = await pool.query("SELECT * FROM projects ORDER BY id DESC");
      const formatted = result.rows.map((r: any) => {
        let gall: string[] = [];
        try {
          gall = r.gallery_urls ? (typeof r.gallery_urls === "string" ? JSON.parse(r.gallery_urls) : r.gallery_urls) : [];
        } catch (e) {
          // ignore error
        }
        return {
          ...r,
          gallery_urls: gall
        };
      });
      res.json(formatted);
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST a project (admin protected)
app.post("/api/projects", async (req, res) => {
  const { auth, title, category, description, image_url, client, location, completed_year, contract_type, gallery_urls } = req.body;
  if (auth !== "admin-session-rasik-d-chitroda-992288") {
    return res.status(403).json({ error: "Unauthorized access" });
  }

  try {
    const galleryString = typeof gallery_urls === "string" ? gallery_urls : JSON.stringify(gallery_urls || []);

    if (isUsingFallback || !pool) {
      const newProj = {
        id: Date.now(),
        title,
        category,
        description,
        image_url,
        client,
        location,
        completed_year: completed_year ? Number(completed_year) : null,
        contract_type,
        gallery_urls: JSON.parse(galleryString)
      };
      fallbackDB.projects.push(newProj);
      writeFallback();
      res.json(newProj);
    } else {
      const result = await pool.query(
        `INSERT INTO projects (title, category, description, image_url, client, location, completed_year, contract_type, gallery_urls) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
        [title, category, description, image_url, client, location, completed_year ? Number(completed_year) : null, contract_type, galleryString]
      );
      const insertedId = result.rows[0].id;
      res.json({ id: insertedId, title, category, gallery_urls: JSON.parse(galleryString) });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update project (admin protected)
app.put("/api/projects/:id", async (req, res) => {
  const { id } = req.params;
  const { auth, title, category, description, image_url, client, location, completed_year, contract_type, gallery_urls } = req.body;
  const incomingAuth = auth || req.headers.authorization;
  if (incomingAuth !== "admin-session-rasik-d-chitroda-992288") {
    return res.status(403).json({ error: "Unauthorized access" });
  }

  try {
    const galleryString = typeof gallery_urls === "string" ? gallery_urls : JSON.stringify(gallery_urls || []);

    if (isUsingFallback || !pool) {
      const idx = fallbackDB.projects.findIndex(p => p.id === Number(id));
      if (idx > -1) {
        fallbackDB.projects[idx] = {
          ...fallbackDB.projects[idx],
          title,
          category,
          description,
          image_url,
          client,
          location,
          completed_year: completed_year ? Number(completed_year) : null,
          contract_type,
          gallery_urls: JSON.parse(galleryString)
        };
        writeFallback();
        res.json(fallbackDB.projects[idx]);
      } else {
        res.status(404).json({ error: "Project not found" });
      }
    } else {
      await pool.query(
        `UPDATE projects SET title = $1, category = $2, description = $3, image_url = $4, client = $5, location = $6, completed_year = $7, contract_type = $8, gallery_urls = $9
         WHERE id = $10`,
        [title, category, description, image_url, client, location, completed_year ? Number(completed_year) : null, contract_type, galleryString, id]
      );
      res.json({ id: Number(id), title, category, gallery_urls: JSON.parse(galleryString) });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE project (admin protected)
app.delete("/api/projects/:id", async (req, res) => {
  const { id } = req.params;
  const auth = req.headers.authorization;
  if (auth !== "admin-session-rasik-d-chitroda-992288") {
    return res.status(403).json({ error: "Unauthorized access" });
  }

  try {
    if (isUsingFallback || !pool) {
      fallbackDB.projects = fallbackDB.projects.filter(p => p.id !== Number(id));
      writeFallback();
      res.json({ success: true });
    } else {
      await pool.query("DELETE FROM projects WHERE id = $1", [id]);
      res.json({ success: true });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Single image upload directly to ImageKit
app.post("/api/upload", upload.any(), async (req, res) => {
  let file: Express.Multer.File | undefined = undefined;
  try {
    const files = req.files as Express.Multer.File[];
    file = req.file || (files && files[0]);
    if (!file) {
      return res.status(400).json({ error: "No physical file was uploaded." });
    }

    const ik = getImageKitInstance();
    const fileContent = fs.readFileSync(file.path);
    const result = await ik.upload({
      file: fileContent,
      fileName: file.filename || file.originalname,
      folder: "/rasik_d_chitroda_furniture"
    });

    // Cleanup local temp file
    try {
      fs.unlinkSync(file.path);
    } catch (err) {
      console.error("Failed to delete temp file:", err);
    }

    return res.json({ url: result.url });
  } catch (err: any) {
    console.error("ImageKit upload error:", err);
    // Cleanup on error
    if (file && file.path && fs.existsSync(file.path)) {
      try { fs.unlinkSync(file.path); } catch (e) { }
    }
    return res.status(500).json({ error: err.message || "ImageKit upload failed" });
  }
});

// Bulk/multiple image upload directly to ImageKit
app.post("/api/upload-bulk", upload.any(), async (req, res) => {
  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0) {
    return res.status(400).json({ error: "No physical files were uploaded." });
  }

  const urls: string[] = [];
  try {
    const ik = getImageKitInstance();
    for (const file of files) {
      const fileContent = fs.readFileSync(file.path);
      const result = await ik.upload({
        file: fileContent,
        fileName: file.filename || file.originalname,
        folder: "/rasik_d_chitroda_furniture"
      });

      urls.push(result.url);

      // Cleanup local temp file
      try {
        fs.unlinkSync(file.path);
      } catch (err) {
        console.error("Failed to delete temp file:", err);
      }
    }

    return res.json({
      urls,
      success: true
    });
  } catch (err: any) {
    console.error("ImageKit bulk upload error:", err);
    // Cleanup any remaining files on error
    for (const file of files) {
      if (file.path && fs.existsSync(file.path)) {
        try { fs.unlinkSync(file.path); } catch (e) { }
      }
    }
    return res.status(500).json({ error: err.message || "ImageKit bulk upload failed" });
  }
});

// Static setup & Vite handling for frontend
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[RASIK D CHITRODA] Furniture Manufacturing server is running on http://localhost:${PORT}`);
  });
}

startServer();
