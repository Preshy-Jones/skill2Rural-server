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
