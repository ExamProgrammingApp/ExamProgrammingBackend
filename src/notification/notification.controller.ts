import { Controller, Get, Post, Body, Param, Patch, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { NotificationService } from './notification.service'; // Import the NotificationService
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Notification } from './entity/notification.entity'; // Assuming you have a Notification entity
import { Token } from '../auth/token.decorator';
import { User } from '../user/entity/user.entity'; // Assuming a User entity is available

@Controller('notifications')
@ApiBearerAuth()
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) { }

    @Get()
    @ApiOperation({ summary: 'Get notifications for the authenticated user' })
    @ApiResponse({
        status: 200,
        description: 'List of notifications',
        type: [Notification],
    })
    async getNotifications(@Token() token: any): Promise<Notification[]> {
        if (!token || !token.id) {
            throw new UnauthorizedException('You must be logged in to view notifications.');
        }
        return this.notificationService.getNotificationsByUserId(token.id);
    }

    @Patch(':id/mark-as-read')
    @ApiOperation({ summary: 'Mark a notification as read' })
    @ApiResponse({
        status: 200,
        description: 'Selected notification marked as read',
    })
    @ApiParam({ name: 'id', type: 'string', description: 'Id of the notification' })
    async markNotificationAsRead(
        @Param('id') notificationId: string,
        @Token() token: any,
    ): Promise<void> {
        if (!token || !token.id) {
            throw new UnauthorizedException('You must be logged in to update notification status.');
        }
        return this.notificationService.markAsRead(notificationId, token.id);
    }

}
