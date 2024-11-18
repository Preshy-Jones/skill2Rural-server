import { JwtService } from "@nestjs/jwt";

export const successResponse = (data: any, message: string) => {
  return {
    message,
    data,
  };
};

//a generate otp function that generates a random 6 digit number
export const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

export const decodeToken = (token, jwtService: JwtService) => {
  return new Promise((resolve, reject) => {
    const result = jwtService.verify(token);
    if (!result) {
      reject("Invalid token");
    }
    resolve(result);
  });
};

// make a function that generates a random password, which is a combination of Uppercase, Lowercase,number and special characters
export const generatePassword = (length: number) => {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
  let password = "";
  for (let i = 0; i < length; i++) {
    const at = Math.floor(Math.random() * (charset.length + 1));
    password += charset.charAt(at);
  }
  return password;
};
