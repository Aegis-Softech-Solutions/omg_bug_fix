const webinar = (sequelize, DataTypes) => {
  const Webinar = sequelize.define('webinar', {
    title: { type: DataTypes.STRING },
    link: { type: DataTypes.TEXT },
    active: { type: DataTypes.BOOLEAN },
    created_by: { type: DataTypes.INTEGER },
    updated_by: { type: DataTypes.INTEGER },
  });

  return Webinar;
};

export default webinar;
