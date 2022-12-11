import { Schema, model } from "mongoose";

const registroSchema = new Schema(
  {
    entrada: { type: String, default: "" },
    saida: { type: String, default: "" },

    servicoPublico: { type: String, default: "" },
    local: { type: String, default: "" },
    obs: { type: String, default: "" },

    protocolo: { type: Number },

    cidadaoID: { type: Schema.Types.ObjectId, ref: "Cidadao" },
  },
  { timestamps: true },
);

const RegistroModel = model("Registro", registroSchema);

export default RegistroModel;

// ! protocolo: { type: Number, default: 0 }, --> ou string?
