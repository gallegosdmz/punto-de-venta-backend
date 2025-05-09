import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { Business } from '../entities/business.entity';
import { User } from '../../users/entities/user.entity';
import { BaseValidator } from 'src/core/validators/base.validator';

@Injectable()
export class BusinessValidator extends BaseValidator {
  async verifyOwnerBusiness(businessId: number, user: User) {
    if (!businessId) throw new NotFoundException('Business ID is required');
    if (!user) throw new NotFoundException('User is required');

    const business = await this.dataSource.manager.findOne(Business, {
      where: { id: businessId, isDeleted: false },
      relations: {
        users: true,
      },
    });

    if (!business) throw new NotFoundException(`Business with id: ${businessId} not found`);
    if (user.role === 'admin') return business; // Admins bypassean la validación

    const hasAccess = business.users.some(u => u.id === user.id);
    if (!hasAccess) {
      throw new UnauthorizedException(`User ${user.userName} has no access to this business`);
    }

    return business;
  }
}