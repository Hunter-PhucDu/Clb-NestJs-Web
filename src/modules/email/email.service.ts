import { BadRequestException, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { authenticator } from 'otplib';
import { UserModel } from 'modules/shared/models/user.model';
import { ConfigService } from '@nestjs/config';
import { OtpModel } from 'modules/shared/models/otp.model';
import eConfirmationSignUp from 'modules/shared/utils/eConfirmationSignUp';
import eConfirmationRegistration from 'modules/shared/utils/eConfirmationRegistration';
import ePassedFirstRound from 'modules/shared/utils/ePassedFirstRound';
import ePassedSecondRound from 'modules/shared/utils/ePassedSecondRound';

@Injectable()
export class EmailService {
  constructor(
    private readonly userModel: UserModel,
    private readonly configService: ConfigService,
    private readonly otpModel: OtpModel,
    private readonly mailerService: MailerService,
  ) {}

  async _sendMailConfirmationSignUp(email: string, fullName: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      from: {
        name: 'Câu lạc bộ Lập trình',
        address: 'clblaptrinh@utb.edu.vn',
      },
      subject: 'Chào mừng đến với Clb Lập trình',
      html: eConfirmationSignUp(fullName),
    });
  }

  async _sendMailConfirmationRegistration(email: string, fullName: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      from: {
        name: 'Câu lạc bộ Lập trình',
        address: 'clblaptrinh@utb.edu.vn',
      },
      subject: 'Xác nhận đơn đăng ký tham gia Câu lạc bộ Lập trình',
      html: eConfirmationRegistration(fullName),
    });
  }

  async _sendMailPassFirstRound(email: string, fullName: string, dateTime: string, address: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      from: {
        name: 'Câu lạc bộ Lập trình',
        address: 'clblaptrinh@utb.edu.vn',
      },
      subject: 'Chúc mừng bạn đã thông qua vòng xét tuyển hồ sơ',
      html: ePassedFirstRound(fullName, dateTime, address),
    });
  }

  async _sendMailPassedSecondRound(email: string, fullName: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      from: {
        name: 'Câu lạc bộ Lập trình',
        address: 'clblaptrinh@utb.edu.vn',
      },
      subject: 'Chúc mừng bạn đã thông qua vòng phỏng vấn',
      html: ePassedSecondRound(fullName),
    });
  }

  async generateOtp(email: string): Promise<void> {
    const user = await this.userModel.model.findOne({ email });

    if (!user) {
      throw new BadRequestException('User not found.');
    }

    const otp = authenticator.generate(this.configService.get('OTP_SECRET')).slice(0, 6);

    const otpDoc = new this.otpModel.model({
      userId: user._id,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    await otpDoc.save();

    await this.mailerService.sendMail({
      to: email,
      from: {
        name: 'Câu lạc bộ Lập trình',
        address: 'clblaptrinh@utb.edu.vn',
      },
      subject: 'Mã OTP',
      html: `<p>Mã OTP của bạn là <b> ${otp} </b>. Mã OTP sẽ hết hạn sau 5 phút. Lưu lý: tuyệt đối không cung cấp OTP cho bất cứ ai vì bất cứ lý do nào.</p>`,
    });
  }
}
