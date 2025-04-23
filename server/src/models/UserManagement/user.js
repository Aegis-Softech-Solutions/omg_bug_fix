import bcrypt from 'bcrypt';

const user = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true }
    },
    last_name: { type: DataTypes.STRING },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: { notEmpty: true, isEmail: true }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true }
    },
    role_id: { type: DataTypes.INTEGER },
    phone: { type: DataTypes.STRING },
    profile_pic: { type: DataTypes.STRING },
    active: { type: DataTypes.BOOLEAN },
    created_by: { type: DataTypes.INTEGER },
    updated_by: { type: DataTypes.INTEGER }
  });

  User.findByLogin = async (email) => await User.findOne({ where: { email } });

  User.beforeCreate(async (user) => {
    user.password = await user.generatePasswordHash();
  });

  // User.beforeUpdate(async (user) => {
  //   user.password = await user.generatePasswordHash();
  // });

  User.prototype.generatePasswordHash = async function() {
    const saltRounds = 10;
    return await bcrypt.hash(this.password, saltRounds);
  };

  User.prototype.validatePassword = async (password) => await bcrypt.compare(password, this.password);

  return User;
};

export default user;
