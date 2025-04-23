const competitionWinner = (sequelize, DataTypes) => {
	const CompetitionWinner = sequelize.define('competition_winner', {
		competition_id: { type: DataTypes.INTEGER, unique: true, allowNull: false, validate: { notEmpty: true } },
		winner_customer_ids: { type: DataTypes.ARRAY(DataTypes.INTEGER), allowNull: false },
		runner_up_1_customer_ids: { type: DataTypes.ARRAY(DataTypes.INTEGER), allowNull: false },
		runner_up_2_customer_ids: { type: DataTypes.ARRAY(DataTypes.INTEGER), allowNull: false },
		active: { type: DataTypes.BOOLEAN },
		created_by: { type: DataTypes.INTEGER },
		updated_by: { type: DataTypes.INTEGER },
	});

	return CompetitionWinner;
};

export default competitionWinner;
