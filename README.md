# 🌊 Oceanus Tours & Travel — نظام إدارة شركة السياحة

<div align="center">

![Oceanus](https://img.shields.io/badge/Oceanus-Tours%20%26%20Travel-1a3a5c?style=for-the-badge)
![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Google Sheets](https://img.shields.io/badge/Google%20Sheets-34A853?style=for-the-badge&logo=google-sheets&logoColor=white)

**نظام إدارة متكامل لشركات السياحة — يعمل من أي جهاز بدون سيرفر**

[English](#english) • [عربي](#arabic)

</div>

---

<a name="arabic"></a>
## 🇪🇬 بالعربي

### 📌 عن المشروع

Oceanus هو نظام إدارة متكامل مصمم لشركات السياحة والرحلات. يتيح للمدير متابعة العربيات والرحلات والمصاريف والأرباح من أي جهاز، مع حفظ البيانات مباشرة في Google Sheets.

### ✨ المميزات

- 🚌 **إدارة العربيات** — تسجيل الأسطول وحالة كل عربية وإيراداتها
- 📍 **التشغيلات** — تسجيل الرحلات اليومية مع الوجهة والإيراد والعربية
- 💸 **المصاريف** — تصنيف المصاريف (ثابتة / متغيرة / أخرى) مع ربطها بالعربيات
- 📊 **التقارير** — جرافيكس تفاعلية، صافي الربح، ملخص كل عربية، تصدير CSV
- ☁️ **Google Sheets كداتا بيز** — البيانات محفوظة على السحابة وتشتغل من أي جهاز
- 🔄 **Cache ذكي** — سرعة عرض عالية مع cache محلي وتحديث من Sheets عند الحاجة

### 🗂️ الصفحات

| الملف | الصفحة |
|-------|--------|
| `index.html` | الرئيسية — إحصائيات سريعة وآخر النشاط |
| `cars.html` | العربيات — إضافة وتعديل وحذف |
| `location.html` | التشغيلات — تسجيل الرحلات والإيرادات |
| `cost.html` | المصاريف — ثابتة ومتغيرة وأخرى |
| `report.html` | التقارير — أرباح وجرافيكس وتصدير |
| `shared.js` | طبقة البيانات — الاتصال بـ Google Sheets |
| `style.css` | التصميم العام |

### ⚙️ طريقة التشغيل

#### 1. إعداد Google Sheets

1. افتح [sheets.google.com](https://sheets.google.com) وأنشئ شيت جديد
2. من القايمة: **Extensions → Apps Script**
3. الصق الكود التالي واحفظه:

```javascript
function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet();
  const tab = e.parameter.tab;
  if (e.parameter.action === 'read') {
    const data = sheet.getSheetByName(tab).getDataRange().getValues();
    return ContentService.createTextOutput(JSON.stringify({status:'ok', data}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet();
  const body = JSON.parse(e.postData.contents);
  const sh = sheet.getSheetByName(body.tab) || sheet.insertSheet(body.tab);
  if (body.action === 'write') {
    sh.clearContents();
    sh.getRange(1, 1, body.data.length, body.data[0].length).setValues(body.data);
  }
  return ContentService.createTextOutput(JSON.stringify({status:'ok'}))
    .setMimeType(ContentService.MimeType.JSON);
}
```

4. اضغط **Deploy → New Deployment → Web App**
5. اختار:
   - Execute as: **Me**
   - Who has access: **Anyone**
6. انسخ الـ **Web App URL**

#### 2. ربط المشروع بالـ URL

في ملف `shared.js`، غير السطر الأول:

```javascript
const GAS_URL = 'YOUR_WEB_APP_URL_HERE';
```

#### 3. تشغيل المشروع

افتح `index.html` في أي متصفح — لا يحتاج سيرفر.

### 🛠️ التقنيات المستخدمة

- **HTML5 / CSS3 / Vanilla JavaScript** — بدون أي framework
- **Google Apps Script** — كـ REST API مجاني
- **Google Sheets** — كداتا بيز على السحابة
- **Chart.js** — للجرافيكس والرسوم البيانية
- **Google Fonts (Tajawal + Pacifico)** — للخطوط

### 📦 هيكل المشروع

```
oceanus/
├── index.html       ← الصفحة الرئيسية
├── cars.html        ← إدارة العربيات
├── location.html    ← التشغيلات والرحلات
├── cost.html        ← المصاريف
├── report.html      ← التقارير
├── shared.js        ← Data Layer (Google Sheets API)
├── style.css        ← التصميم
└── README.md        ← هذا الملف
```

---

<a name="english"></a>
## 🌍 English

### 📌 About

Oceanus is a full-featured management system built for tourism and travel companies. It allows managers to track vehicles, trips, expenses, and profits from any device — with data stored directly in Google Sheets, no server required.

### ✨ Features

- 🚌 **Fleet Management** — Register vehicles, track status and revenue per car
- 📍 **Operations** — Log daily trips with destination, assigned car, and revenue
- 💸 **Expenses** — Categorize costs (fixed / variable / other) linked to specific vehicles
- 📊 **Reports** — Interactive charts, net profit, per-car summary, CSV export
- ☁️ **Google Sheets as Database** — Cloud-stored data accessible from any device
- 🔄 **Smart Cache** — Fast local cache with on-demand sync from Sheets

### 🗂️ Pages

| File | Page |
|------|------|
| `index.html` | Dashboard — quick stats and recent activity |
| `cars.html` | Fleet — add, edit, delete vehicles |
| `location.html` | Operations — log trips and revenue |
| `cost.html` | Expenses — fixed, variable, and other |
| `report.html` | Reports — charts, profits, CSV export |
| `shared.js` | Data layer — Google Sheets connector |
| `style.css` | Global styles |

### ⚙️ Setup

#### 1. Google Sheets Setup

1. Open [sheets.google.com](https://sheets.google.com) and create a new spreadsheet
2. Go to **Extensions → Apps Script**
3. Paste the following code and save:

```javascript
function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet();
  const tab = e.parameter.tab;
  if (e.parameter.action === 'read') {
    const data = sheet.getSheetByName(tab).getDataRange().getValues();
    return ContentService.createTextOutput(JSON.stringify({status:'ok', data}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet();
  const body = JSON.parse(e.postData.contents);
  const sh = sheet.getSheetByName(body.tab) || sheet.insertSheet(body.tab);
  if (body.action === 'write') {
    sh.clearContents();
    sh.getRange(1, 1, body.data.length, body.data[0].length).setValues(body.data);
  }
  return ContentService.createTextOutput(JSON.stringify({status:'ok'}))
    .setMimeType(ContentService.MimeType.JSON);
}
```

4. Click **Deploy → New Deployment → Web App**
5. Set:
   - Execute as: **Me**
   - Who has access: **Anyone**
6. Copy the **Web App URL**

#### 2. Connect the Project

In `shared.js`, update the first line:

```javascript
const GAS_URL = 'YOUR_WEB_APP_URL_HERE';
```

#### 3. Run

Open `index.html` in any browser — no server needed.

### 🛠️ Tech Stack

- **HTML5 / CSS3 / Vanilla JavaScript** — no frameworks
- **Google Apps Script** — free REST API backend
- **Google Sheets** — cloud database
- **Chart.js** — charts and visualizations
- **Google Fonts (Tajawal + Pacifico)** — typography

### 📦 Project Structure

```
oceanus/
├── index.html       ← Dashboard
├── cars.html        ← Fleet management
├── location.html    ← Operations & trips
├── cost.html        ← Expense tracking
├── report.html      ← Reports & analytics
├── shared.js        ← Data Layer (Google Sheets API)
├── style.css        ← Styles
└── README.md        ← This file
```

### 📄 License

MIT License — free to use and modify.

---

<div align="center">
Made with ❤️ for Oceanus Tours & Travel 🌊
</div>
