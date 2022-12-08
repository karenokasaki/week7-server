import { Schema, model } from "mongoose";

const logSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  task: { type: Schema.Types.ObjectId, ref: "Task" },
  date: { type: Date, default: Date.now },
  status: { type: String },
});

const LogModel = model("Log", logSchema);

export default LogModel;
