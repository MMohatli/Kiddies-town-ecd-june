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
import { ProgressReport } from "./src/types";
import { generateGuidePDF } from "./src/lib/generatePdf";

const app = express();
const PORT = 3000;

app.use(express.json());

const initialUsers = [
  { id: "parent@kiddiestown.co.za", email: "parent@kiddiestown.co.za", password: "parent", role: "parent", name: "Sarah Mbeki" },
  { id: "teacher@kiddiestown.co.za", email: "teacher@kiddiestown.co.za", password: "teacher", role: "teacher", name: "Teacher Anne" },
  { id: "admin@kiddiestown.co.za", email: "admin@kiddiestown.co.za", password: "admin", role: "admin", name: "Shineon M." }
];

// Memory-based state store for fallback/caching if NeonDB is not available or hasn't been initialized
const fallbackStore = {
  learners: initialLearners.map((l: any) => l.id === 'student-leo' ? { ...l, parentEmail: 'parent@kiddiestown.co.za' } : l),
  parentProfile: { ...initialParentProfile, email: 'parent@kiddiestown.co.za' },
  parentProfiles: { "parent@kiddiestown.co.za": { ...initialParentProfile, email: 'parent@kiddiestown.co.za' } } as Record<string, any>,
  progressReports: [...initialProgressReports],
  paymentHistory: initialPaymentHistory.map((p: any) => ({ ...p, parentEmail: 'parent@kiddiestown.co.za' })),
  chatHistory: initialChatHistory.map((c: any) => ({ ...c, parentEmail: 'parent@kiddiestown.co.za' })),
  themes: [...initialWeeklyThemes],
  events: [...initialSchoolEvents],
  journalPosts: [...initialJournalPosts],
  enrolments: [...initialEnrolments],
  users: [...initialUsers],
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
  users: "kt_users",
};

// Auto schema bootstrap helper
async function bootstrapSchema() {
  if (!usingNeon || !sqlConnection) return;

  try {
    // 1. Create tables
    await sqlConnection.query(`
      CREATE TABLE IF NOT EXISTS ${TABLES.learners} (
        id VARCHAR(120) PRIMARY KEY,
        data JSONB NOT NULL
      )
    `);

    await sqlConnection.query(`
      CREATE TABLE IF NOT EXISTS ${TABLES.parentProfile} (
        id VARCHAR(120) PRIMARY KEY,
        data JSONB NOT NULL
      )
    `);

    await sqlConnection.query(`
      CREATE TABLE IF NOT EXISTS ${TABLES.reports} (
        id VARCHAR(120) PRIMARY KEY,
        data JSONB NOT NULL
      )
    `);

    await sqlConnection.query(`
      CREATE TABLE IF NOT EXISTS ${TABLES.payments} (
        id VARCHAR(120) PRIMARY KEY,
        data JSONB NOT NULL
      )
    `);

    await sqlConnection.query(`
      CREATE TABLE IF NOT EXISTS ${TABLES.chats} (
        id VARCHAR(120) PRIMARY KEY,
        data JSONB NOT NULL
      )
    `);

    await sqlConnection.query(`
      CREATE TABLE IF NOT EXISTS ${TABLES.themes} (
        id INTEGER PRIMARY KEY,
        data JSONB NOT NULL
      )
    `);

    await sqlConnection.query(`
      CREATE TABLE IF NOT EXISTS ${TABLES.events} (
        id VARCHAR(120) PRIMARY KEY,
        data JSONB NOT NULL
      )
    `);

    await sqlConnection.query(`
      CREATE TABLE IF NOT EXISTS ${TABLES.journal} (
        id VARCHAR(120) PRIMARY KEY,
        data JSONB NOT NULL
      )
    `);

    await sqlConnection.query(`
      CREATE TABLE IF NOT EXISTS ${TABLES.enrolments} (
        id VARCHAR(120) PRIMARY KEY,
        data JSONB NOT NULL
      )
    `);

    await sqlConnection.query(`
      CREATE TABLE IF NOT EXISTS ${TABLES.users} (
        id VARCHAR(120) PRIMARY KEY,
        data JSONB NOT NULL
      )
    `);

    console.log("✅ Neon DB schema tables verified.");

    // 2. Perform seeds if empty
    const checkLearners = await sqlConnection.query(`SELECT count(*) FROM ${TABLES.learners}`);
    if (parseInt(checkLearners[0].count) === 0) {
      console.log("🌱 Database is empty! Seeding initial school records into NeonDB...");

      // Seed learners
      for (const item of initialLearners) {
        await sqlConnection.query(`INSERT INTO ${TABLES.learners} (id, data) VALUES ($1, $2)`, [item.id, JSON.stringify(item)]);
      }

      // Seed parent profile
      await sqlConnection.query(`INSERT INTO ${TABLES.parentProfile} (id, data) VALUES ($1, $2)`, ["default", JSON.stringify(initialParentProfile)]);

      // Seed reports
      for (const item of initialProgressReports) {
        await sqlConnection.query(`INSERT INTO ${TABLES.reports} (id, data) VALUES ($1, $2)`, [item.id, JSON.stringify(item)]);
      }

      // Seed payments
      for (const item of initialPaymentHistory) {
        await sqlConnection.query(`INSERT INTO ${TABLES.payments} (id, data) VALUES ($1, $2)`, [item.id, JSON.stringify(item)]);
      }

      // Seed chats
      for (const item of initialChatHistory) {
        await sqlConnection.query(`INSERT INTO ${TABLES.chats} (id, data) VALUES ($1, $2)`, [item.id, JSON.stringify(item)]);
      }

      // Seed themes
      for (const item of initialWeeklyThemes) {
        await sqlConnection.query(`INSERT INTO ${TABLES.themes} (id, data) VALUES ($1, $2)`, [item.weekNo, JSON.stringify(item)]);
      }

      // Seed events
      for (const item of initialSchoolEvents) {
        await sqlConnection.query(`INSERT INTO ${TABLES.events} (id, data) VALUES ($1, $2)`, [item.id, JSON.stringify(item)]);
      }

      // Seed journal posts
      for (const item of initialJournalPosts) {
        await sqlConnection.query(`INSERT INTO ${TABLES.journal} (id, data) VALUES ($1, $2)`, [item.id, JSON.stringify(item)]);
      }

      // Seed enrolments
      for (const item of initialEnrolments) {
        await sqlConnection.query(`INSERT INTO ${TABLES.enrolments} (id, data) VALUES ($1, $2)`, [item.id, JSON.stringify(item)]);
      }

      // Seed users
      for (const item of initialUsers) {
        await sqlConnection.query(`INSERT INTO ${TABLES.users} (id, data) VALUES ($1, $2)`, [item.id, JSON.stringify(item)]);
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
  const { email, role } = req.query;
  const userEmail = email ? (email as string).toLowerCase().trim() : null;
  const userRole = role ? (role as string).trim() : null;

  let learnersList: any[] = [];
  let parentProfileObj: any = null;
  let progressReportsList: any[] = [];
  let paymentHistoryList: any[] = [];
  let chatHistoryList: any[] = [];
  let themesList: any[] = [];
  let eventsList: any[] = [];
  let journalPostsList: any[] = [];
  let enrolmentsList: any[] = [];

  if (usingNeon && sqlConnection) {
    try {
      const dbLearners = await sqlConnection.query(`SELECT data FROM ${TABLES.learners}`);
      const dbReports = await sqlConnection.query(`SELECT data FROM ${TABLES.reports}`);
      const dbPayments = await sqlConnection.query(`SELECT data FROM ${TABLES.payments}`);
      const dbChats = await sqlConnection.query(`SELECT data FROM ${TABLES.chats}`);
      const dbThemes = await sqlConnection.query(`SELECT data FROM ${TABLES.themes}`);
      const dbEvents = await sqlConnection.query(`SELECT data FROM ${TABLES.events}`);
      const dbJournal = await sqlConnection.query(`SELECT data FROM ${TABLES.journal}`);
      const dbEnrolments = await sqlConnection.query(`SELECT data FROM ${TABLES.enrolments}`);

      learnersList = dbLearners.map((r: any) => typeof r.data === 'string' ? JSON.parse(r.data) : r.data);
      progressReportsList = dbReports.map((r: any) => typeof r.data === 'string' ? JSON.parse(r.data) : r.data);
      paymentHistoryList = dbPayments.map((r: any) => typeof r.data === 'string' ? JSON.parse(r.data) : r.data);
      chatHistoryList = dbChats.map((r: any) => typeof r.data === 'string' ? JSON.parse(r.data) : r.data);
      themesList = dbThemes.map((r: any) => typeof r.data === 'string' ? JSON.parse(r.data) : r.data).sort((a: any, b: any) => a.weekNo - b.weekNo);
      eventsList = dbEvents.map((r: any) => typeof r.data === 'string' ? JSON.parse(r.data) : r.data);
      journalPostsList = dbJournal.map((r: any) => typeof r.data === 'string' ? JSON.parse(r.data) : r.data);
      enrolmentsList = dbEnrolments.map((r: any) => typeof r.data === 'string' ? JSON.parse(r.data) : r.data);

      if (userRole === 'parent' && userEmail) {
        const dbProfile = await sqlConnection.query(`SELECT data FROM ${TABLES.parentProfile} WHERE id = $1`, [userEmail]);
        if (dbProfile && dbProfile.length > 0) {
          parentProfileObj = typeof dbProfile[0].data === 'string' ? JSON.parse(dbProfile[0].data) : dbProfile[0].data;
        } else {
          const dbDefaultProfile = await sqlConnection.query(`SELECT data FROM ${TABLES.parentProfile} WHERE id = $1`, ["default"]);
          parentProfileObj = dbDefaultProfile[0] ? (typeof dbDefaultProfile[0].data === 'string' ? JSON.parse(dbDefaultProfile[0].data) : dbDefaultProfile[0].data) : fallbackStore.parentProfile;
        }
      } else {
        const dbProfile = await sqlConnection.query(`SELECT data FROM ${TABLES.parentProfile} WHERE id = $1`, ["default"]);
        parentProfileObj = dbProfile[0] ? (typeof dbProfile[0].data === 'string' ? JSON.parse(dbProfile[0].data) : dbProfile[0].data) : fallbackStore.parentProfile;
      }
    } catch (err) {
      console.error("🔴 Connection or query failed in Neon. Emitting local state fallback...", err);
      // Fallback memory state retrieval
      learnersList = [...fallbackStore.learners];
      progressReportsList = [...fallbackStore.progressReports];
      paymentHistoryList = [...fallbackStore.paymentHistory];
      chatHistoryList = [...fallbackStore.chatHistory];
      themesList = [...fallbackStore.themes];
      eventsList = [...fallbackStore.events];
      journalPostsList = [...fallbackStore.journalPosts];
      enrolmentsList = [...fallbackStore.enrolments];
      if (userRole === 'parent' && userEmail) {
        parentProfileObj = (fallbackStore as any).parentProfiles?.[userEmail] || fallbackStore.parentProfile;
      } else {
        parentProfileObj = fallbackStore.parentProfile;
      }
    }
  } else {
    // Memory database retrieval
    learnersList = [...fallbackStore.learners];
    progressReportsList = [...fallbackStore.progressReports];
    paymentHistoryList = [...fallbackStore.paymentHistory];
    chatHistoryList = [...fallbackStore.chatHistory];
    themesList = [...fallbackStore.themes];
    eventsList = [...fallbackStore.events];
    journalPostsList = [...fallbackStore.journalPosts];
    enrolmentsList = [...fallbackStore.enrolments];
    if (userRole === 'parent' && userEmail) {
      parentProfileObj = (fallbackStore as any).parentProfiles?.[userEmail] || fallbackStore.parentProfile;
    } else {
      parentProfileObj = fallbackStore.parentProfile;
    }
  }

  // Filter based on session
  if (userRole === 'parent' && userEmail) {
    const isDemoParent = userEmail === 'parent@kiddiestown.co.za';

    // 1. Filter Learners - only return matched learners, except for the default demo account Sarah Mbeki
    const filteredLearners = learnersList.filter(l => l.parentEmail === userEmail || (isDemoParent && l.id === 'student-leo'));

    // 2. Filter Reports - return reports only for matched children
    const myLearnerIds = filteredLearners.map(l => l.id);
    const filteredReports = progressReportsList.filter(r => myLearnerIds.includes(r.learnerId));

    // 3. Filter Payments - return outstanding payments only for matched children/parents
    const filteredPayments = paymentHistoryList.filter(p => p.parentEmail === userEmail || myLearnerIds.includes(p.learnerId) || (isDemoParent && p.learnerId === 'student-leo'));

    // 4. Filter chats
    let filteredChats = chatHistoryList.filter(c => c.parentEmail === userEmail);
    
    // Auto-inject direct introduction when a newly registered parent enters chat the first time
    if (filteredChats.length === 0 && userEmail !== 'parent@kiddiestown.co.za') {
      const welcomeChat = {
        id: 'chat-welcome-' + Date.now(),
        sender: 'Teacher',
        senderName: 'Teacher Anne',
        text: `Hello! 👋 Welcome to your Kiddies Town Parent Portal. This is a direct, confidential communication line to Teacher Anne. Please let us know if you have any questions about daily classroom schedules or lesson plans!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        parentEmail: userEmail
      };
      filteredChats = [welcomeChat];
      
      if (usingNeon && sqlConnection) {
        sqlConnection.query(`INSERT INTO ${TABLES.chats} (id, data) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING`, [welcomeChat.id, JSON.stringify(welcomeChat)]).catch(() => {});
      } else {
        fallbackStore.chatHistory.push(welcomeChat);
      }
    }

    return res.json({
      learners: filteredLearners,
      parentProfile: parentProfileObj,
      progressReports: filteredReports,
      paymentHistory: filteredPayments,
      chatHistory: filteredChats,
      themes: themesList,
      events: eventsList,
      journalPosts: journalPostsList,
      enrolments: enrolmentsList,
      usingNeon: usingNeon,
    });
  }

  // Teacher / Admin gets global view
  res.json({
    learners: learnersList,
    parentProfile: parentProfileObj,
    progressReports: progressReportsList,
    paymentHistory: paymentHistoryList,
    chatHistory: chatHistoryList,
    themes: themesList,
    events: eventsList,
    journalPosts: journalPostsList,
    enrolments: enrolmentsList,
    usingNeon: usingNeon,
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
      await sqlConnection.query(`
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
      await sqlConnection.query(`
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
      await sqlConnection.query(`
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
      await sqlConnection.query(`
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
      await sqlConnection.query(`
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
      await sqlConnection.query(`
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
      await sqlConnection.query(`
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
      await sqlConnection.query(`
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
      await sqlConnection.query(`
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

// POST: Sign up user
app.post("/api/auth/signup", async (req, res) => {
  const { email, password, role, name } = req.body;
  if (!email || !password || !role || !name) {
    return res.status(400).json({ error: "Missing required fields (email, password, role, name)" });
  }

  const normalizedEmail = email.toLowerCase().trim();

  // Check if user already exists
  let userExists = false;
  if (usingNeon && sqlConnection) {
    try {
      const results = await sqlConnection.query(`SELECT data FROM ${TABLES.users} WHERE id = $1`, [normalizedEmail]);
      if (results && results.length > 0) userExists = true;
    } catch (e) {
      console.error("Neon check users error:", e);
    }
  } else {
    userExists = fallbackStore.users.some(u => u.id === normalizedEmail);
  }

  if (userExists) {
    return res.status(400).json({ error: "An account with this email/Academic ID already exists." });
  }

  const newUser = { id: normalizedEmail, email: normalizedEmail, password, role, name };

  // Insert user
  if (usingNeon && sqlConnection) {
    try {
      await sqlConnection.query(`INSERT INTO ${TABLES.users} (id, data) VALUES ($1, $2)`, [normalizedEmail, JSON.stringify(newUser)]);
    } catch (e) {
      console.error("Neon write user error:", e);
      return res.status(500).json({ error: "Failed to securely save user profile." });
    }
  } else {
    fallbackStore.users.push(newUser);
  }

  // Auto-generate parent profile details for new parents to make the demo functional
  if (role === 'parent') {
    const parentLastName = name.includes(' ') ? name.split(' ').slice(-1)[0] : 'Mbeki';
    const parentFirstName = name.includes(' ') ? name.split(' ')[0] : name;

    const sampleParentProfile = {
      name: name,
      email: normalizedEmail,
      phone: '+27 82 ' + Math.floor(1000000 + Math.random() * 9000000),
      address: '12 Pioneer Street, Ster Park, Polokwane',
      maritalStatus: 'Married',
      childLivesWith: 'Both Parents',
      mother: {
        title: 'Mrs.',
        surname: parentLastName,
        firstNames: parentFirstName,
        idNumber: '8804100012081',
        occupation: 'Manager',
        employer: 'Local Corporate',
        telWork: '015 291 0000',
        telHome: '015 291 4455',
        cellNo: '082 123 4567',
        email: normalizedEmail,
        homeAddress: '12 Pioneer Street, Ster Park, Polokwane',
        postalAddress: 'P.O. Box 1024, Polokwane',
        workAddress: 'Polokwane Central'
      },
      father: {
        title: 'Mr.',
        surname: parentLastName,
        firstNames: 'Thabo',
        idNumber: '8602120012085',
        occupation: 'Consultant',
        employer: 'FTech',
        telWork: '015 291 1122',
        telHome: '015 291 4455',
        cellNo: '081 223 3445',
        email: 'father@mail.com',
        homeAddress: '12 Pioneer Street, Ster Park, Polokwane',
        postalAddress: 'P.O. Box 1024, Polokwane',
        workAddress: 'Polokwane Business District'
      }
    };

    if (usingNeon && sqlConnection) {
      try {
        await sqlConnection.query(`INSERT INTO ${TABLES.parentProfile} (id, data) VALUES ($1, $2)`, [normalizedEmail, JSON.stringify(sampleParentProfile)]);
      } catch (err) {
        console.error("Auto registration mother/father profile seed fail in Neon DB:", err);
      }
    } else {
      (fallbackStore as any).parentProfiles[normalizedEmail] = sampleParentProfile;
    }
  }

  return res.json({ success: true, user: { role, name, email: normalizedEmail } });
});

// POST: Login user
app.post("/api/auth/login", async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return res.status(400).json({ error: "Missing required login credentials." });
  }

  const normalizedEmail = email.toLowerCase().trim();

  let foundUser: any = null;
  if (usingNeon && sqlConnection) {
    try {
      const results = await sqlConnection.query(`SELECT data FROM ${TABLES.users} WHERE id = $1`, [normalizedEmail]);
      if (results && results.length > 0) {
        const u = typeof results[0].data === 'string' ? JSON.parse(results[0].data) : results[0].data;
        if (u.password === password && u.role === role) {
          foundUser = u;
        }
      }
    } catch (e) {
      console.error("Neon login query error:", e);
    }
  } else {
    const u = fallbackStore.users.find(usr => usr.id === normalizedEmail);
    if (u && u.password === password && u.role === role) {
      foundUser = u;
    }
  }

  if (foundUser) {
    return res.json({
      success: true,
      user: {
        role: foundUser.role,
        name: foundUser.name,
        email: foundUser.email
      }
    });
  } else {
    return res.status(401).json({ error: "Access Denied: The credentials do not match the selected school profile." });
  }
});

// POST: Reset & Sync database contents back to file-configured defaults
app.post("/api/admin/reset-db", async (req, res) => {
  try {
    if (usingNeon && sqlConnection) {
      console.log("🧹 Dropping tables for reset-db trigger...");
      const tableNames = Object.values(TABLES);
      for (const name of tableNames) {
        await sqlConnection.query(`DROP TABLE IF EXISTS ${name} CASCADE`);
      }
      
      console.log("🌱 Re-bootstrapping and seeding tables with latest mockData contents...");
      await bootstrapSchema();
      return res.json({ 
        success: true, 
        message: "Neon Cloud DB dropped and successfully synchronized with the updated mockData structures!" 
      });
    } else {
      // Memory fallback resetting
      fallbackStore.learners = [...initialLearners];
      fallbackStore.parentProfile = { ...initialParentProfile };
      fallbackStore.progressReports = [...initialProgressReports];
      fallbackStore.paymentHistory = [...initialPaymentHistory];
      fallbackStore.chatHistory = [...initialChatHistory];
      fallbackStore.themes = [...initialWeeklyThemes];
      fallbackStore.events = [...initialSchoolEvents];
      fallbackStore.journalPosts = [...initialJournalPosts];
      fallbackStore.enrolments = [...initialEnrolments];
      fallbackStore.users = [...initialUsers];
      return res.json({ 
        success: true, 
        message: "Demo memory cache successfully reset to latest mockData definitions." 
      });
    }
  } catch (err: any) {
    console.error("Failed to reset application database:", err);
    res.status(500).json({ error: err.message || "Failed to reset application database tables." });
  }
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
