const winner = (sequelize, DataTypes) => {
  const Winner = sequelize.define('winner', {
    customer_id: { type: DataTypes.INTEGER, unique: true },
    gender: { type: DataTypes.STRING },
    top_5_final_rank: { type: DataTypes.INTEGER },
    video: { type: DataTypes.STRING },
    score: { type: DataTypes.FLOAT },
    is_scored: { type: DataTypes.BOOLEAN },
    active: { type: DataTypes.BOOLEAN },
    created_by: { type: DataTypes.INTEGER },
    updated_by: { type: DataTypes.INTEGER },
  });

  return Winner;
};

export default winner;
