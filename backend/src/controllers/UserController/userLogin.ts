import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User, { UserAttributes } from "../../models/User";
import { generateToken } from "../../helpers/helpers";
import moment from "moment";
import { v4 } from "uuid";

export const userLogin = async (request: Request, response: Response) => {
  try {
    const { email, password } = request.body;

    const user1 = (await User.findOne({ where: { email: email } })) as unknown as UserAttributes;

    if (!user1) {
      return response.status(404).json({
        status: `error`,
        message: `User with the email ${email} is not registered`,
      });
    }

    const validate = await bcrypt.compare(password, user1.password);
    if (!validate) {
      return response.status(400).json({
        status: `error`,
        message: `Incorrect Password`,
      });
    }

    const data = {
      id: user1.id,
      email: user1.email,
    };
    const token = generateToken(data);
    console.log("App Secret during token generation:", process.env.APP_SECRET);
    console.log("Token created:", token);

    return response.status(200).json({
      message: `Welcome back ${user1.user_name}`,
      token,
      user: user1,
    });
  } catch (error: any) {
    console.log("Error:",error.message);
    response.status(500).json({
      status: `error`,
      method: request.method,
      message: error.message,
    });
  }
};
