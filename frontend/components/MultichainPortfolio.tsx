import React, { useEffect, useState } from 'react';

const CONTRACT = '0x318059eb1254Ad209BCc0950451197333cEF650C';

const MultichainPortfolio: React.FC<{ wallet: string }> = ({ wallet }) => {
    const [portfolio, setPortfolio] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPortfolio() {
            setLoading(true);
            const res = await fetch(`/api/portfolio?wallet=${wallet}`);
            const data = await res.json();
            setPortfolio(data);
            setLoading(false);
        }
        if (wallet) fetchPortfolio();
    }, [wallet]);

    return (
        <div style={{ margin: '2rem 0' }}>
            <h3>Multichain Portfolio (T2P/MEE)</h3>
            {loading ? <div>Loading...</div> : (
                <ul>
                    {portfolio.length === 0 && <li>No T2P/MEE found on any chain.</li>}
                    {portfolio.map((token, i) => (
                        <li key={i}>
                            {token.chain_name || token.chain_id}: {token.balance / 10 ** (token.contract_decimals || 18)} {token.contract_ticker_symbol}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MultichainPortfolio;
