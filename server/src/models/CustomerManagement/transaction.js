const transaction = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('transaction', {
    customer_id: { type: DataTypes.INTEGER },
    payment_id: { type: DataTypes.STRING, unique: true },
    order_id: { type: DataTypes.STRING, unique: true },
    amount: { type: DataTypes.FLOAT },
    source: { type: DataTypes.STRING }, // hard-coded values: "mutation", "webhook"
    active: { type: DataTypes.BOOLEAN },
    created_by: { type: DataTypes.INTEGER },
    updated_by: { type: DataTypes.INTEGER },
  });

  return Transaction;
};

export default transaction;
