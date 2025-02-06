import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { z } from "zod";

const userSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
  });
  
  export async function POST(request: NextRequest) {
    try {
      const body = await request.json();
  
      
      const parsedBody = userSchema.safeParse(body);
      if (!parsedBody.success) {
        return NextResponse.json(
          { error: parsedBody.error.errors },
          { status: 400 }
        );
      }
  
      const { email, password } = parsedBody.data;
  
      await dbConnect();
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return NextResponse.json(
          { error: "Email already registered" },
          { status: 400 }
        );
      }
  
      const user = await User.create({ email, password });
      await user.save();
  
      return NextResponse.json(
        { message: "User successfully registered" },
        { status: 201 }
      );
    } catch (error) {
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }
  