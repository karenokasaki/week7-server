import { Schema, model } from "mongoose";

const cidadaoSchema = new Schema(
  {
    nome: {
      type: String,
      required: true,
      trim: true,
      minLength: 2,
      maxLength: 20,
      lowercase: true,
    },

    numDoc: {
      type: String,
      required: true,
      trim: true,
      minLength: 5,

      lowercase: true,
    },

    dataNasc: { type: String, default: "" },

    acessibilidade: { type: String, default: "nenhuma" },

    genero: { type: String },

    profissao: {},

    img: {
      type: String,
      default:
        "https://images.freeimages.com/clg/images/40/408717/buddy-icon-symbol-clip-art_p.jpg",
    },

    noLocal: { type: Boolean, default: false },

    status: {
      type: String,
      enum: ["aguardando", "atendimento", "finalizado"],
      default: "aguardando",
    },

    acessos: [{ type: Schema.Types.ObjectId, ref: "Registro" }],
  },
  {
    timestamps: true,
  },
);

const CidadaoModel = model("Cidadao", cidadaoSchema);

export default CidadaoModel;
