export function simulateSocialAuth(provider: string) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        provider,
        socialId: `${provider.toLowerCase()}_${Date.now()}`,
        email: `user@${provider.toLowerCase()}.com`,
        firstName: "ผู้ใช้",
        lastName: "ทดสอบ",
        profileImageUrl: `https://via.placeholder.com/150?text=${provider}`
      });
    }, 1000);
  });
}

export function hashPin(pin: string): string {
  // In production, use proper bcrypt or similar
  return Buffer.from(pin).toString('base64');
}

export function generateWalletAddress(): string {
  const randomBytes = Array.from({ length: 20 }, () => 
    Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
  ).join('');
  return `0x${randomBytes}`;
}
