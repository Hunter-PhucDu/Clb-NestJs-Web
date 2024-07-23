import { MailerModule } from '@nestjs-modules/mailer';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import config from 'config';
import models from './models';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Admin, AdminSchema } from './schemas/admin.schema';
import { User, UserSchema } from './schemas/user.schema';
import { Member, MemberSchema } from './schemas/member.schema';
import { Post, PostSchema } from './schemas/post.schema';
import { Registration, RegistrationSchema } from './schemas/registration.schema';
import { RegistrationSetting, RegistrationSettingSchema } from './schemas/registrationSetting.schema';
import { Otp, OtpSchema } from './schemas/otp.schema';
import { Question, QuestionSchema } from './schemas/question.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: config,
    }),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get('app.auth.jwtSecret'),
          signOptions: {
            expiresIn: configService.get('app.auth.jwtTokenExpiry'),
          },
        };
      },
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          uri: configService.get<string>('db.uri'),
        };
      },
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Admin.name, schema: AdminSchema },
      { name: Question.name, schema: QuestionSchema },
      { name: Registration.name, schema: RegistrationSchema },
      { name: RegistrationSetting.name, schema: RegistrationSettingSchema },
      { name: Member.name, schema: MemberSchema },
      { name: Post.name, schema: PostSchema },
      { name: Otp.name, schema: OtpSchema },
    ]),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          secure: false,
          auth: {
            user: configService.get('mail.mailAddress'),
            pass: configService.get('mail.password'),
          },
          tlsOptions: {
            rejectUnauthorized: false,
          },
        },
      }),
    }),
  ],
  providers: [Logger, JwtStrategy, ...models],
  exports: [Logger, JwtStrategy, JwtModule, ConfigModule, ...models],
})
export class SharedModule {}
