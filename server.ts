import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

// Path to persistent database directory & file
const DATA_DIR = path.join(process.cwd(), 'server_data');
const DATA_FILE = path.join(DATA_DIR, 'db.json');

// Ensure database directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial default database state representing default courses & schedule
const INITIAL_DB = {
  profile: {
    name: 'Chaitanya Bodage',
    email: 'chaitanyabodage5515@gmail.com',
    rollNumber: 'PRN-2025010932',
    branch: 'B.Tech CSE - Artificial Intelligence & Machine Learning',
    semester: 'Semester III (Div I, Batch I3)',
    targetPercentage: 75,
  },
  courses: [
    {
      id: 'course-odemc',
      name: 'Ordinary Differential Equations and Multivariate Calculus',
      code: '230GMAB07_03',
      credits: 3,
      requiredPercentage: 75,
    },
    {
      id: 'course-ds',
      name: 'Data Structures',
      code: '230GCSB05_03',
      credits: 3,
      requiredPercentage: 75,
    },
    {
      id: 'course-oopj',
      name: 'Object Oriented Programming using Java',
      code: '240GCSB72_03',
      credits: 2,
      requiredPercentage: 75,
    },
    {
      id: 'course-fds',
      name: 'Foundations of Data Science',
      code: '250GDSB01_03',
      credits: 2.5,
      requiredPercentage: 75,
    },
    {
      id: 'course-ple',
      name: 'Professional Laws, Ethics, Values and Harmony',
      code: '230USYB02_03',
      credits: 2,
      requiredPercentage: 75,
    },
    {
      id: 'course-es',
      name: 'Environment and Sustainability',
      code: '231GCEB02_03',
      credits: 2,
      requiredPercentage: 75,
    },
    {
      id: 'course-mmc',
      name: 'Multidisciplinary Minor Course',
      code: '230GETB38_03',
      credits: 2,
      requiredPercentage: 75,
    },
    {
      id: 'course-ds-lab',
      name: 'Data Structures Lab',
      code: '230GCSB09_03',
      credits: 1,
      requiredPercentage: 75,
    },
    {
      id: 'course-oopj-lab',
      name: 'Object Oriented Programming using Java Lab',
      code: '240GCSB73_03',
      credits: 1,
      requiredPercentage: 75,
    },
    {
      id: 'course-hn',
      name: 'Health and Nutrition',
      code: '230HFSB80_03',
      credits: 1.5,
      requiredPercentage: 75,
    },
  ],
  records: [],
  schedule: [
    {
      dayOfWeek: 1, // Monday
      slots: [
        { id: 'm1', courseId: 'course-odemc', time: '10:30 AM - 12:30 PM (Tutorial)' },
        { id: 'm2', courseId: 'course-es', time: '01:15 PM - 02:15 PM' },
        { id: 'm3', courseId: 'course-ple', time: '02:15 PM - 03:15 PM' },
        { id: 'm4', courseId: 'course-fds', time: '03:30 PM - 04:30 PM' },
        { id: 'm5', courseId: 'course-ds', time: '04:30 PM - 05:30 PM' },
      ],
    },
    {
      dayOfWeek: 2, // Tuesday
      slots: [
        { id: 't1', courseId: 'course-ds-lab', time: '10:30 AM - 12:30 PM (Lab)' },
        { id: 't2', courseId: 'course-odemc', time: '01:15 PM - 02:15 PM' },
        { id: 't3', courseId: 'course-oopj', time: '02:15 PM - 03:15 PM' },
        { id: 't4', courseId: 'course-ple', time: '03:30 PM - 04:30 PM' },
        { id: 't5', courseId: 'course-mmc', time: '04:30 PM - 05:30 PM' },
      ],
    },
    {
      dayOfWeek: 3, // Wednesday
      slots: [
        { id: 'w1', courseId: 'course-mmc', time: '10:30 AM - 12:30 PM (Lab)' },
        { id: 'w2', courseId: 'course-ds', time: '01:15 PM - 02:15 PM' },
        { id: 'w3', courseId: 'course-oopj', time: '02:15 PM - 03:15 PM' },
        { id: 'w4', courseId: 'course-odemc', time: '03:30 PM - 04:30 PM' },
        { id: 'w5', courseId: 'course-ds', time: '04:30 PM - 05:30 PM' },
      ],
    },
    {
      dayOfWeek: 4, // Thursday
      slots: [
        { id: 'th1', courseId: 'course-oopj-lab', time: '10:30 AM - 12:30 PM (Lab)' },
        { id: 'th2', courseId: 'course-es', time: '01:15 PM - 02:15 PM' },
        { id: 'th3', courseId: 'course-fds', time: '02:15 PM - 03:15 PM' },
        { id: 'th4', courseId: 'course-hn', time: '03:30 PM - 04:30 PM' },
      ],
    },
    { dayOfWeek: 5, slots: [] },
    { dayOfWeek: 6, slots: [] },
    { dayOfWeek: 0, slots: [] },
  ],
};

// Sync helpers
function readDB() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_DB, null, 2), 'utf-8');
      return INITIAL_DB;
    }
    const content = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Error reading backend database:', error);
    return INITIAL_DB;
  }
}

function writeDB(data: any) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing backend database:', error);
  }
}

app.use(express.json());

// API Endpoints
app.get('/api/data', (req, res) => {
  const db = readDB();
  res.json(db);
});

app.post('/api/sync', (req, res) => {
  const { courses, records, schedule, profile } = req.body;
  const db = {
    profile: profile || {
      name: 'Chaitanya Bodage',
      email: 'chaitanyabodage5515@gmail.com',
      rollNumber: 'PRN-2025010932',
      branch: 'B.Tech CSE - Artificial Intelligence & Machine Learning',
      semester: 'Semester III (Div I, Batch I3)',
      targetPercentage: 75,
    },
    courses: courses || [],
    records: records || [],
    schedule: schedule || [],
  };
  writeDB(db);
  res.json({ success: true, message: 'All database records successfully synchronized.' });
});

app.post('/api/reset', (req, res) => {
  writeDB(INITIAL_DB);
  res.json({ success: true, message: 'Database reset to standard JSPM defaults.' });
});

// Vite server connection handler
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Flyneo Backend] Listening on http://localhost:${PORT}`);
  });
}

startServer();
