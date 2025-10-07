import jwt from "jsonwebtoken";

const secretToken = "MYSECRET@123";

function CreateJWT(id_usuario) {
  const token = jwt.sign({ id_usuario }, secretToken, {
    expiresIn: 999999,
  });
  return token;
}

function ValidateJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token não informado" });
  }

  // Suporta "Bearer <token>" ou apenas "<token>"
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  try {
    const decoded = jwt.verify(token, secretToken);

    if (!decoded?.id_usuario) {
      return res.status(401).json({ error: "Token sem ID de usuário" });
    }

    req.id_usuario = decoded.id_usuario; // ✅ injeta o id corretamente
    next();
  } catch (err) {
    console.error("Erro ValidateJWT:", err.message);
    return res.status(401).json({ error: "Token inválido" });
  }
}

export default { CreateJWT, ValidateJWT };