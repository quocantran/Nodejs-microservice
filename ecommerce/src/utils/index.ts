"use strict";

import lodash from "lodash";

const _ = lodash;

export const getInfoData = ({ fileds = [], object = {} }) => {
  return _.pick(object, fileds);
};

export const htmlTemplateEmail = () => {
  return `<html lang='en'>
  <head>
    <meta charset='UTF-8' />
    <meta name='viewport' content='width=device-width, initial-scale=1.0' />
    <title>Document</title>
  </head>
  <body>
    <div
      style='font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2'
    >
      <div style='margin:50px auto;width:70%;padding:20px 0'>
        <div style='border-bottom:1px solid #eee'>
          <a
            href=''
            style='font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600'
          >Mã OTP lấy lại mật khẩu</a>
        </div>
        <p style='font-size:1.1em'>Xin Chào!</p>
        <p>Đây là mã OTP lấy lại mật khẩu của bạn (Có hiệu lực trong 3 phút)</p>
        <h2
          style='background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;'
        >{{otp}}</h2>
        <p style='font-size:0.9em;'>Trân Trọng!<br /></p>
        <hr style='border:none;border-top:1px solid #eee' />

      </div>
    </div>
  </body>
</html>`;
};
