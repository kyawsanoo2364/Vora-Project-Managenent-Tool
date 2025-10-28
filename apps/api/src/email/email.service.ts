import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import path from 'path';
import * as ejs from 'ejs';

//
@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter<
    SMTPTransport.SentMessageInfo,
    SMTPTransport.Options
  >;
  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: configService.get('SMTP_USER'),
        pass: configService.get('SMTP_PASS'),
      },
    });
  }

  async sendMail(to: string, subject: string, html: string) {
    return await this.transporter.sendMail({
      from: `"Vora" <${this.configService.get('SMTP_USER')}>`,
      to,
      subject,
      html,
    });
  }

  async sendBoardInvite(
    to: string,
    payload: {
      recipientName: string;
      recipientEmail?: string;
      inviterName: string;
      boardName: string;
      workspaceName: string;
      role?: string;
      acceptLink: string;
      declineLink?: string;
      expirationDate?: string;
      customMessage?: string;
    },
  ) {
    const templatePath = path.join(__dirname, 'templates', 'board-invite.ejs');

    const html = await ejs.renderFile(templatePath, {
      ...payload,
      appName: this.configService.get('APP_NAME') || 'Vora App',
      logoUrl: this.configService.get('APP_LOGO_URL'),
      supportEmail:
        this.configService.get('SUPPORT_EMAIL') || 'support@example.com',
      footerText:
        'If you didn’t expect this invite, you can ignore this email.',
    });

    return this.transporter.sendMail({
      from: `"${this.configService.get('APP_NAME') || 'App'}" <${this.configService.get('SMTP_USER')}>`,
      to,
      subject: `${payload.inviterName} invited you to join ${payload.boardName}`,
      html,
    });
  }

  async sendWorkspaceInvite(
    to: string,
    data: {
      inviterName: string;
      workspaceName: string;
      role?: string;
      customMessage?: string;
      acceptLink: string;
      expirationDate?: string;
      recipientEmail: string;
    },
  ) {
    const templatePath = path.join(
      __dirname,
      'templates',
      'workspace-invite.ejs',
    );

    // Render EJS template with data
    const html = await ejs.renderFile(templatePath, {
      ...data,
      appName: process.env.APP_NAME || 'My App',
      logoUrl: process.env.APP_LOGO_URL || null,
      supportEmail: process.env.SUPPORT_EMAIL || 'support@example.com',
    });

    // Send email
    return this.transporter.sendMail({
      from: `"${process.env.APP_NAME || 'My App'}" <${process.env.SMTP_USER}>`,
      to,
      subject: `${data.inviterName} invited you to join ${data.workspaceName}`,
      html,
    });
  }

  // When a new member is added to a board, send an invitation email to them.
  async sendBoardInvitation(
    to: string,
    data: {
      boardName: string;
      adminName: string;
      boardUrl: string;
      adminEmail: string;
      logoUrl: string;
    },
  ) {
    const templatePath = path.join(
      __dirname,
      'templates',
      'board-invitation.ejs',
    );
    const html = await ejs.renderFile(templatePath, data);
    await this.sendMail(
      to,
      `You've Been Invited to the Board: ${data.boardName}`,
      html,
    );
  }
}
