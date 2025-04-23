const top5 = (sequelize, DataTypes) => {
  const Top5 = sequelize.define('top_5', {
    customer_id: { type: DataTypes.INTEGER, unique: true },
    gender: { type: DataTypes.STRING },
    top_10_final_rank: { type: DataTypes.INTEGER },
    video: { type: DataTypes.STRING },
    score: { type: DataTypes.FLOAT },
    is_scored: { type: DataTypes.BOOLEAN },
    active: { type: DataTypes.BOOLEAN },
    created_by: { type: DataTypes.INTEGER },
    updated_by: { type: DataTypes.INTEGER },
  });

  return Top5;
};

export default top5;
