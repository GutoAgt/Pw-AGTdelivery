export default (sequelize, DataTypes) => {
  const Empresa = sequelize.define("empresas", {
    id_empresa: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hora_abertura: {
      type: DataTypes.STRING, // formato "08:00"
      allowNull: false,
    },
    hora_fechamento: {
      type: DataTypes.STRING, // formato "18:00"
      allowNull: false,
    },
    status_funcionamento: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Fechado", // padrão inicial
    },
  });

  return Empresa;
};
