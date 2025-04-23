const onlineVote = (sequelize, DataTypes) => {
  const OnlineVote = sequelize.define('online_vote', {
    customer_id: { type: DataTypes.INTEGER },
    gender: { type: DataTypes.STRING },
    votes: { type: DataTypes.INTEGER },
    active: { type: DataTypes.BOOLEAN },
    created_by: { type: DataTypes.INTEGER },
    updated_by: { type: DataTypes.INTEGER },
  });

  return OnlineVote;
};

export default onlineVote;
