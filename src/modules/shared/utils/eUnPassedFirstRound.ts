const eUnPassedFirstRound = (fullName: string): string => {
  return `
      <div
        style="font-family:'Google Sans',Roboto,RobotoDraft,Helvetica,Arial,sans-serif;border-bottom:thin solid #dadce0;color:rgba(0,0,0,0.87);line-height:32px;padding-bottom:24px;text-align:center;word-break:break-word">
        <table width="100%" height="100%" style="min-width:348px" border="0" cellspacing="0" cellpadding="0" lang="en">
            <tbody>
                <tr align="center">
                    <td>
                        <table border="0" cellspacing="0" cellpadding="0"
                            style="padding-bottom:20px;max-width:550px;min-width:220px">
                            <tbody>
                                <tr>
                                    <td>
                                        <div style="border-style:solid;border-width:thin;border-color:#dadce0;border-radius:8px;padding:20px 20px"
                                            align="center">
                                            <div
                                                style="border-bottom:thin solid #dadce0;color:rgba(0,0,0,0.87);line-height:32px;padding-bottom:24px;text-align:center;word-break:break-word">

                                                <table align="center">
                                                    <tbody>
                                                        <tr>
                                                            <td>
                                                                <div align="center">
                                                                    <img style="width:60px;height:60px; border-radius: 50%;"
                                                                        src="https://lh3.googleusercontent.com/a/ACg8ocLgFdmQ5ae1sww928pCP6CFOorLdhjUHbDK_onIkcSV=s96-c">
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr style="line-height:normal">
                                                            <td>
                                                                <div
                                                                    style="font-family:'Segoe UI', sans-serif;font-size:24px;">
                                                                    Câu lạc
                                                                    bộ Lập trình
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div
                                                style="font: size 16px;line-height:20px;padding-top:10px;text-align: justify;">
                                                <h2><strong>Xin chào bạn ${fullName}.</strong></h2>
                                                <p>
                                                    Chúng tớ là những thành viên trong Clb Lập trình. Nhận được hồ sơ
                                                    ứng tuyển của bạn. Rất cám ơn vì sự quan tâm của bạn đối với clb.
                                                    <br>
                                                </p>
                                                <p>Tuy nhiên, sau khi xem xét hồ sơ ứng tuyển, chúng tớ nhận thấy bạn
                                                    chưa phù hợp để chọn vào vòng phỏng vấn.
                                                    <br>
                                                </p>
                                                <p>Chúc bạn may mắn trong quá trình ứng tuyển lần sau và mong rằng có
                                                    thể hợp tác với bạn trong thời gian sớm nhất.</p>
                                                <p> Mọi thắc mắc khác, bạn vui lòng liên hệ với chúng tớ qua: </p>
                                                <div style="margin-left: 20px;">
                                                    <div style="display: flex;">
                                                        <div>
                                                            <img style="width: 20px; height: auto;"
                                                                src="https://cdn.iconscout.com/icon/free/png-512/free-email-2029111-1713291.png" />
                                                        </div>
                                                        <div>
                                                            <a href="mailto:clblaptrinh@utb.edu.vn"
                                                                style="margin-left: 15px; text-decoration: none;">clblaptrinh@utb.edu.vn</a>
                                                        </div>
                                                    </div>
                                                    <div style="display: flex;">
                                                        <div>
                                                            <img style="width: 20px; height: auto;"
                                                                src="https://cdn.iconscout.com/icon/free/png-512/free-phone-1540-460506.png" />
                                                        </div>
                                                        <div>
                                                            <a
                                                                style="margin-left: 15px; text-decoration: none;">0378.627.156</a>
                                                        </div>
                                                    </div>

                                                </div>
                                                <p style="text-align: right; margin-right: 40px;"> <strong>Trân
                                                        trọng,</strong></p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>`;
};
export default eUnPassedFirstRound;
