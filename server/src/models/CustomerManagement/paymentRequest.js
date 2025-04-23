const paymentRequest = (sequelize, DataTypes) => {
  const PaymentRequest = sequelize.define('payment_request', {
    customer_id: { type: DataTypes.INTEGER },
    order_id: { type: DataTypes.STRING, unique: true },
    status: { type: DataTypes.STRING }, // hard-coded values: "initiated", "completed", "completed-webhook"
    active: { type: DataTypes.BOOLEAN },
    created_by: { type: DataTypes.INTEGER },
    updated_by: { type: DataTypes.INTEGER },
  });

  return PaymentRequest;
};

export default paymentRequest;
