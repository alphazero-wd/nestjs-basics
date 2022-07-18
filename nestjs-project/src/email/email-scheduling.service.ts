import { Injectable } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { EmailScheduleDto } from './dto';
import { EmailService } from './email.service';

@Injectable()
export class EmailSchedulingService {
  constructor(
    private readonly emailService: EmailService,
    private readonly scheduleRegistry: SchedulerRegistry,
  ) {}

  scheduleEmail({ date, recipient, content, subject }: EmailScheduleDto) {
    const sendDate = new Date(date);
    const job = new CronJob(date, () => {
      this.emailService.sendEmail({
        to: recipient,
        subject,
        text: content,
      });
    });
    this.scheduleRegistry.addCronJob(`${Date.now()}-${subject}`, job);
    job.start();
  }

  cancelScheduledEmails() {
    this.scheduleRegistry.getCronJobs().forEach((job) => job.stop());
  }
}
