import { NextRequest,NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { error } from "console";
import User from "@/models/User";
export async function POST (request:NextRequest){
try {
    const {email,password}= await request.json();
    if(!email || !password){
        return NextResponse.json({
            error:"email and password required"
        },{
           status:400
        })
    }

    await dbConnect();
    const existingUser=await User.findOne({email});
    if(existingUser){
        return NextResponse.json({
            error:"email already registered"
        },{
           status:400
        })
    }

    const user=await User.create({
        email,password
    });
    await user.save();
    return NextResponse.json({
        message:"user succefully registered"
    },{
       status:201
    })

} catch (error) {
    NextResponse.json({
        error:"Internal server error"
    },{
       status:500
    })
}
}