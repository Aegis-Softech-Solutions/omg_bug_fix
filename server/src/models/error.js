const error = (sequelize, DataTypes) => {
  const Error = sequelize.define("error", {
    source: { type: DataTypes.STRING }, // hard-coded values: "razorpay", "other"
    related_customer_id: { type: DataTypes.INTEGER },
    error: { type: DataTypes.STRING },
    active: { type: DataTypes.BOOLEAN },
    created_by: { type: DataTypes.INTEGER },
    updated_by: { type: DataTypes.INTEGER },
  });

  return Error;
};

export default error;
