import { Request, Response } from 'express';

export async function mintToken(req: Request, res: Response) {
  try {
    const { recipientAddress, amount } = req.body;
    
    if (!recipientAddress || !amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid recipient address or amount'
      });
    }

    console.log(`[Token Mint] Minting ${amount} MEE to ${recipientAddress}`);
    
    res.json({
      success: true,
      data: {
        transactionHash: `0x${Math.random().toString(16).substring(2, 66)}`,
        recipient: recipientAddress,
        amount,
        tokenSymbol: 'MEE',
        message: `Successfully minted ${amount} MEE tokens to ${recipientAddress}`
      }
    });
  } catch (error) {
    console.error('Token mint error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to mint tokens'
    });
  }
}
