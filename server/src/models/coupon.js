const coupon = (sequelize, DataTypes) => {
  const Coupon = sequelize.define('coupon', {
    code: { type: DataTypes.STRING },
    value: { type: DataTypes.FLOAT },
    active: { type: DataTypes.BOOLEAN },
    created_by: { type: DataTypes.INTEGER },
    updated_by: { type: DataTypes.INTEGER },
  });

  return Coupon;
};

export default coupon;
