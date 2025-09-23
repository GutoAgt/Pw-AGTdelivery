import multer from "multer";
import express from "express";
import cors from "cors";
import router from "./routes.js";

const app = express();

// Middlewares...
app.use(express.json());
app.use(cors());
app.use(router);

// Configuração do multer
const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 }, // limite 5MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Apenas imagens são permitidas"));
    }
    cb(null, true);
  },
});


app.listen(3001, () => {
    console.log("Servidor rodando na porta: 3001");
});

export default upload;