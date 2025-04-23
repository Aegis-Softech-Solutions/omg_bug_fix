const top150 = (sequelize, DataTypes) => {
  const Top150 = sequelize.define('top_150', {
    customer_id: { type: DataTypes.INTEGER, unique: true },
    gender: { type: DataTypes.STRING },
    top_500_final_rank: { type: DataTypes.INTEGER },
    video: { type: DataTypes.STRING },
    score: { type: DataTypes.FLOAT },
    is_scored: { type: DataTypes.BOOLEAN },
    active: { type: DataTypes.BOOLEAN },
    created_by: { type: DataTypes.INTEGER },
    updated_by: { type: DataTypes.INTEGER },
  });

  return Top150;
};

export default top150;
