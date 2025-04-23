const competition = (sequelize, DataTypes) => {
	const Competition = sequelize.define('competition', {
		name: { type: DataTypes.STRING },
		description: { type: DataTypes.TEXT },
		upload_type: { type: DataTypes.STRING }, // hard-coded values: "image", "video"
		ended_on: { type: DataTypes.STRING },
		active: { type: DataTypes.BOOLEAN },
		created_by: { type: DataTypes.INTEGER },
		updated_by: { type: DataTypes.INTEGER },
	});

	return Competition;
};

export default competition;
