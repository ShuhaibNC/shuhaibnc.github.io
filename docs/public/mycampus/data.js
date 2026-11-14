/* MyCampus Web: demo data.
 *
 * Everything here is sample data for the browser demo. Only the facts
 * listed in README.md are verified against the live portal; the rest is
 * plausible demo data and is labelled as such in the UI. Nothing here
 * is fetched from cev.etlab.in: a browser cannot log in to the portal
 * (no CORS, session cookies), so live login stays Android-only.
 *
 * Subject names are the official KTU MCA 2020-scheme paper names from
 * Etlab.java in the Android app. Status colours match the portal legend:
 * P green #4CAF50, A red #F44336, L yellow #FFEB3B, N grey #9E9E9E,
 * H light, D blue #3F51B5, O pink #E91E63, S orange #FF9800,
 * V rose #F48FB1.
 */
'use strict';

var MC_DATA = (function () {

  /* ---------------- profile ---------------- */
  var PROFILE = {
    name: 'SHUHAIB N C',
    roll: '26M018',
    course: 'MCA',
    semester: 3,
    college: 'College of Engineering Vadakara (CEV)',
    university: 'APJ Abdul Kalam Technological University (KTU)',
    scheme: 'MCA 2020 scheme',
    portal: 'https://cev.etlab.in',
    /* Not verified, shown as a dash in the UI. */
    dob: '',
    admissionNo: '',
    universityRegNo: ''
  };

  /* ---------------- subjects ---------------- */
  var SUBJECTS = {
    1: [
      { code: '20MCA101', name: 'Mathematical Foundations for Computing' },
      { code: '20MCA103', name: 'Digital Fundamentals & Computer Architecture' },
      { code: '20MCA105', name: 'Advanced Data Structures' },
      { code: '20MCA107', name: 'Advanced Software Engineering' },
      { code: '20MCA131', name: 'Programming Lab' },
      { code: '20MCA133', name: 'Web Programming Lab' },
      { code: '20MCA135', name: 'Data Structures Lab' },
      { code: '20MCANC1', name: 'Entrepreneurship & Innovations in Technology' }
    ],
    2: [
      { code: '20MCA102', name: 'Advanced Database Management Systems' },
      { code: '20MCA104', name: 'Advanced Computer Networks' },
      { code: '20MCA132', name: 'Object Oriented Programming Lab' },
      { code: '20MCA134', name: 'Advanced DBMS Lab' },
      { code: '20MCA136', name: 'Networking & System Administration Lab' },
      { code: '20MCA188', name: 'Artificial Intelligence' },
      { code: '20MCA168', name: 'Virtualisation and Containers' },
      { code: '20MCANC2', name: 'Industrial Readiness Training' }
    ],
    3: [
      { code: '20MCA201', name: 'Data Science & Machine Learning' },
      { code: '20MCA203', name: 'Design & Analysis of Algorithms' },
      { code: '20MCA241', name: 'Data Science Lab' },
      { code: '20MCA243', name: 'Mobile Application Development Lab' },
      { code: '20MCA245', name: 'Mini Project' },
      { code: '20MCA263', name: 'Cyber Security & Cryptography' },
      { code: '20MCANC3', name: 'Domain Expertise Workshops' }
    ],
    4: [
      { code: '20MCA242', name: 'Comprehensive Viva' },
      { code: '20MCA244', name: 'Seminar' },
      { code: '20MCA246', name: 'Main Project' }
    ]
  };

  function subjectName(code) {
    for (var sem in SUBJECTS) {
      var list = SUBJECTS[sem];
      for (var i = 0; i < list.length; i++) {
        if (list[i].code === code) return list[i].name;
      }
    }
    return code;
  }

  /* ---------------- attendance (demo) ----------------
   * Sem 3 averages ~95%, matching the verified Sep 2026 portal test.
   * Sem 1/2/4 are plausible demo figures, labelled as demo in the UI. */
  var ATTENDANCE = {
    1: [
      { code: '20MCA101', present: 52, total: 56 },
      { code: '20MCA103', present: 54, total: 58 },
      { code: '20MCA105', present: 55, total: 58 },
      { code: '20MCA107', present: 50, total: 54 },
      { code: '20MCA131', present: 28, total: 29 },
      { code: '20MCA133', present: 27, total: 29 },
      { code: '20MCA135', present: 29, total: 30 },
      { code: '20MCANC1', present: 16, total: 17 }
    ],
    2: [
      { code: '20MCA102', present: 53, total: 57 },
      { code: '20MCA104', present: 51, total: 55 },
      { code: '20MCA132', present: 29, total: 30 },
      { code: '20MCA134', present: 28, total: 30 },
      { code: '20MCA136', present: 27, total: 29 },
      { code: '20MCA188', present: 50, total: 54 },
      { code: '20MCA168', present: 49, total: 53 },
      { code: '20MCANC2', present: 17, total: 18 }
    ],
    3: [
      { code: '20MCA201', present: 58, total: 61 },
      { code: '20MCA203', present: 56, total: 59 },
      { code: '20MCA241', present: 30, total: 31 },
      { code: '20MCA243', present: 29, total: 30 },
      { code: '20MCA245', present: 20, total: 21 },
      { code: '20MCA263', present: 55, total: 58 },
      { code: '20MCANC3', present: 18, total: 19 }
    ],
    4: [
      { code: '20MCA242', present: 12, total: 12 },
      { code: '20MCA244', present: 11, total: 12 },
      { code: '20MCA246', present: 40, total: 42 }
    ]
  };

  function overallPct(sem) {
    var rows = ATTENDANCE[sem] || [];
    var p = 0, t = 0;
    for (var i = 0; i < rows.length; i++) { p += rows[i].present; t += rows[i].total; }
    return t === 0 ? 0 : (p * 100 / t);
  }

  /* ---------------- timetable (Sem 3 demo) ----------------
   * Mon-Fri, Periods 1-7. Lunch 13:15-14:00. Labs run as double periods.
   * Times match the Android app's period slots. */
  var PERIOD_TIMES = [
    '09:00 - 10:00',
    '10:00 - 11:00',
    '11:15 - 12:15',
    '12:15 - 13:15',
    '14:00 - 15:00',
    '15:00 - 16:00',
    '16:00 - 17:00'
  ];

  /* type: 'theory' | 'lab'; teacher names are not shown (not verified). */
  var TIMETABLE = {
    monday:    ['20MCA201', '20MCA201', '20MCA203', '20MCA203', '20MCA241', '20MCA241', '20MCA263'],
    tuesday:   ['20MCA203', '20MCA263', '20MCA201', '20MCA201', '20MCA245', '20MCA245', '20MCANC3'],
    wednesday: ['20MCA243', '20MCA243', '20MCA263', '20MCA203', '20MCA201', '20MCA201', '20MCA245'],
    thursday:  ['20MCA201', '20MCA203', '20MCA203', '20MCA241', '20MCA241', '20MCA263', '20MCANC3'],
    friday:    ['20MCA263', '20MCA201', '20MCA203', '20MCA243', '20MCA243', '20MCA245', '20MCA201'],
    saturday:  [],
    sunday:    []
  };

  var LAB_CODES = ['20MCA241', '20MCA243', '20MCA245'];

  function slotType(code) {
    return LAB_CODES.indexOf(code) >= 0 ? 'lab' : 'theory';
  }

  var DAY_NAMES = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  var DAY_LABELS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  /* ---------------- results (verified facts only) ----------------
   * Sem 1: Series Exam 1, one verified row: 20MCA105 Advanced Data
   * Structures, 23/30 (checked on the live portal 2026-10-24). Other
   * Sem 1 subjects were not published in that sample, so they are not
   * listed. Sem 3: the portal shows "No sessional exams yet", so it is empty.
   * Sem 2/4: no verified marks, shown as empty in demo. */
  var RESULTS = {
    1: [
      {
        name: 'Series Exam 1',
        note: 'Only the verified row is shown; other subjects were not published in this sample.',
        subjects: [
          { code: '20MCA105', name: 'Advanced Data Structures', marks: '23', max: '30' }
        ]
      }
    ],
    2: [],
    3: [],
    4: []
  };

  /* ---------------- monthly attendance: Aug–Nov 2026 (Sem 3) ----------------
   * Deterministic (seeded) demo grids built from the timetable above.
   * Sundays and 2 Oct (Gandhi Jayanti) are holidays: blank cells.
   * Demo data ends 7 Nov 2026: later November days are blank N/A cells.
   *
   * Blank-cell rule (from Android b24): a cell with no visible text can
   * NEVER read as Absent. Empty cells are N/A (grey) or Holiday (light),
   * never red. Only a cell carrying a subject code can be Absent. */
  var STATUS_COLORS = {
    P: '#4CAF50', A: '#F44336', L: '#FFEB3B', N: '#9E9E9E',
    H: '#E0E0E0', D: '#3F51B5', O: '#E91E63', S: '#FF9800', V: '#F48FB1'
  };

  var STATUS_WORDS = {
    P: 'Present', A: 'Absent', L: 'Leave', N: 'N/A', H: 'Holiday',
    D: 'Duty Leave', O: 'On Duty', S: 'Suspension', V: 'Special Leave'
  };

  function mulberry32(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  var MONTH_FULL = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  var MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  function buildMonthly(year, monthIndex) {
    var daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    var holidays = (year === 2026 && monthIndex === 9) ? { 2: 'Gandhi Jayanti' } : {};
    /* Sem 3 demo data ends 7 Nov 2026: later days are blank N/A cells
     * with no subject, never fake Present. */
    var cutoff = (year === 2026 && monthIndex === 10) ? 7 : daysInMonth;
    var rand = mulberry32(year * 100 + (monthIndex + 1));
    var days = [];
    for (var d = 1; d <= daysInMonth; d++) {
      var date = new Date(year, monthIndex, d);
      var dow = (date.getDay() + 6) % 7; /* Mon=0 .. Sun=6 */
      var periods = [];
      var isHoliday = (dow === 6) || !!holidays[d];
      var afterCutoff = d > cutoff;
      for (var p = 1; p <= 7; p++) {
        if (afterCutoff) {
          /* Past the demo cutoff: blank cell, N/A, never a status. */
          periods.push({ p: p, s: 'N', sub: '' });
        } else if (isHoliday) {
          /* Holiday: blank cell, never Absent. */
          periods.push({ p: p, s: 'H', sub: '' });
        } else {
          var code = TIMETABLE[DAY_NAMES[dow]][p - 1] || '';
          if (!code) {
            /* No class scheduled: blank cell is N/A, never Absent. */
            periods.push({ p: p, s: 'N', sub: '' });
          } else {
            var r = rand();
            var s = r < 0.045 ? 'A' : (r < 0.065 ? 'L' : 'P');
            periods.push({ p: p, s: s, sub: code });
          }
        }
      }
      days.push({
        d: d,
        label: d + ' ' + MONTH_SHORT[monthIndex] + ' ' + year,
        weekday: DAY_LABELS[dow],
        holiday: afterCutoff ? '' : (isHoliday ? (holidays[d] || 'Sunday') : ''),
        periods: periods
      });
    }
    return { month: MONTH_FULL[monthIndex] + ' ' + year, year: year, monthIndex: monthIndex, days: days };
  }

  var MONTHS = {
    '2026-08': buildMonthly(2026, 7),
    '2026-09': buildMonthly(2026, 8),
    '2026-10': buildMonthly(2026, 9),
    '2026-11': buildMonthly(2026, 10)
  };
  var MONTH_ORDER = ['2026-08', '2026-09', '2026-10', '2026-11'];
  /* Latest month, kept for compat with code that reads a single month. */
  var MONTHLY = MONTHS['2026-11'];

  function monthKeyOfDate(date) {
    return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');
  }

  function findDay(date) {
    /* The month must match too: days never borrow another month's data
     * (same rule as HomeFragment.findDay). */
    var m = MONTHS[monthKeyOfDate(date)];
    if (!m) return null;
    var dom = date.getDate();
    for (var i = 0; i < m.days.length; i++) {
      if (m.days[i].d === dom) return m.days[i];
    }
    return null;
  }

  /* ---------------- notices / circulars (demo) ----------------
   * Generic sample notices only; no personal data. Circulars are
   * merged into the same list with a "Circular" tag. */
  var NOTICES = [
    { id: 'n1', title: 'Semester 3 timetable published', description: 'The Semester 3 weekly timetable is now available on the Timetable tab. Labs run as double periods.', content: '', date: '2026-11-02', url: '', source: 'notice' },
    { id: 'n2', title: 'Holiday — Gandhi Jayanti, 2 Oct', description: 'The college remains closed on 2 October 2026 for Gandhi Jayanti. No classes that day.', content: '', date: '2026-09-28', url: '', source: 'notice' },
    { id: 'n3', title: 'Series Exam 1 schedule', description: 'Series Exam 1 for Semester 3 will be held as per the schedule published on the Exams tab.', content: '', date: '2026-10-20', url: '', source: 'notice' },
    { id: 'c1', title: 'Circular: Attendance below 75%', description: 'Students with attendance below 75% are advised to meet their staff advisor. See the Attendance tab for subject-wise figures.', content: '', date: '2026-10-15', url: '', source: 'circular' }
  ];

  /* ---------------- fees (demo, clearly sample totals) ----------------
   * Sample figures only — labelled Demo in the UI, never real totals. */
  var FEES = {
    total_fee: 90000,
    total_paid: 60000,
    total_balance: 30000,
    has_due: true,
    fees: [
      { title: 'Tuition Fee — Semester 3 (Instalment 1)', label: 'Tuition Fee — Semester 3 (Instalment 1)', amount: 45000, due_date: '2026-08-31', status: 'Paid' },
      { title: 'Tuition Fee — Semester 3 (Instalment 2)', label: 'Tuition Fee — Semester 3 (Instalment 2)', amount: 45000, due_date: '2026-11-30', status: 'Pending' }
    ],
    items: [],
    receipts: [
      { receipt_no: 'SAMPLE-001', amount: 45000, date: '2026-08-15', title: 'Tuition Fee — Instalment 1' },
      { receipt_no: 'SAMPLE-002', amount: 15000, date: '2026-09-10', title: 'Tuition Fee — Part payment' }
    ]
  };

  /* ---------------- exams (demo, Sem 3) ---------------- */
  var EXAMS = {
    3: [
      { id: 'e1', subject: 'Data Science & Machine Learning', subject_code: '20MCA201', date: '2026-11-18', time: '09:30 - 12:30', period: '', venue: 'Hall A', exam_name: 'Series Exam 1', semester: 3, description: '' },
      { id: 'e2', subject: 'Design & Analysis of Algorithms', subject_code: '20MCA203', date: '2026-11-19', time: '09:30 - 12:30', period: '', venue: 'Hall A', exam_name: 'Series Exam 1', semester: 3, description: '' },
      { id: 'e3', subject: 'Data Science Lab', subject_code: '20MCA241', date: '2026-11-20', time: '09:30 - 12:30', period: '', venue: 'Lab 2', exam_name: 'Series Exam 1', semester: 3, description: '' }
    ]
  };

  /* ---------------- assignments / evaluations (demo, Sem 3) ---------------- */
  var ASSIGNMENTS = {
    3: [
      { id: 'a1', subject: 'Data Science & Machine Learning', title: 'Assignment 1 — Data cleaning', details: 'Clean and summarise the sample dataset.', last_date: '2026-11-20', issued_date: '2026-11-05', status: 'Pending' },
      { id: 'a2', subject: 'Design & Analysis of Algorithms', title: 'Assignment 1 — Sorting analysis', details: 'Compare sorting algorithms on the given inputs.', last_date: '2026-11-10', issued_date: '2026-10-28', status: 'Pending' },
      { id: 'a3', subject: 'Cyber Security & Cryptography', title: 'Assignment 1 — Cipher worksheet', details: 'Work through the cipher exercises.', last_date: '2026-11-05', issued_date: '2026-10-20', status: 'Submitted' }
    ]
  };
  var EVALUATIONS = {
    3: [
      { id: 'v1', subject: 'Data Science Lab', title: 'Lab evaluation — Practical 1', details: 'Record work and viva.', last_date: '2026-11-21', issued_date: '2026-11-06', status: 'Pending' }
    ]
  };

  /* ---------------- university results (demo: EMPTY) ----------------
   * Never invent grades: demo has no university results at all. */
  var UNIVERSITY_RESULTS = { 1: null, 2: null, 3: null, 4: null };


  return {
    PROFILE: PROFILE,
    SUBJECTS: SUBJECTS,
    subjectName: subjectName,
    ATTENDANCE: ATTENDANCE,
    overallPct: overallPct,
    PERIOD_TIMES: PERIOD_TIMES,
    TIMETABLE: TIMETABLE,
    slotType: slotType,
    DAY_NAMES: DAY_NAMES,
    DAY_LABELS: DAY_LABELS,
    RESULTS: RESULTS,
    STATUS_COLORS: STATUS_COLORS,
    STATUS_WORDS: STATUS_WORDS,
    MONTHS: MONTHS,
    MONTH_ORDER: MONTH_ORDER,
    MONTHLY: MONTHLY,
    findDay: findDay,
    NOTICES: NOTICES,
    FEES: FEES,
    EXAMS: EXAMS,
    ASSIGNMENTS: ASSIGNMENTS,
    EVALUATIONS: EVALUATIONS,
    UNIVERSITY_RESULTS: UNIVERSITY_RESULTS
  };
})();
