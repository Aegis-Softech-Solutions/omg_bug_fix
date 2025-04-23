const contestStage = (sequelize, DataTypes) => {
  const ContestStage = sequelize.define('contest_stage', {
    stage: { type: DataTypes.STRING },
    active: { type: DataTypes.BOOLEAN },
    created_by: { type: DataTypes.INTEGER },
    updated_by: { type: DataTypes.INTEGER },
  });

  return ContestStage;
};

export default contestStage;
