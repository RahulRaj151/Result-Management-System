# Student Result Management System

A simple web-based **Student Result Management System** built with **Node.js**, **Express**, and **EJS**.

Teachers can:
- Add student marks
- Automatically calculate total, average, and grade
- View all student results
- Update student records
- Delete student records

Student data is persisted in a local JSON file: `data/students.json`.

---

## Features

- ✅ CRUD operations for student records
- ✅ Automatic grade calculation
- ✅ Server-side input validation
- ✅ Unique roll number validation
- ✅ File-based data persistence
- ✅ Dynamic EJS views

---

## Tech Stack

- Node.js
- Express
- EJS
- HTML/CSS

---

## Project Structure

```text
.
├── app.js
├── package.json
├── data/
│   └── students.json
├── public/
│   └── css/
│       └── styles.css
└── views/
    ├── index.ejs
    ├── form.ejs
    ├── 404.ejs
    └── partials/
        ├── header.ejs
        └── footer.ejs
```

---

## Prerequisites

- Node.js 18+ (recommended)
- npm

Check versions:

```bash
node -v
npm -v
```

---

## Installation & Run

1. Clone/download this project.
2. Open terminal in the project root.
3. Install dependencies:

```bash
npm install
```

4. Start the app:

```bash
npm start
```

5. Open browser:

```text
http://localhost:3000
```

---

## Development Run

You can also run:

```bash
npm run dev
```

(Currently this runs the same command as start.)

---

## How It Works

- `GET /students` → List all students
- `GET /students/new` → Show add form
- `POST /students` → Create student record
- `GET /students/:id/edit` → Show edit form
- `POST /students/:id/update` → Update student record
- `POST /students/:id/delete` → Delete student record

The app computes:
- `total = math + science + english`
- `average = total / 3`
- `grade` using:
  - `A+` for 90+
  - `A` for 80–89.99
  - `B` for 70–79.99
  - `C` for 60–69.99
  - `D` for 50–59.99
  - `F` below 50

---

## Validation Rules

- Name is required
- Roll number is required
- Roll number must be unique
- Marks must be numeric
- Marks must be between 0 and 100

---

## Data Persistence

All records are saved in:

- `data/students.json`

If the file/folder does not exist, it is created automatically on first request.

---

## Troubleshooting

### 1) `npm install` fails (403 / registry restrictions)
This is usually an environment or network policy issue.

Try:
- Switching network/VPN
- Checking npm registry config:

```bash
npm config get registry
```

Expected:

```text
https://registry.npmjs.org/
```

Set it if needed:

```bash
npm config set registry https://registry.npmjs.org/
```

Then retry:

```bash
npm install
```

### 2) Port already in use
Set a custom port:

```bash
PORT=4000 npm start
```

Open `http://localhost:4000`.

---

## Future Improvements

- Use MongoDB + Mongoose for database persistence
- Add authentication for teachers/admin
- Add subject extensibility and customizable grading scales
- Add export (CSV/PDF) and print-friendly reports

---

## License

For educational/demo use.
