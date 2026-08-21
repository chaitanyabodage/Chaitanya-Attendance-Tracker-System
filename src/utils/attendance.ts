import { Course, AttendanceRecord } from '../types';

export interface CourseStats {
  courseId: string;
  courseName: string;
  courseCode: string;
  credits: number;
  presentCount: number;
  absentCount: number;
  cancelledCount: number;
  totalLectures: number; // present + absent
  percentage: number;
  requiredPercentage: number;
  status: 'safe' | 'warning' | 'critical' | 'no_data';
  bunkableClasses: number; // positive if can bunk, negative (attend needed) if below threshold
}

export interface OverallStats {
  totalCredits: number;
  overallAttendancePercentage: number; // unweighted average
  weightedAttendancePercentage: number; // credit-weighted average
  totalLectures: number;
  totalPresent: number;
  totalAbsent: number;
  totalCancelled: number;
  status: 'safe' | 'warning' | 'critical';
}

export function calculateCourseStats(course: Course, records: AttendanceRecord[]): CourseStats {
  const courseRecords = records.filter((r) => r.courseId === course.id);
  
  let presentCount = 0;
  let absentCount = 0;
  let cancelledCount = 0;

  courseRecords.forEach((r) => {
    if (r.status === 'present') presentCount++;
    else if (r.status === 'absent') absentCount++;
    else if (r.status === 'cancelled') cancelledCount++;
  });

  const totalLectures = presentCount + absentCount;
  const percentage = totalLectures > 0 ? (presentCount / totalLectures) * 100 : 100; // 100% default if no classes held

  let status: 'safe' | 'warning' | 'critical' | 'no_data' = 'no_data';
  if (totalLectures > 0) {
    if (percentage >= course.requiredPercentage) {
      status = percentage - course.requiredPercentage < 5 ? 'warning' : 'safe';
    } else {
      status = 'critical';
    }
  }

  // Calculate bunkable classes
  let bunkableClasses = 0;
  const target = course.requiredPercentage;

  if (totalLectures === 0) {
    bunkableClasses = 0;
  } else if (percentage >= target) {
    // How many can we miss?
    // P / (P + A + x) >= target/100
    // 100 * P >= target * (P + A + x)
    // x <= (100 * P - target * (P + A)) / target
    bunkableClasses = Math.floor((100 * presentCount - target * totalLectures) / target);
    if (bunkableClasses < 0) bunkableClasses = 0;
  } else {
    // How many must we attend?
    // (P + y) / (P + A + y) >= target/100
    // 100 * (P + y) >= target * (P + A + y)
    // y * (100 - target) >= target * (P + A) - 100 * P
    // y >= (target * (P + A) - 100 * P) / (100 - target)
    if (target < 100) {
      bunkableClasses = -Math.ceil((target * totalLectures - 100 * presentCount) / (100 - target));
    } else {
      // If target is 100%, we must attend all future classes, and we can never recover if we missed one (theoretically)
      bunkableClasses = -999;
    }
  }

  return {
    courseId: course.id,
    courseName: course.name,
    courseCode: course.code,
    credits: course.credits,
    presentCount,
    absentCount,
    cancelledCount,
    totalLectures,
    percentage,
    requiredPercentage: target,
    status,
    bunkableClasses,
  };
}

export function calculateOverallStats(courses: Course[], records: AttendanceRecord[]): OverallStats {
  const courseStatsList = courses.map((c) => calculateCourseStats(c, records));
  
  let totalCredits = 0;
  let weightedSum = 0;
  let totalLectures = 0;
  let totalPresent = 0;
  let totalAbsent = 0;
  let totalCancelled = 0;
  let coursesWithLectures = 0;
  let unweightedSum = 0;

  courseStatsList.forEach((stat) => {
    totalLectures += stat.totalLectures;
    totalPresent += stat.presentCount;
    totalAbsent += stat.absentCount;
    totalCancelled += stat.cancelledCount;

    if (stat.totalLectures > 0) {
      totalCredits += stat.credits;
      weightedSum += stat.percentage * stat.credits;
      unweightedSum += stat.percentage;
      coursesWithLectures++;
    }
  });

  // Fallbacks if no lectures recorded at all
  const overallAttendancePercentage = coursesWithLectures > 0 ? unweightedSum / coursesWithLectures : 100;
  const weightedAttendancePercentage = totalCredits > 0 ? weightedSum / totalCredits : 100;

  let status: 'safe' | 'warning' | 'critical' = 'safe';
  if (weightedAttendancePercentage < 75) {
    status = 'critical';
  } else if (weightedAttendancePercentage < 80) {
    status = 'warning';
  }

  return {
    totalCredits: courses.reduce((sum, c) => sum + c.credits, 0), // total credits registered
    overallAttendancePercentage,
    weightedAttendancePercentage,
    totalLectures,
    totalPresent,
    totalAbsent,
    totalCancelled,
    status,
  };
}
