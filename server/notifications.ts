/**
 * Notification service for Auditor Dashboard
 * Sends notifications when refund logs are flagged
 */

import { RefundFlag } from './types.js';

/**
 * Send notification to Discord webhook
 * @param refundId - ID of the flagged refund
 * @param reason - Reason for flagging
 * @param flaggedBy - Address of the user who flagged
 */
export async function notifyAuditorTeam(
  refundId: string,
  reason: string,
  flaggedBy: string
): Promise<void> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  // If no webhook URL is configured, just log to console
  if (!webhookUrl) {
    console.log('📣 Discord webhook not configured. Log flag notification:');
    console.log(`🚨 Refund Log Flagged`);
    console.log(`Refund ID: ${refundId}`);
    console.log(`Reason: ${reason}`);
    console.log(`Flagged By: ${flaggedBy}`);
    return;
  }

  const payload = {
    content: `🚨 **Refund Log Flagged**\n\n**Refund ID:** ${refundId}\n**Reason:** ${reason}\n**Flagged By:** ${flaggedBy}\n**Time:** ${new Date().toISOString()}`,
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Discord webhook failed: ${response.statusText}`);
    }

    console.log('✅ Discord notification sent successfully');
  } catch (error) {
    console.error('❌ Failed to send Discord notification:', error);
    // Don't throw - notification failure shouldn't fail the flag operation
  }
}

/**
 * Send notification via email (placeholder for future implementation)
 */
export async function notifyViaEmail(
  refundId: string,
  reason: string,
  flaggedBy: string
): Promise<void> {
  console.log('📧 Email notification (not implemented yet):');
  console.log(`Refund ID: ${refundId}, Reason: ${reason}, Flagged By: ${flaggedBy}`);
}

/**
 * Send notification via Telegram (placeholder for future implementation)
 */
export async function notifyViaTelegram(
  refundId: string,
  reason: string,
  flaggedBy: string
): Promise<void> {
  console.log('📱 Telegram notification (not implemented yet):');
  console.log(`Refund ID: ${refundId}, Reason: ${reason}, Flagged By: ${flaggedBy}`);
}
