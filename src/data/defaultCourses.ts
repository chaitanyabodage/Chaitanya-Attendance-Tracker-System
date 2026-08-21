import { Course, DailySchedule } from '../types';

export const DEFAULT_COURSES: Course[] = [
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
];

export const DEFAULT_SCHEDULE: DailySchedule[] = [
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
  {
    dayOfWeek: 5, // Friday
    slots: [],
  },
  {
    dayOfWeek: 6, // Saturday
    slots: [],
  },
  {
    dayOfWeek: 0, // Sunday
    slots: [],
  },
];

// Seeded exact historical tracking up until Test 1 as per college attendance rules
export const DEFAULT_RECORDS = [
  // Before Aug 3rd: Absent
  { id: 'rec-1', courseId: 'course-odemc', date: '2026-07-20', status: 'absent' },
  { id: 'rec-2', courseId: 'course-odemc', date: '2026-07-21', status: 'absent' },
  { id: 'rec-3', courseId: 'course-odemc', date: '2026-07-22', status: 'absent' },
  { id: 'rec-4', courseId: 'course-odemc', date: '2026-07-27', status: 'absent' },
  { id: 'rec-5', courseId: 'course-odemc', date: '2026-07-28', status: 'absent' },
  { id: 'rec-6', courseId: 'course-odemc', date: '2026-07-29', status: 'absent' },
  // Started attending Aug 3rd
  { id: 'rec-7', courseId: 'course-odemc', date: '2026-08-03', status: 'present' },
  { id: 'rec-8', courseId: 'course-odemc', date: '2026-08-04', status: 'present' },
  { id: 'rec-9', courseId: 'course-odemc', date: '2026-08-05', status: 'present' },
  // Extra Lecture
  { id: 'rec-10', courseId: 'course-odemc', date: '2026-08-08', status: 'present' },
  // The week of Aug 10
  { id: 'rec-11', courseId: 'course-odemc', date: '2026-08-10', status: 'present' },
  { id: 'rec-12', courseId: 'course-odemc', date: '2026-08-11', status: 'absent' }, // Missed
  { id: 'rec-13', courseId: 'course-odemc', date: '2026-08-12', status: 'present' },
];
