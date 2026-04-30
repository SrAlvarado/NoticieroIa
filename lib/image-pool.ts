// Curated Unsplash photo pools per category.
// A deterministic hash of the article's sourceUrl picks the image,
// so the same article always gets the same placeholder.

const BASE = "https://images.unsplash.com/photo-";
const Q = "?w=800&q=80&auto=format&fit=crop";

const POOLS: Record<string, string[]> = {
  claude: [
    `${BASE}1620712943543-bcc4688e7485${Q}`,
    `${BASE}1677442135722-5f5e58f3b8c8${Q}`,
    `${BASE}1676277791608-ac54525aa94d${Q}`,
    `${BASE}1685094488371-9d4df4c20ab5${Q}`,
    `${BASE}1671726203394-491c8b574a0a${Q}`,
    `${BASE}1668614038660-5f5bbba87f1c${Q}`,
    `${BASE}1635070041409-e63e783ce3c1${Q}`,
    `${BASE}1634133855292-a3d4f5b54bbd${Q}`,
  ],
  desarrollo: [
    `${BASE}1517694712202-14dd9538aa97${Q}`,
    `${BASE}1555066931-4365d14bab8c${Q}`,
    `${BASE}1518770660439-4636190af475${Q}`,
    `${BASE}1461749280684-dccba630e2f6${Q}`,
    `${BASE}1542831371-29b0f74f9713${Q}`,
    `${BASE}1629654297299-c8506221ca97${Q}`,
    `${BASE}1587620962725-abab7fe55159${Q}`,
    `${BASE}1498050108023-c5249f4df085${Q}`,
  ],
  herramientas: [
    `${BASE}1611162617213-7d7a39e9b1d7${Q}`,
    `${BASE}1551434678-e076c223a692${Q}`,
    `${BASE}1551288049-bebda4e38f71${Q}`,
    `${BASE}1618005182384-a83a8bd57fbe${Q}`,
    `${BASE}1614854262268-af37e55e4e09${Q}`,
    `${BASE}1581291518857-4d27a439ee16${Q}`,
    `${BASE}1460925895917-afdab827c52f${Q}`,
    `${BASE}1512941937669-90a1b58e7e9c${Q}`,
  ],
  noticias: [
    `${BASE}1636466497966-cd66abc2f5c6${Q}`,
    `${BASE}1504711434969-e33886168f5c${Q}`,
    `${BASE}1586339949916-3e9457bef6d3${Q}`,
    `${BASE}1488229297570-58520851e868${Q}`,
    `${BASE}1523961131990-5ea7c61b2107${Q}`,
    `${BASE}1451187580459-43490279c0fa${Q}`,
    `${BASE}1614332287897-cdc968ed0f9f${Q}`,
    `${BASE}1558494949-ef010cbdcc31${Q}`,
  ],
  cambios: [
    `${BASE}1633356122544-f134324a6cee${Q}`,
    `${BASE}1639762681485-074b7f938ba0${Q}`,
    `${BASE}1581090464777-f3220bbe1b8b${Q}`,
    `${BASE}1502945015378-0e284ca1a5be${Q}`,
    `${BASE}1537432917169-26ce1e9d8b84${Q}`,
    `${BASE}1556075798-4825dfaaf498${Q}`,
    `${BASE}1547234935-80c7145ec969${Q}`,
    `${BASE}1539020140153-e479b8c13e1c${Q}`,
  ],
};

function strHash(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h) ^ s.charCodeAt(i);
    h = h & h; // force 32-bit
  }
  return Math.abs(h);
}

export function pickFallbackImage(category: string, seed: string): string {
  const pool = POOLS[category] ?? POOLS.noticias;
  return pool[strHash(seed) % pool.length];
}
