import mongoose, { Document, Schema, mongo } from "mongoose";

export interface IRegister extends Document {
  username: string;
  email: string;
  password: string;
}
const registerSchema: Schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});
const Register =
  mongoose.models.Register ||
  mongoose.model<IRegister>("Register", registerSchema);

export default Register;
