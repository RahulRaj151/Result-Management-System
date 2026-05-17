const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'students.json');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

function ensureDataFile() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    fs.writeFileSync(DATA_FILE, '[]', 'utf8');
  }
}

function readStudents() {
  ensureDataFile();
  const raw = fs.readFileSync(DATA_FILE, 'utf8');
  return JSON.parse(raw);
}

function writeStudents(students) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(students, null, 2), 'utf8');
}

function calculateGrade(average) {
  if (average >= 90) return 'A+';
  if (average >= 80) return 'A';
  if (average >= 70) return 'B';
  if (average >= 60) return 'C';
  if (average >= 50) return 'D';
  return 'F';
}

function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : NaN;
}

function validateStudentInput(body) {
  const errors = [];
  const name = (body.name || '').trim();
  const rollNo = (body.rollNo || '').trim();

  const marks = {
    math: toNumber(body.math),
    science: toNumber(body.science),
    english: toNumber(body.english)
  };

  if (!name) errors.push('Name is required.');
  if (!rollNo) errors.push('Roll number is required.');

  Object.entries(marks).forEach(([subject, mark]) => {
    if (Number.isNaN(mark)) {
      errors.push(`${subject} mark must be a valid number.`);
    } else if (mark < 0 || mark > 100) {
      errors.push(`${subject} mark must be between 0 and 100.`);
    }
  });

  return { name, rollNo, marks, errors };
}

app.get('/', (req, res) => {
  res.redirect('/students');
});

app.get('/students', (req, res) => {
  const students = readStudents();
  res.render('index', { students, error: null });
});

app.get('/students/new', (req, res) => {
  res.render('form', {
    title: 'Add Student Result',
    action: '/students',
    student: { id: null, name: '', rollNo: '', marks: { math: '', science: '', english: '' } },
    errors: []
  });
});

app.post('/students', (req, res) => {
  const students = readStudents();
  const { name, rollNo, marks, errors } = validateStudentInput(req.body);

  if (students.some((s) => s.rollNo === rollNo)) {
    errors.push('Roll number must be unique.');
  }

  if (errors.length > 0) {
    return res.status(400).render('form', {
      title: 'Add Student Result',
      action: '/students',
      student: { id: null, name, rollNo, marks },
      errors
    });
  }

  const total = marks.math + marks.science + marks.english;
  const average = +(total / 3).toFixed(2);

  students.push({
    id: Date.now().toString(),
    name,
    rollNo,
    marks,
    total,
    average,
    grade: calculateGrade(average)
  });

  writeStudents(students);
  res.redirect('/students');
});

app.get('/students/:id/edit', (req, res) => {
  const students = readStudents();
  const student = students.find((s) => s.id === req.params.id);

  if (!student) return res.status(404).render('404');

  res.render('form', {
    title: 'Update Student Result',
    action: `/students/${student.id}/update`,
    student,
    errors: []
  });
});

app.post('/students/:id/update', (req, res) => {
  const students = readStudents();
  const idx = students.findIndex((s) => s.id === req.params.id);

  if (idx === -1) return res.status(404).render('404');

  const { name, rollNo, marks, errors } = validateStudentInput(req.body);

  const duplicate = students.find((s, i) => s.rollNo === rollNo && i !== idx);
  if (duplicate) errors.push('Roll number must be unique.');

  if (errors.length > 0) {
    return res.status(400).render('form', {
      title: 'Update Student Result',
      action: `/students/${req.params.id}/update`,
      student: { id: req.params.id, name, rollNo, marks },
      errors
    });
  }

  const total = marks.math + marks.science + marks.english;
  const average = +(total / 3).toFixed(2);

  students[idx] = {
    ...students[idx],
    name,
    rollNo,
    marks,
    total,
    average,
    grade: calculateGrade(average)
  };

  writeStudents(students);
  res.redirect('/students');
});

app.post('/students/:id/delete', (req, res) => {
  const students = readStudents();
  const filtered = students.filter((s) => s.id !== req.params.id);
  writeStudents(filtered);
  res.redirect('/students');
});

app.use((req, res) => {
  res.status(404).render('404');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
