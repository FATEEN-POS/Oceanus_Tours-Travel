// ===== Oceanus Data Layer — Google Sheets Backend =====
const GAS_URL = 'https://script.google.com/macros/s/AKfycbxke_cnErKqeAr7H2-y0OaT5MZm1oVE49AS6Qy0eIGjegQUAbM2MdJJ0QuQfVzrfRCE/exec';

const Cache = {
  get: (key) => { try { return JSON.parse(localStorage.getItem('oc_' + key)); } catch { return null; } },
  set: (key, val) => { try { localStorage.setItem('oc_' + key, JSON.stringify(val)); } catch {} },
  clear: (key) => localStorage.removeItem('oc_' + key),
};

async function gasGet(tab) {
  const res = await fetch(`${GAS_URL}?action=read&tab=${tab}`);
  const json = await res.json();
  if (json.status !== 'ok') throw new Error('Read failed: ' + tab);
  return json.data;
}

async function gasPost(tab, data) {
  const res = await fetch(GAS_URL, {
    method: 'POST',
    body: JSON.stringify({ action: 'write', tab, data }),
  });
  const json = await res.json();
  if (json.status !== 'ok') throw new Error('Write failed: ' + tab);
}

const Schemas = {
  cars:       ['id','plate','type','capacity','driver','status'],
  locations:  ['id','name','type','distance','duration'],
  costs:      ['id','date','type','description','amount','carId'],
  operations: ['id','date','carId','locationId','supplier','revenue','notes'],
};

const numericFields = new Set(['id','amount','carId','locationId','capacity','distance','revenue']);

function rowsToObjects(tab, rows) {
  if (!rows || rows.length < 2) return [];
  const headers = Schemas[tab];
  return rows.slice(1).filter(r => r[0] !== '' && r[0] !== undefined && r[0] !== null).map(row => {
    const obj = {};
    headers.forEach((h, i) => {
      const v = row[i];
      if (numericFields.has(h)) {
        obj[h] = (v === '' || v === null || v === undefined) ? null : Number(v);
      } else {
        obj[h] = (v === undefined || v === null) ? '' : String(v);
      }
    });
    return obj;
  });
}

function objectsToRows(tab, objects) {
  const headers = Schemas[tab];
  const rows = [headers];
  objects.forEach(obj => {
    rows.push(headers.map(h => (obj[h] !== undefined && obj[h] !== null) ? obj[h] : ''));
  });
  return rows;
}

function showLoader(msg = 'جاري التحميل...') {
  let el = document.getElementById('_gasLoader');
  if (!el) {
    el = document.createElement('div');
    el.id = '_gasLoader';
    el.style.cssText = 'position:fixed;inset:0;background:rgba(26,58,92,0.6);backdrop-filter:blur(4px);z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1rem;font-family:Tajawal,sans-serif;color:white;font-size:1.1rem;font-weight:600';
    el.innerHTML = '<div style="width:48px;height:48px;border:4px solid rgba(255,255,255,0.25);border-top-color:white;border-radius:50%;animation:_spin .8s linear infinite"></div><div id="_gasMsg"></div><style>@keyframes _spin{to{transform:rotate(360deg)}}</style>';
    document.body.appendChild(el);
  }
  document.getElementById('_gasMsg').textContent = msg;
  el.style.display = 'flex';
}
function hideLoader() {
  const el = document.getElementById('_gasLoader');
  if (el) el.style.display = 'none';
}

const DB = {
  async fetchTab(tab, force = false) {
    if (!force) {
      const cached = Cache.get(tab);
      if (cached) return cached;
    }
    const rows = await gasGet(tab);
    const objs = rowsToObjects(tab, rows);
    Cache.set(tab, objs);
    return objs;
  },

  async saveTab(tab, objects) {
    Cache.set(tab, objects);
    await gasPost(tab, objectsToRows(tab, objects));
  },

  // ── Cars ──
  async getCars()          { return DB.fetchTab('cars'); },
  async setCars(d)         { return DB.saveTab('cars', d); },
  async addCar(car)        { const a = await DB.getCars(); car.id = Date.now(); a.push(car); await DB.setCars(a); return car; },
  async deleteCar(id)      { const a = await DB.getCars(); await DB.setCars(a.filter(c => c.id != id)); },

  // ── Locations ──
  async getLocations()     { return DB.fetchTab('locations'); },
  async setLocations(d)    { return DB.saveTab('locations', d); },
  async addLocation(loc)   { const a = await DB.getLocations(); loc.id = Date.now(); a.push(loc); await DB.setLocations(a); return loc; },
  async deleteLocation(id) { const a = await DB.getLocations(); await DB.setLocations(a.filter(l => l.id != id)); },

  // ── Costs ──
  async getCosts()         { return DB.fetchTab('costs'); },
  async setCosts(d)        { return DB.saveTab('costs', d); },
  async addCost(cost)      { const a = await DB.getCosts(); cost.id = Date.now(); cost.date = cost.date || new Date().toISOString().split('T')[0]; a.push(cost); await DB.setCosts(a); return cost; },
  async deleteCost(id)     { const a = await DB.getCosts(); await DB.setCosts(a.filter(c => c.id != id)); },

  // ── Operations ──
  async getOperations()    { return DB.fetchTab('operations'); },
  async setOperations(d)   { return DB.saveTab('operations', d); },
  async addOperation(op)   { const a = await DB.getOperations(); op.id = Date.now(); op.date = op.date || new Date().toISOString().split('T')[0]; a.push(op); await DB.setOperations(a); return op; },
  async deleteOperation(id){ const a = await DB.getOperations(); await DB.setOperations(a.filter(o => o.id != id)); },

  async refreshAll() { ['cars','locations','costs','operations'].forEach(t => Cache.clear(t)); },

  async exportToJSON() {
    showLoader('جاري التصدير...');
    try {
      const data = {
        cars:       await DB.fetchTab('cars', true),
        locations:  await DB.fetchTab('locations', true),
        costs:      await DB.fetchTab('costs', true),
        operations: await DB.fetchTab('operations', true),
        exportedAt: new Date().toISOString()
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob); a.download = 'oceanus_backup_' + new Date().toISOString().split('T')[0] + '.json'; a.click();
    } finally { hideLoader(); }
  },

  importFromJSON(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          showLoader('جاري الاستيراد...');
          const data = JSON.parse(e.target.result);
          if (data.cars)       await DB.setCars(data.cars);
          if (data.locations)  await DB.setLocations(data.locations);
          if (data.costs)      await DB.setCosts(data.costs);
          if (data.operations) await DB.setOperations(data.operations);
          resolve();
        } catch { reject(new Error('ملف غير صالح')); }
        finally { hideLoader(); }
      };
      reader.readAsText(file);
    });
  },

  async seedDemo() {
    try {
      showLoader('جاري الاتصال بـ Google Sheets...');
      const cars = await DB.fetchTab('cars', true);
      if (cars.length > 0) return;
      showLoader('أول تشغيل — جاري إنشاء البيانات التجريبية...');
      await DB.setCars([
        {id:1,plate:'أ ب ج 1234',type:'باص',capacity:50,driver:'محمد أحمد',status:'متاح'},
        {id:2,plate:'د هـ و 5678',type:'ميكروباص',capacity:14,driver:'خالد محمود',status:'في رحلة'},
        {id:3,plate:'ز ح ط 9012',type:'باص',capacity:45,driver:'عمر حسن',status:'صيانة'},
        {id:4,plate:'ي ك ل 3456',type:'سيارة خاصة',capacity:7,driver:'سامي علي',status:'متاح'},
      ]);
      await DB.setLocations([
        {id:1,name:'أبو سمبل',type:'داخلي',distance:890,duration:'2 يوم'},
        {id:2,name:'السد العالي',type:'داخلي',distance:880,duration:'1 يوم'},
        {id:3,name:'فيله',type:'داخلي',distance:885,duration:'1 يوم'},
        {id:4,name:'المسله',type:'داخلي',distance:870,duration:'1 يوم'},
      ]);
      await DB.setOperations([
        {id:1,date:'2025-03-01',carId:1,locationId:1,supplier:'أبو سمبل',revenue:5000,notes:'رحلة ناجحة'},
        {id:2,date:'2025-03-03',carId:2,locationId:2,supplier:'السد',revenue:3500,notes:''},
        {id:3,date:'2025-03-05',carId:1,locationId:3,supplier:'فيله',revenue:4200,notes:'مجموعة كبيرة'},
        {id:4,date:'2025-03-10',carId:4,locationId:4,supplier:'المسله',revenue:2800,notes:''},
      ]);
      await DB.setCosts([
        {id:1,date:'2025-03-01',type:'ثابت',description:'إيجار مكتب',amount:3000,carId:null},
        {id:2,date:'2025-03-01',type:'متغير',description:'بنزين رحلة أبو سمبل',amount:800,carId:1},
        {id:3,date:'2025-03-03',type:'متغير',description:'بنزين رحلة السد',amount:450,carId:2},
        {id:4,date:'2025-03-05',type:'أخري',description:'مطبوعات وإعلانات',amount:600,carId:null},
        {id:5,date:'2025-03-05',type:'متغير',description:'بنزين رحلة فيله',amount:700,carId:1},
        {id:6,date:'2025-03-10',type:'متغير',description:'بنزين رحلة المسله',amount:350,carId:4},
      ]);
    } finally { hideLoader(); }
  }
};
