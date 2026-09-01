import 'dotenv/config';

/**
 * Mailisk helper to automatically fetch verification codes
 * Requires MAILISK_API_KEY and MAILISK_NAMESPACE environment variables
 */

export class MailtrapHelper {
  private apiKey: string;
  private namespace: string;
  private baseUrl = 'https://mailisk.net/api/v1';

  constructor() {
    this.apiKey = process.env.MAILISK_API_KEY || '';
    this.namespace = process.env.MAILISK_NAMESPACE || '';

    if (!this.apiKey || !this.namespace) {
      throw new Error(
        'Missing Mailisk credentials. Set MAILISK_API_KEY and MAILISK_NAMESPACE environment variables.'
      );
    }
  }

  /**
   * Get verification code from email via Mailisk API
   */
  async getVerificationCode(emailAddress: string): Promise<string> {
    console.log(`\n🔍 Fetching verification code for: ${emailAddress}`);

    for (let attempt = 1; attempt <= 20; attempt++) {
      try {
        console.log(`   Attempt ${attempt}/20: Searching inbox...`);

        // Search for emails to this address
        const response = await fetch(
          `${this.baseUrl}/mailbox?namespace=${this.namespace}&email=${emailAddress}`,
          {
            headers: {
              'Authorization': `Bearer ${this.apiKey}`,
            },
          }
        );

        if (!response.ok) {
          console.log(`   ⏳ Waiting for email...`);
          await this.sleep(2000);
          continue;
        }

        const data: any = await response.json();
        const emails = data.emails || [];

        if (!emails || emails.length === 0) {
          console.log(`   ⏳ No emails yet...`);
          await this.sleep(2000);
          continue;
        }

        // Get latest email
        const latestEmail = emails[0];
        console.log(`   ✓ Found email from: ${latestEmail.from}`);

        const emailBody = latestEmail.body || latestEmail.text || '';
        console.log(`   📧 Email body (first 200 chars): ${emailBody.substring(0, 200)}`);

        // Extract 6-digit code
        const codeMatch = emailBody.match(/\b\d{6}\b/);
        if (codeMatch) {
          console.log(`   ✅ Verification code: ${codeMatch[0]}`);
          return codeMatch[0];
        }

        // Try other patterns
        const altMatch = emailBody.match(/code[:\s=]+([A-Z0-9]{4,})/i);
        if (altMatch) {
          console.log(`   ✅ Verification code: ${altMatch[1]}`);
          return altMatch[1];
        }

        console.log(`   ⚠️  Code pattern not found, retrying...`);
        await this.sleep(2000);

      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        console.log(`   ❌ Attempt ${attempt}/20 failed: ${errorMsg}`);

        if (attempt < 20) {
          await this.sleep(2000);
          continue;
        }
        throw new Error(
          `Failed to get verification code after 20 attempts. Last error: ${errorMsg}`
        );
      }
    }

    throw new Error('Could not retrieve verification code');
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}


