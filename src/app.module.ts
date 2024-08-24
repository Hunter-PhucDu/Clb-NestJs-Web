import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AdminModule } from 'modules/admin/admin.module';
import { AuthModule } from 'modules/auth/auth.module';
import { EmailModule } from 'modules/email/email.module';
import { MemberModule } from 'modules/member/member.module';
import { PostModule } from 'modules/post/post.module';
import { QuestionModule } from 'modules/question/question.module';
import { RegistrationModule } from 'modules/registration/registration.module';
import { RegistrationSettingModule } from 'modules/registrationSetting/registrationSetting.module';
import { SharedModule } from 'modules/shared/shared.module';
import { UserModule } from 'modules/user/user.module';
import { join } from 'path';

@Module({
  imports: [
    SharedModule,
    AuthModule,
    AdminModule,
    UserModule,
    QuestionModule,
    RegistrationModule,
    RegistrationSettingModule,
    MemberModule,
    PostModule,
    EmailModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'images'),
      serveRoot: '/images',
    }),
  ],
})
export class AppModule {}
