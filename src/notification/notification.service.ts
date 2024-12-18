import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entity/notification.entity';
import { User } from '../user/entity/user.entity';
import { Student } from '../student/entity/student.entity';
import { Status } from '../enums/exam.enum';


@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    
  ) {}

  // Metodă pentru a crea o notificare pentru un utilizator
  async createNotification(user: User, message: string, type: Status): Promise<Notification> {
    const notification = this.notificationRepository.create({
      message,
      user,
      type,
    });

    return await this.notificationRepository.save(notification);
  }

  async getNotificationsByUserId(userId: string): Promise<Notification[]> {
    return this.notificationRepository.find({ where: { user: { userId } ,isRead: false}, order: { createdAt: 'DESC' } });
  }

  // Metodă pentru a marca notificările ca citite
  async markAsRead(notificationId: string, userId: string): Promise<void> {
    const notification = await this.notificationRepository.findOne({
        where: { notificationId, user: { userId }, isRead:false },
    });
    if (!notification) {
        throw new NotFoundException('Notification not found.');
    }
    notification.isRead = true;
    await this.notificationRepository.save(notification); 
  }
}