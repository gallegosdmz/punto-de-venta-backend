import { forwardRef, Module } from '@nestjs/common';
import { UsersController, AdmininistratorsController, AuthController } from './controllers/';
import { AdmininistratorsService, AuthService, UsersService } from './services/';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { CoreModule } from 'src/core/core.module';
import { BusinessesModule } from 'src/businesses/businesses.module';

@Module({
  controllers: [
    AdmininistratorsController,
    AuthController,
    UsersController,
  ],
  providers: [
    AdmininistratorsService,
    AuthService,
    UsersService,
    JwtStrategy,
  ],
  imports: [
    ConfigModule,
    CoreModule,
    forwardRef(() => BusinessesModule),

    TypeOrmModule.forFeature([ User ]),

    PassportModule.register({ defaultStrategy: 'jwt' }),

    JwtModule.registerAsync({
      imports: [ ConfigModule ],
      inject: [ ConfigService ], 
      useFactory: ( configService: ConfigService ) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: '24h'
          }
        }
      }
    })
  ],
  exports: [ TypeOrmModule, JwtStrategy, PassportModule, JwtModule ]
})
export class UsersModule {}
