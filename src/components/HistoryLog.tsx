import { Calendar, Trash2, Tag, CalendarDays, CheckCircle2, XCircle, MinusCircle } from 'lucide-react';
import { Course, AttendanceRecord } from '../types';

interface HistoryLogProps {
  courses: Course[];
  records: AttendanceRecord[];
  onRemoveRecord: (recordId: string) => void;
}

export default function HistoryLog({ courses, records, onRemoveRecord }: HistoryLogProps) {
  // Sort records by date descending
  const sortedRecords = [...records].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // Group records by date
  const groupedRecords: { [key: string]: AttendanceRecord[] } = {};
  sortedRecords.forEach((record) => {
    if (!groupedRecords[record.date]) {
      groupedRecords[record.date] = [];
    }
    groupedRecords[record.date].push(record);
  });

  const getStatusBadge = (status: 'present' | 'absent' | 'cancelled') => {
    switch (status) {
      case 'present':
        return (
          <span className="flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-green-500/10 text-green-400 border border-green-500/20">
            <CheckCircle2 className="h-3 w-3" />
            <span>Present</span>
          </span>
        );
      case 'absent':
        return (
          <span className="flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
            <XCircle className="h-3 w-3" />
            <span>Absent</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-gray-500/10 text-gray-400 border border-gray-500/20">
            <MinusCircle className="h-3 w-3" />
            <span>Cancelled</span>
          </span>
        );
    }
  };

  const getFormatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
  };

  const datesList = Object.keys(groupedRecords);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mt-8">
      <div className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-6 hover:border-white/20 transition-all duration-300 shadow-xl">
        <div className="flex justify-between items-center pb-4 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-slate-100">Attendance History</h2>
          </div>
          <span className="text-xs font-mono font-bold text-indigo-300">
            {records.length} slots logged
          </span>
        </div>

        {datesList.length === 0 ? (
          <div className="py-16 text-center">
            <CalendarDays className="h-10 w-10 text-slate-400 mx-auto mb-3" />
            <span className="text-sm font-semibold text-slate-100 block">No entries logged yet</span>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              Mark today's attendance in the Daily Log or Course sections to build your attendance graph.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            {datesList.map((dateStr) => (
              <div key={dateStr} className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-xs font-bold text-indigo-400 block mb-3 font-mono">
                  {getFormatDate(dateStr)}
                </span>
                
                <div className="space-y-2">
                  {groupedRecords[dateStr].map((record) => {
                    const course = courses.find((c) => c.id === record.courseId);
                    if (!course) return null;

                    return (
                      <div
                        key={record.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-white/10 border border-white/10 hover:border-white/15 transition-all"
                      >
                        <div className="flex items-center space-x-3">
                          <Tag className="h-4 w-4 text-slate-400" />
                          <div>
                            <span className="text-sm font-medium text-slate-100">{course.name}</span>
                            <span className="text-[10px] font-mono text-slate-400 block">
                              {course.code} • {course.credits} Credits
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          {getStatusBadge(record.status)}
                          <button
                            onClick={() => onRemoveRecord(record.id)}
                            className="p-1.5 rounded-md hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all cursor-pointer"
                            title="Delete entry"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
