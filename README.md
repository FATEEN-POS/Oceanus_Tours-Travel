# 🌊 Oceanus — نظام إدارة التشغيلات

<div align="center">

![Oceanus](https://img.shields.io/badge/Oceanus-Tours%20%26%20Travel-1a3a5c?style=for-the-badge)
![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Google Sheets](https://img.shields.io/badge/Google%20Sheets-34A853?style=for-the-badge&logo=google-sheets&logoColor=white)

**نظام إدارة متكامل لشركات السياحة — ملف HTML واحد، بيانات على Google Sheets**

[العربية](#-بالعربي) • [English](#-english)

</div>

---

## 🇪🇬 بالعربي

### 📌 عن المشروع

Oceanus هو نظام إدارة متكامل مصمم خصيصاً لشركات السياحة والرحلات. يعمل من ملف HTML واحد بدون سيرفر، والبيانات محفوظة على Google Sheets وتشتغل من أي جهاز في أي مكان.

### ✨ المميزات الرئيسية

- 🚌 **العربيات** — تسجيل الأسطول ومتابعة كل عربية وإيراداتها
- 🚀 **التشغيلات** — تسجيل الرحلات اليومية مع الوجهة والعربية والإيراد
- 💸 **المصاريف** — تصنيف المصاريف (ثابتة / متغيرة / أخرى)
- 📊 **التقارير** — إحصائيات تفصيلية وصافي الربح لكل فترة
- ☁️ **Google Sheets** — البيانات على السحابة، تشتغل من أي جهاز
- ⚡ **Cache ذكي** — سرعة عرض عالية مع مزامنة تلقائية
- 📱 **Responsive** — يعمل على الكمبيوتر والموبايل

### 🗂️ هيكل النظام

```
oceanus/
└── index.html    ← النظام كامل في ملف واحد
```

النظام مبني على معمارية Modules داخل ملف HTML واحد:

| الموديول | الوظيفة |
|----------|---------|
| `SheetsAPI` | الاتصال بـ Google Sheets عبر JSONP |
| `VehiclesModule` | إدارة العربيات |
| `OperationsModule` | إدارة التشغيلات |
| `ExpensesModule` | إدارة المصاريف |
| `ReportsModule` | التقارير والإحصائيات |
| `App` | التنقل والتهيئة العامة |

### ⚙️ طريقة الإعداد

#### 1. إعداد Google Sheets

1. افتح [sheets.google.com](https://sheets.google.com) وأنشئ شيت جديد
2. من القايمة: **Extensions → Apps Script**
3. الصق الكود التالي:

```javascript
function doGet(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet();
    const action = e && e.parameter ? e.parameter.action : '';
    const tab    = e && e.parameter ? e.parameter.tab : '';
    const cb     = e && e.parameter ? e.parameter.callback : '';
    let sh = sheet.getSheetByName(tab);
    if (!sh) sh = sheet.insertSheet(tab);
    const data = action === 'read' ? sh.getDataRange().getValues() : [['']];
    const json = JSON.stringify({ status: 'ok', data });
    const output = cb ? `${cb}(${json})` : json;
    return ContentService.createTextOutput(output)
      .setMimeType(cb ? ContentService.MimeType.JAVASCRIPT : ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet();
    const body  = JSON.parse(e.postData.contents);
    let sh = sheet.getSheetByName(body.tab);
    if (!sh) sh = sheet.insertSheet(body.tab);
    if (body.action === 'write' && body.data && body.data.length > 0) {
      sh.clearContents();
      sh.getRange(1, 1, body.data.length, body.data[0].length).setValues(body.data);
    }
    return ContentService.createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. **Deploy → New Deployment → Web App**
5. اختار: Execute as **Me** | Who has access **Anyone**
6. انسخ الـ **Web App URL**

#### 2. ربط الـ URL بالنظام

في `index.html`، ابحث عن:
```javascript
const GAS_URL = 'YOUR_URL_HERE';
```
وحط الـ URL بتاعك.

#### 3. تشغيل النظام

افتح `index.html` في أي متصفح — لا يحتاج سيرفر أو إعداد إضافي.

### 🛠️ التقنيات

| التقنية | الاستخدام |
|---------|-----------|
| HTML5 / CSS3 | الواجهة والتصميم |
| Vanilla JavaScript | المنطق البرمجي |
| Google Apps Script | Backend مجاني |
| Google Sheets | قاعدة البيانات |
| JSONP | تجاوز قيود CORS |
| Cairo Font | الخط العربي |

### 🔒 الأمان

- البيانات محفوظة في حساب Google الخاص بك
- لا توجد بيانات ترسل لأي طرف ثالث
- الـ Apps Script يعمل تحت صلاحيات حسابك فقط
- راجع [SECURITY.md](SECURITY.md) للتفاصيل

---

## 🌍 English

### 📌 About

Oceanus is a complete management system built for tourism and travel companies. It runs from a single HTML file with no server required — data is stored in Google Sheets and accessible from any device, anywhere.

### ✨ Key Features

- 🚌 **Vehicles** — Fleet management with per-vehicle revenue tracking
- 🚀 **Operations** — Daily trip logging with destination, vehicle, and revenue
- 💸 **Expenses** — Categorized costs (fixed / variable / other)
- 📊 **Reports** — Detailed analytics and net profit per period
- ☁️ **Google Sheets** — Cloud-stored data, works on any device
- ⚡ **Smart Cache** — Fast rendering with automatic sync
- 📱 **Responsive** — Works on desktop and mobile

### 🗂️ System Structure

```
oceanus/
└── index.html    ← Entire system in one file
```

| Module | Function |
|--------|----------|
| `SheetsAPI` | Google Sheets connection via JSONP |
| `VehiclesModule` | Vehicle management |
| `OperationsModule` | Operations management |
| `ExpensesModule` | Expense management |
| `ReportsModule` | Reports and analytics |
| `App` | Navigation and initialization |

### ⚙️ Setup

#### 1. Google Sheets

1. Open [sheets.google.com](https://sheets.google.com) and create a new spreadsheet
2. Go to **Extensions → Apps Script**
3. Paste the Apps Script code shown in the Arabic section above
4. **Deploy → New Deployment → Web App**
5. Set: Execute as **Me** | Who has access **Anyone**
6. Copy the **Web App URL**

#### 2. Connect

In `index.html`, find and replace:
```javascript
const GAS_URL = 'YOUR_URL_HERE';
```

#### 3. Run

Open `index.html` in any browser — no server needed.

### 🛠️ Tech Stack

| Technology | Usage |
|------------|-------|
| HTML5 / CSS3 | UI and styling |
| Vanilla JavaScript | Business logic |
| Google Apps Script | Free backend |
| Google Sheets | Database |
| JSONP | CORS bypass |
| Cairo Font | Arabic typography |

### 📄 License

MIT License — free to use and modify.

---

<div align="center">
Made with ❤️ for Oceanus Tours & Travel 🌊
</div>
