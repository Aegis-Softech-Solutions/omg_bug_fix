const competitionSubmission = (sequelize, DataTypes) => {
  const CompetitionSubmission = sequelize.define('competition_submission', {
    competition_id: { type: DataTypes.INTEGER, allowNull: false, validate: { notEmpty: true } },
    customer_id: { type: DataTypes.INTEGER, allowNull: false, validate: { notEmpty: true } },
    media: { type: DataTypes.STRING },
    action_taken: { type: DataTypes.BOOLEAN },
    active: { type: DataTypes.BOOLEAN },
    created_by: { type: DataTypes.INTEGER },
    updated_by: { type: DataTypes.INTEGER },
  });

  return CompetitionSubmission;
};

export default competitionSubmission;
