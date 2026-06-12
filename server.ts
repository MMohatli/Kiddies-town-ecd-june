import express from "express";
import path from "path";
import dotenv from "dotenv";
import { neon } from "@neondatabase/serverless";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

// Standard Mock Data for seeding / fallback
import { 
  initialLearners, initialParentProfile, initialProgressReports, 
  initialPaymentHistory, initialChatHistory, initialWeeklyThemes, 
  initialSchoolEvents, initialJournalPosts, initialEnrolments 
} from "./src/data/mockData";
import { generateGuidePDF } from "./src/lib/generatePdf";

const app = express();
const PORT = 3000;

app.use(express.json());

// Memory-based state store for fallback/caching if NeonDB is not available or hasn't been initialized
const fallbackStore = {
  learners: [...initialLearners],
  parentProfile: { ...initialParentProfile },
  progressReports: [...initialProgressReports],
  paymentHistory: [...initialPaymentHistory],
  chatHistory: [...initialChatHistory],
  themes: [...initialWeeklyThemes],
  events: [...initialSchoolEvents],
  journalPosts: [...initialJournalPosts],
  enrolments: [...initialEnrolments],
};

let usingNeon = false;
let sqlConnection: any = null;

// Initialize Neon SQL driver
const dbUrl = process.env.DATABASE_URL;
if (dbUrl) {
  try {
    sqlConnection = neon(dbUrl);
    usingNeon = true;
    console.log("⚡ Neon Database URL found! Initiating cloud tables...");
  } catch (err) {
    console.error("❌ Failed to initialize Neon client:", err);
    usingNeon = false;
  }
} else {
  console.log("⚠️ No DATABASE_URL found in environment. Booting in Demo Cache Mode.");
}

// Table structures
// For simplicity and maximum compatibility, we use tables with an id and a json_data column
const TABLES = {
  learners: "kt_learners",
  parentProfile: "kt_parent_profile",
  reports: "kt_progress_reports",
  payments: "kt_payments",
  chats: "kt_chats",
  themes: "kt_weekly_themes",
  events: "kt_school_events",
  journal: "kt_journal_posts",
  enrolments: "kt_enrolments",
};

// Auto schema bootstrap helper
async function bootstrapSchema() {
  if (!usingNeon || !sqlConnection) return;

  try {
    // 1. Create tables
    await sqlConnection(`
      CREATE TABLE IF NOT EXISTS ${TABLES.learners} (
        id VARCHAR(120) PRIMARY KEY,
        data JSONB NOT NULL
      )
    `);

    await sqlConnection(`
      CREATE TABLE IF NOT EXISTS ${TABLES.parentProfile} (
        id VARCHAR(120) PRIMARY KEY,
        data JSONB NOT NULL
      )
    `);

    await sqlConnection(`
      CREATE TABLE IF NOT EXISTS ${TABLES.reports} (
        id VARCHAR(120) PRIMARY KEY,
        data JSONB NOT NULL
      )
    `);

    await sqlConnection(`
      CREATE TABLE IF NOT EXISTS ${TABLES.payments} (
        id VARCHAR(120) PRIMARY KEY,
        data JSONB NOT NULL
      )
    `);

    await sqlConnection(`
      CREATE TABLE IF NOT EXISTS ${TABLES.chats} (
        id VARCHAR(120) PRIMARY KEY,
        data JSONB NOT NULL
      )
    `);

    await sqlConnection(`
      CREATE TABLE IF NOT EXISTS ${TABLES.themes} (
        id INTEGER PRIMARY KEY,
        data JSONB NOT NULL
      )
    `);

    await sqlConnection(`
      CREATE TABLE IF NOT EXISTS ${TABLES.events} (
        id VARCHAR(120) PRIMARY KEY,
        data JSONB NOT NULL
      )
    `);

    await sqlConnection(`
      CREATE TABLE IF NOT EXISTS ${TABLES.journal} (
        id VARCHAR(120) PRIMARY KEY,
        data JSONB NOT NULL
      )
    `);

    await sqlConnection(`
      CREATE TABLE IF NOT EXISTS ${TABLES.enrolments} (
        id VARCHAR(120) PRIMARY KEY,
        data JSONB NOT NULL
      )
    `);

    console.log("✅ Neon DB schema tables verified.");

    // 2. Perform seeds if empty
    const checkLearners = await sqlConnection(`SELECT count(*) FROM ${TABLES.learners}`);
    if (parseInt(checkLearners[0].count) === 0) {
      console.log("🌱 Database is empty! Seeding initial school records into NeonDB...");

      // Seed learners
      for (const item of initialLearners) {
        await sqlConnection(`INSERT INTO ${TABLES.learners} (id, data) VALUES ($1, $2)`, [item.id, JSON.stringify(item)]);
      }

      // Seed parent profile
      await sqlConnection(`INSERT INTO ${TABLES.parentProfile} (id, data) VALUES ($1, $2)`, ["default", JSON.stringify(initialParentProfile)]);

      // Seed reports
      for (const item of initialProgressReports) {
        await sqlConnection(`INSERT INTO ${TABLES.reports} (id, data) VALUES ($1, $2)`, [item.id, JSON.stringify(item)]);
      }

      // Seed payments
      for (const item of initialPaymentHistory) {
        await sqlConnection(`INSERT INTO ${TABLES.payments} (id, data) VALUES ($1, $2)`, [item.id, JSON.stringify(item)]);
      }

      // Seed chats
      for (const item of initialChatHistory) {
        await sqlConnection(`INSERT INTO ${TABLES.chats} (id, data) VALUES ($1, $2)`, [item.id, JSON.stringify(item)]);
      }

      // Seed themes
      for (const item of initialWeeklyThemes) {
        await sqlConnection(`INSERT INTO ${TABLES.themes} (id, data) VALUES ($1, $2)`, [item.weekNo, JSON.stringify(item)]);
      }

      // Seed events
      for (const item of initialSchoolEvents) {
        await sqlConnection(`INSERT INTO ${TABLES.events} (id, data) VALUES ($1, $2)`, [item.id, JSON.stringify(item)]);
      }

      // Seed journal posts
      for (const item of initialJournalPosts) {
        await sqlConnection(`INSERT INTO ${TABLES.journal} (id, data) VALUES ($1, $2)`, [item.id, JSON.stringify(item)]);
      }

      // Seed enrolments
      for (const item of initialEnrolments) {
        await sqlConnection(`INSERT INTO ${TABLES.enrolments} (id, data) VALUES ($1, $2)`, [item.id, JSON.stringify(item)]);
      }

      console.log("🎉 Seed completion dynamic values uploaded to NeonDB.");
    }

  } catch (error) {
    console.error("⚠️ Error while bootstrapping database tables or seeding:", error);
    // Graceful reset of flag if bootstrap queries failed (e.g., connection issue / invalid credentials)
    usingNeon = false;
  }
}

// Run bootstrap asynchronously
bootstrapSchema();

// --- REST API ENDPOINTS ---

// GET: Generate and Stream Step-by-Step Curriculum Guide PDF
app.get("/api/guide/download-pdf", async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="Kiddies_Town_Development_Guide.pdf"');
    await generateGuidePDF(res);
  } catch (err: any) {
    console.error("Failed to generate curriculum PDF:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Could not generate educational PDF document" });
    }
  }
});

// GET: All active dashboard collections
app.get("/api/all-data", async (req, res) => {
  if (usingNeon && sqlConnection) {
    try {
      const dbLearners = await sqlConnection(`SELECT data FROM ${TABLES.learners}`);
      const dbProfile = await sqlConnection(`SELECT data FROM ${TABLES.parentProfile} WHERE id = $1`, ["default"]);
      const dbReports = await sqlConnection(`SELECT data FROM ${TABLES.reports}`);
      const dbPayments = await sqlConnection(`SELECT data FROM ${TABLES.payments}`);
      const dbChats = await sqlConnection(`SELECT data FROM ${TABLES.chats}`);
      const dbThemes = await sqlConnection(`SELECT data FROM ${TABLES.themes}`);
      const dbEvents = await sqlConnection(`SELECT data FROM ${TABLES.events}`);
      const dbJournal = await sqlConnection(`SELECT data FROM ${TABLES.journal}`);
      const dbEnrolments = await sqlConnection(`SELECT data FROM ${TABLES.enrolments}`);

      // Parse JSON fields row-by-row
      const learners = dbLearners.map((r: any) => typeof r.data === 'string' ? JSON.parse(r.data) : r.data);
      const parentProfile = dbProfile[0] ? (typeof dbProfile[0].data === 'string' ? JSON.parse(dbProfile[0].data) : dbProfile[0].data) : fallbackStore.parentProfile;
      const progressReports = dbReports.map((r: any) => typeof r.data === 'string' ? JSON.parse(r.data) : r.data);
      const paymentHistory = dbPayments.map((r: any) => typeof r.data === 'string' ? JSON.parse(r.data) : r.data);
      
      // Sort chats by date or reconstruct sequence
      const chatHistory = dbChats.map((r: any) => typeof r.data === 'string' ? JSON.parse(r.data) : r.data);
      
      const themes = dbThemes.map((r: any) => typeof r.data === 'string' ? JSON.parse(r.data) : r.data)
                               .sort((a: any, b: any) => a.weekNo - b.weekNo);
      const events = dbEvents.map((r: any) => typeof r.data === 'string' ? JSON.parse(r.data) : r.data);
      const journalPosts = dbJournal.map((r: any) => typeof r.data === 'string' ? JSON.parse(r.data) : r.data);
      const enrolments = dbEnrolments.map((r: any) => typeof r.data === 'string' ? JSON.parse(r.data) : r.data);

      return res.json({
        learners,
        parentProfile,
        progressReports,
        paymentHistory,
        chatHistory,
        themes,
        events,
        journalPosts,
        enrolments,
        usingNeon: true,
      });
    } catch (err) {
      console.error("🔴 Connection or query failed in Neon. Emitting local state fallback...", err);
    }
  }

  // Fallback to memory store
  res.json({
    ...fallbackStore,
    usingNeon: false,
  });
});

// POST endpoints for updating different collections
app.post("/api/learners", async (req, res) => {
  const learner = req.body;
  if (!learner || !learner.id) {
    return res.status(400).json({ error: "Learner missing ID property" });
  }

  if (usingNeon && sqlConnection) {
    try {
      await sqlConnection(`
        INSERT INTO ${TABLES.learners} (id, data) 
        VALUES ($1, $2)
        ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data
      `, [learner.id, JSON.stringify(learner)]);
      return res.json({ success: true, usingNeon: true });
    } catch (err) {
      console.error("Neon write fail:", err);
    }
  }

  // Fallback memory state update
  const index = fallbackStore.learners.findIndex(l => l.id === learner.id);
  if (index >= 0) {
    fallbackStore.learners[index] = learner;
  } else {
    fallbackStore.learners.push(learner);
  }
  res.json({ success: true, usingNeon: false });
});

app.post("/api/parent-profile", async (req, res) => {
  const parentProfile = req.body;
  if (usingNeon && sqlConnection) {
    try {
      await sqlConnection(`
        INSERT INTO ${TABLES.parentProfile} (id, data)
        VALUES ($1, $2)
        ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data
      `, ["default", JSON.stringify(parentProfile)]);
      return res.json({ success: true, usingNeon: true });
    } catch (err) {
      console.error("Neon write fail:", err);
    }
  }

  fallbackStore.parentProfile = parentProfile;
  res.json({ success: true, usingNeon: false });
});

app.post("/api/progress-reports", async (req, res) => {
  const report = req.body;
  if (!report || !report.id) {
    return res.status(400).json({ error: "Report missing ID coordinate" });
  }

  if (usingNeon && sqlConnection) {
    try {
      await sqlConnection(`
        INSERT INTO ${TABLES.reports} (id, data)
        VALUES ($1, $2)
        ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data
      `, [report.id, JSON.stringify(report)]);
      return res.json({ success: true, usingNeon: true });
    } catch (err) {
      console.error("Neon write fail:", err);
    }
  }

  const index = fallbackStore.progressReports.findIndex(r => r.id === report.id);
  if (index >= 0) {
    fallbackStore.progressReports[index] = report;
  } else {
    fallbackStore.progressReports.push(report);
  }
  res.json({ success: true, usingNeon: false });
});

app.post("/api/payments", async (req, res) => {
  const payment = req.body;
  if (!payment || !payment.id) {
    return res.status(400).json({ error: "Payment object missing unique ID" });
  }

  if (usingNeon && sqlConnection) {
    try {
      await sqlConnection(`
        INSERT INTO ${TABLES.payments} (id, data)
        VALUES ($1, $2)
        ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data
      `, [payment.id, JSON.stringify(payment)]);
      return res.json({ success: true, usingNeon: true });
    } catch (err) {
      console.error("Neon write fail:", err);
    }
  }

  fallbackStore.paymentHistory = [payment, ...fallbackStore.paymentHistory];
  res.json({ success: true, usingNeon: false });
});

app.post("/api/chats", async (req, res) => {
  const chatMessage = req.body;
  if (!chatMessage || !chatMessage.id) {
    return res.status(400).json({ error: "Chat message missing identification index" });
  }

  if (usingNeon && sqlConnection) {
    try {
      await sqlConnection(`
        INSERT INTO ${TABLES.chats} (id, data)
        VALUES ($1, $2)
        ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data
      `, [chatMessage.id, JSON.stringify(chatMessage)]);
      return res.json({ success: true, usingNeon: true });
    } catch (err) {
      console.error("Neon write fail:", err);
    }
  }

  fallbackStore.chatHistory = [...fallbackStore.chatHistory, chatMessage];
  res.json({ success: true, usingNeon: false });
});

app.post("/api/events", async (req, res) => {
  const event = req.body;
  if (!event || !event.id) {
    return res.status(400).json({ error: "SchoolEvent missing key ID" });
  }

  if (usingNeon && sqlConnection) {
    try {
      await sqlConnection(`
        INSERT INTO ${TABLES.events} (id, data)
        VALUES ($1, $2)
        ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data
      `, [event.id, JSON.stringify(event)]);
      return res.json({ success: true, usingNeon: true });
    } catch (err) {
      console.error("Neon write fail:", err);
    }
  }

  const index = fallbackStore.events.findIndex(e => e.id === event.id);
  if (index >= 0) {
    fallbackStore.events[index] = event;
  } else {
    fallbackStore.events.push(event);
  }
  res.json({ success: true, usingNeon: false });
});

app.post("/api/themes", async (req, res) => {
  const theme = req.body;
  if (!theme || typeof theme.weekNo !== 'number') {
    return res.status(400).json({ error: "WeeklyTheme missing valid weekNo argument." });
  }

  if (usingNeon && sqlConnection) {
    try {
      await sqlConnection(`
        INSERT INTO ${TABLES.themes} (id, data)
        VALUES ($1, $2)
        ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data
      `, [theme.weekNo, JSON.stringify(theme)]);
      return res.json({ success: true, usingNeon: true });
    } catch (err) {
      console.error("Neon write fail:", err);
    }
  }

  fallbackStore.themes = [theme, ...fallbackStore.themes];
  res.json({ success: true, usingNeon: false });
});

app.post("/api/journal", async (req, res) => {
  const post = req.body;
  if (!post || !post.id) {
    return res.status(400).json({ error: "JournalPost missing index metadata." });
  }

  if (usingNeon && sqlConnection) {
    try {
      await sqlConnection(`
        INSERT INTO ${TABLES.journal} (id, data)
        VALUES ($1, $2)
        ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data
      `, [post.id, JSON.stringify(post)]);
      return res.json({ success: true, usingNeon: true });
    } catch (err) {
      console.error("Neon write fail:", err);
    }
  }

  fallbackStore.journalPosts = [post, ...fallbackStore.journalPosts];
  res.json({ success: true, usingNeon: false });
});

app.post("/api/enrolments", async (req, res) => {
  const application = req.body;
  if (!application || !application.id) {
    return res.status(400).json({ error: "EnrolmentApplication missing unique payload id." });
  }

  if (usingNeon && sqlConnection) {
    try {
      await sqlConnection(`
        INSERT INTO ${TABLES.enrolments} (id, data)
        VALUES ($1, $2)
        ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data
      `, [application.id, JSON.stringify(application)]);
      return res.json({ success: true, usingNeon: true });
    } catch (err) {
      console.error("Neon write fail:", err);
    }
  }

  const index = fallbackStore.enrolments.findIndex(e => e.id === application.id);
  if (index >= 0) {
    fallbackStore.enrolments[index] = application;
  } else {
    fallbackStore.enrolments = [application, ...fallbackStore.enrolments];
  }
  res.json({ success: true, usingNeon: false });
});


// Dev & Production serving middlewares logic
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
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
    console.log(`🚀 Kiddies Town Academy server running on http://localhost:${PORT}`);
  });
}

startServer();
