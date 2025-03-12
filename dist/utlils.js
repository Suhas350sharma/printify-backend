"use strict";
// const transporter = nodeMailer.createTransport({
//      host:'smtp.sendgrid.net',
//      port:587,
//      secure:false,
//      service: "gmail",
//      auth: {
//           user: process.env.EMAIL_USER,
//           pass: process.env.EMAIL_PASS
//      }
// });
// export async function forgotPassword(req: Request, res: Response): Promise<void> {
//      try {
//           const email  = req.body.email;
//           const user = await UserModel.findOne({ email });
//           console.log(user);
//           console.log(process.env.EMAIL_USER)
//           if (!user) {
//                res.status(400).json({ message: "User not found. Please enter a correct email.", valid: false });
//                return;
//           }
//           const resetToken = Math.floor(100000 + Math.random() * 900000).toString();;
//           console.log(resetToken);
//           const tokenExpiry = new Date(Date.now() + 15 * 60 * 1000);
//           user.resetToken = resetToken;
//           user.resetTokenExpiry = tokenExpiry;
//           await user.save();
//          const test= await transporter.sendMail({
//                from: process.env.EMAIL_USER,
//                to: email,
//                subject: "Password Reset OTP",
//                html: `<h3>Hello ${user.username},</h3>
//                     <p>Please verify your email using the following OTP:</p>
//                     <h2>${resetToken}</h2>
//                     <p>This OTP is valid for 15 minutes.</p>`
//           });
//           console.log(test);
//           res.json({ message: "Please enter the OTP sent to your email.", valid: true });
//      } catch (error) {
//           res.status(500).json({ message: "Server error. Please try again later.", error });
//      }
// }
// export async function resetPassword(req: Request, res: Response): Promise<void> {
//      try {
//           const { token } = req.body;
//           const user = await UserModel.findOne({ resetToken: token });
//           if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
//                res.status(400).json({ message: "Invalid or expired token.", valid: false });
//                return;
//           }
//           (user as any).resetToken = null;
//           (user as any).resetTokenExpiry = null;
//           await user.save();
//           res.json({ message: "OTP verified. You can now set a new password.", valid: true });
//      } catch (error) {
//           res.status(500).json({ message: "Intarnal server error", error });
//      }
// }
// export async function updatePassword(req: Request, res: Response): Promise<void> {
//      try {
//           const { email, password } = req.body;
//           const user = await UserModel.findOne({ email });
//           if (!user) {
//                res.status(400).json({ message: "User not found. Enter a correct email.", valid: false });
//                return;
//           }
//           const hashedPassword = await bcrypt.hash(password, 10);
//           user.password = hashedPassword;
//           (user as any).resetToken = null;
//           (user as any).resetTokenExpiry = null;
//           await user.save();
//           res.json({ message: "Password changed successfully.", valid: true });
//      } catch (error) {
//           res.status(500).json({ message: "Password change failed. Please try again.", valid: false, error });
//      }
// }
