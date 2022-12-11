import { Schema, model } from "mongoose";

const serviceSchema = new Schema(
  {
    details: { type: String, required: true },
    complete: { type: Boolean, default: false },
    dateFin: { type: Date },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    collab: [{ type: Schema.Types.ObjectId, ref: "User" }],
    status: {
      type: String,
      enum: ["Atendimento", "Andamento", "Pendente", "Finalizado", "Suspenso"],
      default: "Atendimento",
    },
  },
  { timestamps: true },
);

const ServiceModel = model("Service", serviceSchema);

export default ServiceModel;
