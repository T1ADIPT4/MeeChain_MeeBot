// Proxy API route for fetching Multichain Portfolio for T2P/MEE using Covalent API
// Replace Vercel types with standard types
const COVALENT_API_KEY = process.env.COVALENT_API_KEY || 'YOUR_COVALENT_KEY';
const CONTRACT = '0x318059eb1254Ad209BCc0950451197333cEF650C';

export default async function handler(req: any, res: any) {
  const { wallet } = req.query;
  if (!wallet) return res.status(400).json({ error: 'Missing wallet address' });
  const url = `https://api.covalenthq.com/v1/xy=k/address/${wallet}/balances_v2/?key=${COVALENT_API_KEY}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    // filter only T2P/MEE tokens
    const t2pTokens = (data.data?.items || []).filter(
      (item: any) => item.contract_address?.toLowerCase() === CONTRACT.toLowerCase()
    );
    res.status(200).json(t2pTokens);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch portfolio', details: e });
  }
}
