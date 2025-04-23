const top500 = (sequelize, DataTypes) => {
  const Top500 = sequelize.define('top_500', {
    customer_id: { type: DataTypes.INTEGER, unique: true },
    gender: { type: DataTypes.STRING },
    score: { type: DataTypes.FLOAT },
    active: { type: DataTypes.BOOLEAN },
    created_by: { type: DataTypes.INTEGER },
    updated_by: { type: DataTypes.INTEGER },
  });

  return Top500;
};

export default top500;
