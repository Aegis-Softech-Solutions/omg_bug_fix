const pincode = (sequelize, DataTypes) => {
  const Pincode = sequelize.define("pincode", {
    pincode: { type: DataTypes.INTEGER }, // stores name of images
    district: { type: DataTypes.STRING },
    state: { type: DataTypes.STRING },
    active: { type: DataTypes.BOOLEAN },
    created_by: { type: DataTypes.INTEGER },
    updated_by: { type: DataTypes.INTEGER },
  });

  return Pincode;
};

export default pincode;
