const homeBanner = (sequelize, DataTypes) => {
  const HomeBanner = sequelize.define('home_banner', {
    image: { type: DataTypes.STRING }, // stores name of images
    text: { type: DataTypes.STRING },
    active: { type: DataTypes.BOOLEAN },
    created_by: { type: DataTypes.INTEGER },
    updated_by: { type: DataTypes.INTEGER },
  });

  return HomeBanner;
};

export default homeBanner;
