# 🔒 Security Policy | سياسة الأمان

<div align="center">

[العربية](#-سياسة-الأمان) • [English](#-security-policy)

</div>

---

## 🇪🇬 سياسة الأمان

### نظرة عامة

Oceanus System يأخذ أمان البيانات على محمل الجد. هذا المستند يوضح كيفية تعاملنا مع البيانات، وكيف يتم حمايتها، وكيفية الإبلاغ عن أي ثغرات أمنية.

### كيف تُحفظ البيانات؟

| المكون | المكان | من يتحكم فيه |
|--------|--------|--------------|
| بيانات العربيات | Google Sheets | أنت (حساب Google الخاص بك) |
| بيانات التشغيلات | Google Sheets | أنت |
| بيانات المصاريف | Google Sheets | أنت |
| Cache مؤقت | localStorage في المتصفح | جهازك فقط |
| الكود | ملف HTML محلي أو GitHub | أنت |

**لا توجد بيانات تُرسل لأي خادم خارجي سوى Google Sheets.**

### معمارية الأمان

```
المتصفح  ──JSONP──►  Google Apps Script  ──►  Google Sheets
   │                        │
   │◄── البيانات ◄───────────┘
   │
   └── localStorage (cache مؤقت فقط)
```

- **JSONP للقراءة:** الطلبات تمر عبر script tag لتجاوز CORS
- **POST بـ no-cors للكتابة:** الكتابة تذهب مباشرة لـ Apps Script
- **لا يوجد authentication:** النظام مصمم للاستخدام الداخلي فقط

### المخاطر المعروفة والتوصيات

#### ⚠️ الـ Apps Script URL عام
الـ Web App URL يمكن لأي شخص يعرفه أن يقرأ أو يكتب البيانات.

**التوصية:**
- لا تشارك الـ URL خارج الفريق
- يمكنك تغيير الـ URL في أي وقت عبر عمل Deployment جديد
- للحماية الإضافية: أضف token سري في الكود

#### ⚠️ لا يوجد تشفير للبيانات
البيانات في Google Sheets غير مشفرة (تشفير Google الافتراضي فقط).

**التوصية:**
- لا تخزن بيانات شخصية حساسة (أرقام بطاقات، كلمات مرور)
- استخدم Google Workspace للحسابات المؤسسية للحصول على تشفير أقوى

#### ⚠️ الـ Cache في localStorage
البيانات المؤقتة في المتصفح يمكن لأي شخص له وصول للجهاز أن يراها.

**التوصية:**
- تجنب استخدام النظام على أجهزة عامة (كافيهات إنترنت)
- امسح الـ cache بعد الانتهاء من الاستخدام على الأجهزة المشتركة

### الإصدارات المدعومة

| الإصدار | الدعم الأمني |
|---------|-------------|
| الأخير (main) | ✅ مدعوم |
| الإصدارات القديمة | ❌ غير مدعومة |

### الإبلاغ عن ثغرة أمنية

إذا اكتشفت ثغرة أمنية، يرجى **عدم** نشرها في الـ Issues العامة.

بدلاً من ذلك:
1. افتح **Security Advisory** من تبويب Security في GitHub
2. أو راسلنا مباشرة عبر البريد الإلكتروني

سنتعامل مع التقرير خلال **48 ساعة** ونُصدر إصلاحاً خلال **7 أيام** للثغرات الحرجة.

### أفضل الممارسات للمستخدمين

- ✅ استخدم حساب Google مخصص للعمل
- ✅ فعّل التحقق بخطوتين على حساب Google
- ✅ راجع صلاحيات Apps Script بشكل دوري
- ✅ احتفظ بنسخة احتياطية من البيانات شهرياً
- ❌ لا تشارك الـ Apps Script URL مع أشخاص خارج الفريق
- ❌ لا تخزن بيانات حساسة (أرقام بنوك، كلمات مرور)

---

## 🌍 Security Policy

### Overview

Oceanus System takes data security seriously. This document explains how we handle data, how it is protected, and how to report security vulnerabilities.

### How is Data Stored?

| Component | Location | Who Controls It |
|-----------|----------|----------------|
| Vehicle data | Google Sheets | You (your Google account) |
| Operations data | Google Sheets | You |
| Expense data | Google Sheets | You |
| Temporary cache | Browser localStorage | Your device only |
| Code | Local HTML file or GitHub | You |

**No data is sent to any external server other than Google Sheets.**

### Security Architecture

```
Browser  ──JSONP──►  Google Apps Script  ──►  Google Sheets
   │                        │
   │◄── Data ◄──────────────┘
   │
   └── localStorage (temporary cache only)
```

- **JSONP for reads:** Requests go through script tags to bypass CORS
- **POST with no-cors for writes:** Writes go directly to Apps Script
- **No authentication:** System is designed for internal use only

### Known Risks & Recommendations

#### ⚠️ Apps Script URL is Public
Anyone who knows the Web App URL can read or write data.

**Recommendation:**
- Do not share the URL outside your team
- You can change the URL at any time by creating a new Deployment
- For extra protection: add a secret token in the code

#### ⚠️ Data is Not Encrypted
Data in Google Sheets is not encrypted beyond Google's default encryption.

**Recommendation:**
- Do not store sensitive personal data (card numbers, passwords)
- Use Google Workspace for organizational accounts for stronger encryption

#### ⚠️ localStorage Cache
Temporary browser data can be seen by anyone with access to the device.

**Recommendation:**
- Avoid using the system on public devices (internet cafes)
- Clear cache after use on shared devices

### Supported Versions

| Version | Security Support |
|---------|-----------------|
| Latest (main) | ✅ Supported |
| Older versions | ❌ Not supported |

### Reporting a Vulnerability

If you discover a security vulnerability, please **do not** post it in public Issues.

Instead:
1. Open a **Security Advisory** from the Security tab on GitHub
2. Or contact us directly via email

We will respond within **48 hours** and release a fix within **7 days** for critical vulnerabilities.

### Best Practices for Users

- ✅ Use a dedicated work Google account
- ✅ Enable two-factor authentication on your Google account
- ✅ Review Apps Script permissions periodically
- ✅ Keep a monthly backup of your data
- ❌ Do not share the Apps Script URL with people outside your team
- ❌ Do not store sensitive data (bank numbers, passwords)

---

<div align="center">
🔒 Oceanus Tours & Travel — Security First
</div>
