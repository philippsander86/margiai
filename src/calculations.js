export const money = n => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n || 0);
export const pct = n => `${(n || 0).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%`;
export const calcUnit = (product, channel, price) => {
  const base = Number(product?.cmv || 0) + (product?.costs || []).reduce((s, c) => s + Number(c.value || 0), 0);
  const variable = (channel?.costs || []).filter(c => c.type === 'percent').reduce((s, c) => s + price * Number(c.value || 0) / 100, 0);
  const fixed = (channel?.costs || []).filter(c => c.type === 'fixed').reduce((s, c) => s + Number(c.value || 0), 0);
  const margin = price - base - variable - fixed;
  return { base, variable, fixed, margin, marginPct: price ? margin / price * 100 : 0 };
};
export function enrich(state) { return state.sales.map(s => { const p = state.products.find(x => x.id === s.productId); const c = state.channels.find(x => x.id === s.channelId); const x = calcUnit(p, c, Number(s.price)); return { ...s, product: p, channel: c, revenue: s.quantity * s.price, margin: x.margin * s.quantity, unitMargin: x.margin, marginPct: x.marginPct }; }); }
export function profile(row, all) { const avgMargin = all.reduce((s, x) => s + x.marginPct, 0) / (all.length || 1); const avgRevenue = all.reduce((s, x) => s + x.revenue, 0) / (all.length || 1); const highVolume = row.quantity >= all.reduce((s, x) => s + x.quantity, 0) / (all.length || 1); if (row.marginPct >= avgMargin && highVolume) return ['ESTRELA', 'Preservar preço']; if (row.margin >= all.reduce((s,x) => s+x.margin,0)/(all.length || 1) && row.marginPct < avgMargin) return ['GERADOR DE CAIXA', 'Escalar']; if (row.marginPct >= avgMargin && row.revenue < avgRevenue) return ['OPORTUNIDADE', 'Observar']; return ['DRENADOR', row.marginPct < 10 ? 'Revisar custo' : 'Revisar preço']; }
