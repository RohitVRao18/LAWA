import { MailiskClient } from "mailisk";

export interface MailiskConfig {
  apiKey: string;
  namespace: string;
}

export class MailiskService {
  private readonly client: MailiskClient;
  private readonly namespace: string;

  constructor(config: MailiskConfig) {
    this.client = new MailiskClient({
      apiKey: config.apiKey,
    });

    this.namespace = config.namespace;
  }

  async getVerificationCode(email: string): Promise<string> {
    const { data: emails } = await this.client.searchInbox(
      this.namespace,
      {
        to_addr_prefix: email,
        wait: true,
      }
    );

    if (!emails.length) {
      throw new Error(
        `Verification email not received for ${email}`
      );
    }

    const verificationEmail = emails[0];
    const emailText = verificationEmail.text || "";

    const codeMatch = emailText.match(/\b\d{6}\b/);

    if (!codeMatch) {
      throw new Error(
        `Verification code not found for ${email}`
      );
    }

    return codeMatch[0];
  }
}