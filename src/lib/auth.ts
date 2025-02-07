import { bcryptjs } from 'bcryptjs';
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import { dbConnect } from "./db";
import User from "@/models/User";
export const authOptions:NextAuthOptions{
    providers:[
        CredentialsProvider({
            
            name: 'Credentials',
           
            credentials: {
              email: { label: "Email", type: "text", placeholder: "jsmith@example.com" },
              password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
           
             if(!credentials.email || !credentials.password){
              throw new Error("Password or Email missing");
             }

             try {
              
              await dbConnect();
              const user=await User.findOne({email:credentials.email});
              if(!user){
                throw new Error("user not found");
              }

              const boolean=await bcryptjs.compare(
                credentials.password,user.password
              )
          if(!boolean) throw new Error("incorrect Password");
          return {
            id:user._id.toString(),
            email:user.email
          }
             } catch (error) {
              throw error
             }
            }
          })
    ]
}