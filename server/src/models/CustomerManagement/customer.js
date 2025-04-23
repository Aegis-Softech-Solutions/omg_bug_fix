import { ApolloError } from 'apollo-server';

const customer = (sequelize, DataTypes) => {
  const Op = sequelize.Op;

  const Customer = sequelize.define('customer', {
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
    email: { type: DataTypes.STRING, unique: true },
    password: { type: DataTypes.STRING },
    email_verify_token: { type: DataTypes.STRING },
    is_email_verified: { type: DataTypes.BOOLEAN },
    password_reset_token: { type: DataTypes.STRING },
    phone: { type: DataTypes.BIGINT, unique: true },
    is_phone_verified: { type: DataTypes.BOOLEAN },
    profile_pic: { type: DataTypes.STRING, defaultValue: 'pic1' }, // Will store the name of the column chosen to be set as Profile Pic
    slug: { type: DataTypes.STRING },
    gender: { type: DataTypes.STRING },
    utm_referrer: { type: DataTypes.STRING },
    utm_source: { type: DataTypes.STRING },
    utm_medium: { type: DataTypes.STRING },
    utm_campaign: { type: DataTypes.STRING },
    utm_adgroup: { type: DataTypes.STRING },
    utm_content: { type: DataTypes.STRING },
    transaction_id: { type: DataTypes.INTEGER },
    active: { type: DataTypes.BOOLEAN },
    created_by: { type: DataTypes.INTEGER },
    updated_by: { type: DataTypes.INTEGER },
  });

  Customer.findByEmail = async (email) => {
    return await Customer.findOne({ where: { email: { [Op.iLike]: email } } }).catch((error) => {
      throw new ApolloError(error.message, 'MUTATION_ERROR');
    });
  };

  Customer.associate = (models) => {
    Customer.belongsTo(models.Transaction, {
      foreignKey: { fieldName: 'transaction_id' },
      as: 'transactionData',
      constraints: true,
    });
  };

  return Customer;
};

export default customer;
