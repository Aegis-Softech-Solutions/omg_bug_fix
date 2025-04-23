const top20 = (sequelize, DataTypes) => {
  const Top20 = sequelize.define('top_20', {
    customer_id: { type: DataTypes.INTEGER, unique: true },
    gender: { type: DataTypes.STRING },
    top_30_final_rank: { type: DataTypes.INTEGER },
    video: { type: DataTypes.STRING },
    score: { type: DataTypes.FLOAT },
    is_scored: { type: DataTypes.BOOLEAN },
    active: { type: DataTypes.BOOLEAN },
    created_by: { type: DataTypes.INTEGER },
    updated_by: { type: DataTypes.INTEGER },
  });

  return Top20;
};

export default top20;
