import { ICreateAccount, IResetPassword } from '../types/emailTamplate';

const createAccount = (values: ICreateAccount) => {
  const data = {
    to: values.email,
    subject: 'Verify your account',
    html: `<body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 50px; padding: 20px; color: #555;">
    <div style="width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <h2 style="color: #277E16; font-size: 24px; margin-bottom: 20px; text-align: center;">ফ্রেশ মৌসুম - অ্যাকাউন্ট যাচাইকরণ</h2>
        <div style="text-align: center;">
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">হ্যালো ${values.name}, আপনার যাচাইকরণ কোড:</p>
            <div style="background-color: #277E16; width: 80px; padding: 10px; text-align: center; border-radius: 8px; color: #fff; font-size: 25px; letter-spacing: 2px; margin: 20px auto;">${values.otp}</div>
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">এই কোডটি ৩ মিনিটের জন্য কার্যকর।</p>
        </div>
    </div>
</body>`,
  };
  return data;
};

const resetPassword = (values: IResetPassword) => {
  const data = {
    to: values.email,
    subject: 'Reset your password',
    html: `<body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 50px; padding: 20px; color: #555;">
    <div style="width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <h2 style="color: #277E16; font-size: 24px; margin-bottom: 20px; text-align: center;">ফ্রেশ মৌসুম - পাসওয়ার্ড রিসেট</h2>
        <div style="text-align: center;">
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">আপনার পাসওয়ার্ড রিসেট কোড:</p>
            <div style="background-color: #277E16; width: 80px; padding: 10px; text-align: center; border-radius: 8px; color: #fff; font-size: 25px; letter-spacing: 2px; margin: 20px auto;">${values.otp}</div>
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">এই কোডটি ৩ মিনিটের জন্য কার্যকর।</p>
            <p style="color: #b9b4b4; font-size: 14px; line-height: 1.5; margin-bottom: 20px; text-align: left;">আপনি যদি এই কোডটির অনুরোধ না করে থাকেন, তাহলে আপনি নিরাপদে এই ইমেইলটি উপেক্ষা করতে পারেন।</p>
        </div>
    </div>
</body>`,
  };
  return data;
};

export const emailTemplate = {
  createAccount,
  resetPassword,
};
