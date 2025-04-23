const top30 = (sequelize, DataTypes) => {
  const Top30 = sequelize.define('top_30', {
    customer_id: { type: DataTypes.INTEGER, unique: true },
    gender: { type: DataTypes.STRING },
    top_75_final_rank: { type: DataTypes.INTEGER },
    video: { type: DataTypes.STRING },
    score: { type: DataTypes.FLOAT },
    is_scored: { type: DataTypes.BOOLEAN },
    active: { type: DataTypes.BOOLEAN },
    created_by: { type: DataTypes.INTEGER },
    updated_by: { type: DataTypes.INTEGER },
  });

  return Top30;
};

export default top30;
