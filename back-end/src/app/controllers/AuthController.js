const crypto = require("crypto");
const authService = require("../services/AuthService.js");
const { generateToken } = require("../../middlewares/jwt.js");
const HandleCode = require("../../utilities/HandleCode.js");
const { sendEmail } = require("../services/EmailService.js");

class AuthController {
  //#region login
  async login(req, res) {
    const { email, password } = req.body;
    try {
      const result = await authService.login(email, password);
      if (result && result.code == HandleCode.LOGIN_FAILED) {
        res.status(401).json({
          message: "Invalid email or password.",
        });
        return;
      }

      if (result && result.code == HandleCode.ACCOUNT_BANNED) {
        res.status(401).json({
          message: "Your account has been banned.",
        });
        return;
      }

      const accessToken = generateToken(result.userId, "access");
      const refreshToken = generateToken(result.userId, "refresh");
      res.status(200).json({
        accessToken: accessToken,
        refreshToken: refreshToken,
        roleId: result.roleId,
      });
    } catch (err) {
      console.log("Failed to login account:", err);
      res.status(500).json({ message: "Login failed." });
    }
  }
  //#endregion

  //#region register-user
  async register(req, res) {
    const { email, password } = req.body;
    try {
      const result = await authService.register(
        email,
        password,
        authService.RoleEnum.USER
      );

      if (result && result.code == HandleCode.EMAIL_EXIST) {
        res.status(409).json({
          message: "Email is already existed. Try another email.",
        });
        return;
      }

      res.status(201).json({
        message: "Register account successfully.",
      });
    } catch (err) {
      console.log("Failed to register account:", err);
      res.status(500).json({
        message: "Failed to register account.",
      });
    }
  }
  //#endregion

  //#region register-admin
  async registerAdmin(req, res) {
    const { email, password } = req.body;
    try {
      const result = await authService.register(
        email,
        password,
        authService.RoleEnum.ADMIN
      );

      if (result && result.code == HandleCode.EMAIL_EXIST) {
        res.status(409).json({
          message: "Email is already existed. Try another email.",
        });
        return;
      }

      res.status(201).json({
        message: "Register account successfully.",
      });
    } catch (err) {
      console.log("Failed to register account:", err);
      res.status(500).json({
        message: "Failed to register account.",
      });
    }
  }
  //#endregion

  //#region refresh-token
  async refreshToken(req, res) {
    const accessToken = generateToken(req.user.id, "access");
    res.status(200).json({
      accessToken: accessToken,
    });
  }
  //#endregion

  //#region forgot-pwd
  async forgotPassword(req, res) {
    const { email } = req.body;
    try {
      const otpCode = crypto.randomInt(100000, 999999).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
      const result = await authService.setOtp(email, otpCode, expiresAt);
      if (result && result.code == HandleCode.NOT_FOUND) {
        res.status(404).json({ message: "User not found." });
        return;
      }
      await sendEmail(
        email,
        "Mã OTP quên mật khẩu",
        `Mã OTP của bạn là ${otpCode}`
      );

      res.status(200).json({ message: "OTP has been send to your email." });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Failed to create otp. Please try again later." });
    }
  }
  //#endregion

  //#region reset-pwd
  async resetPassword(req, res) {
    const { email, otpCode } = req.body;
    try {
      const result = await authService.getOtpExpires(email, otpCode);
      if (result && result.code == HandleCode.NOT_FOUND) {
        res.status(404).json({ message: "User not found." });
        return;
      }

      const userId = result.userId;
      const expiresAtFromDb = result.expiresAt;
      const currentTime = new Date();
      if (expiresAtFromDb < currentTime) {
        res.status(400).json({ message: "OTP has expired." });
        return;
      }

      const newPassword = crypto.randomBytes(8).toString("hex");
      await authService.resetPassword(userId, newPassword);

      await sendEmail(
        email,
        "Reset mật khẩu",
        `Mật khẩu mới của bạn là: ${newPassword}`
      );

      res
        .status(200)
        .json({ message: "New password has been send to your email." });
    } catch (err) {
      res.status(500).json({ message: "Failed to reset password." });
    }
  }
  //#endregion
}

module.exports = new AuthController();
