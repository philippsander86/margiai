const DEMO = {
  products: [
    ['PP05-LIMOEIRO',24.9],['PP05-MEUPEDELIMOEIRO',24.9],['PPA05-LIMOEIRO',54.9],['PP05-LIMOEIROGALINHO',24.9],['PP05-CORDELSANFONA',24.9],['PP05-JARDIMOUTONO',24.9],['PPÃO-JARDIMENCANTADOPATOS',64.9],['PP05-JARDIMPATOS',24.9],['PPA05-MEUPEDELIMOEIRO',54.9],['PP05-BRISADOOCEANO',24.9]
  ].map(([sku,cmv], i) => ({ id: `p${i+1}`, sku, name: sku, category: '', cmv, costs: [], status: 'active' })),
  channels: [
    { id: 'c1', name: 'Nuvemshop', status: 'active', costs: [{ id: 'cc1', name: 'Parcelamento', type: 'percent', value: 9.99 }, { id: 'cc2', name: 'Impostos', type: 'percent', value: 7 }, { id: 'cc3', name: 'Frete', type: 'percent', value: 9 }, { id: 'cc4', name: 'Publicidade', type: 'percent', value: 20 }] }
  ],
  sales: []
};

const DB = 'margiai'; const STORE = 'state';
function clone(v) { return JSON.parse(JSON.stringify(v)); }
async function openDB() { return new Promise((resolve, reject) => { const r = indexedDB.open(DB, 1); r.onupgradeneeded = () => r.result.createObjectStore(STORE); r.onsuccess = () => resolve(r.result); r.onerror = () => reject(r.error); }); }
async function read() { try { const db = await openDB(); return await new Promise((resolve, reject) => { const r = db.transaction(STORE).objectStore(STORE).get('data'); r.onsuccess = () => resolve(r.result || clone(DEMO)); r.onerror = () => reject(r.error); }); } catch { return clone(DEMO); } }
async function write(data) { const db = await openDB(); return new Promise((resolve, reject) => { const r = db.transaction(STORE, 'readwrite').objectStore(STORE).put(data, 'data'); r.onsuccess = resolve; r.onerror = () => reject(r.error); }); }

export const repository = {
  async getState() { return read(); },
  async saveEntity(type, item) { const state = await read(); const list = state[type]; const i = list.findIndex(x => x.id === item.id); if (i >= 0) list[i] = item; else list.push(item); await write(state); return item; },
  async deleteEntity(type, id) { const state = await read(); state[type] = state[type].filter(x => x.id !== id); if (type === 'products') state.sales = state.sales.filter(x => x.productId !== id); if (type === 'channels') state.sales = state.sales.filter(x => x.channelId !== id); await write(state); },
  async importSales(sales) { const state = await read(); state.sales.push(...sales); await write(state); },
  async resetDemo() { await write(clone(DEMO)); }
};
