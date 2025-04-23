const role = (sequelize, DataTypes) => {
  //define
  const Role = sequelize.define("role", {
    title: {
      type: DataTypes.STRING,
      validate: { notEmpty: true },
    },
    permissions: {
      type: DataTypes.TEXT,
      validate: { notEmpty: true },
    },
    active: { type: DataTypes.BOOLEAN },
    created_by: { type: DataTypes.INTEGER },
    updated_by: { type: DataTypes.INTEGER },
  });

  return Role;
};

export default role;
