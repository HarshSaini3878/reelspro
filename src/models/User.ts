import mongoose, { model, models, Schema } from "mongoose";
import bcryptjs from "bcryptjs"
export interface Iuser{
    email:string;
    password:string;
    _id?:mongoose.Types.ObjectId;
    updatedAt?:Date;
    createdAt?:Date;
}

const UserSchema=new Schema<Iuser>({
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
   
},{
    timestamps:true
});

UserSchema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password=await bcryptjs.hash(this.password,10);
    }
    next()
})
const User=models?.User|| model<Iuser>("User",UserSchema);
export default User;