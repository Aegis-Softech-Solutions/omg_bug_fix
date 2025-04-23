const ipAddress = (sequelize, DataTypes) => {
  const IPAddress = sequelize.define('ip_address', {
    ip_address: { type: DataTypes.STRING },
    last_vote_at: { type: DataTypes.STRING },
    voted_customers: { type: DataTypes.ARRAY(DataTypes.INTEGER) },
    active: { type: DataTypes.BOOLEAN },
    created_by: { type: DataTypes.INTEGER },
    updated_by: { type: DataTypes.INTEGER },
  });

  return IPAddress;
};

export default ipAddress;
