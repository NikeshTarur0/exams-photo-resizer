# 🇮🇳 Indian Exam Photo & Signature Resizer

A web application designed to help Indian competitive exam candidates (UPSC, SSC CGL/CHSL, IBPS, NTA NEET, NTA JEE, SBI PO, GATE, RRB NTPC) instantly crop, resize, and compress photos and signatures according to strict official government guidelines.

---

## 🌟 Key Features

1. **Preset Library**: Standardized specifications (dimensions, file size min/max KB, background color, ink rules) for top Indian exams pre-loaded.
2. **Instant Client-Side Engine**: Performs fast HTML5 Canvas rendering and iterative binary-search compression directly inside the browser.
3. **Real-time Compliance Meter**: Visual size badge and progress indicator verifying if the generated file complies with min/max KB constraints.
4. **Python Pillow Fallback**: Server-side fallback (`compressor.py`) callable via PHP API (`api/process.php`) for deep pixel resampling when browser limits are reached.
5. **MySQL Relational Database**: Structured database schema storing recruitment bodies and document requirement limits with fallbacks for offline testing.

---

## 📁 Project Structure

```
indian-exam-resizer/
├── schema.sql           # MySQL database schema definition
├── seed.sql             # SQL seed script with official UPSC, SSC, IBPS, NEET exam criteria
├── db.php               # PDO database connection script with offline fallback array
├── compressor.py        # Python 3 script using Pillow (PIL) for server-side image compression
├── api/
│   ├── exams.php        # REST API endpoint returning exam presets JSON
│   └── process.php      # REST API endpoint invoking Python image compressor fallback
├── index.html           # Main user interface (HTML5 semantic layout)
├── style.css            # Modern Glassmorphism CSS Design system with Dark/Light themes
├── app.js               # Client-side Canvas engine, UI event handlers, and compression logic
└── README.md            # Installation and usage instructions
```

---

## 🚀 Quick Setup & Local Server Instructions

### Option A: Direct Web App Execution (Zero-Setup / Standalone)
Simply open `index.html` in any modern browser (Chrome, Firefox, Edge, Safari).
> The app includes built-in offline preset fallbacks and client-side HTML5 Canvas resizing, so all core features will work immediately without setting up MySQL or PHP!

---

### Option B: Full Stack Run (PHP + MySQL + Python)

#### 1. Setup MySQL Database
Import the single unified database script `database.sql` into your local MySQL instance:
```bash
mysql -u root -p < database.sql
```

#### 2. Install Python Pillow Dependency (for Server Fallback)
```bash
pip install Pillow
```

#### 3. Launch PHP Built-in Dev Server
Run from the root of `indian-exam-resizer`:
```bash
php -S localhost:8000
```
Then navigate to `http://localhost:8000` in your web browser.

---

## 🧪 Testing Python Compressor CLI directly
You can also run the Python engine directly via command line:
```bash
python compressor.py --input sample.jpg --width 350 --height 450 --min-kb 20 --max-kb 50 --output photo_resized.jpg
```

---

## 📜 License
MIT License - Created for Indian Exam Applicants & Developers.
