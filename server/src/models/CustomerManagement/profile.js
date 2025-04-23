const profile = (sequelize, DataTypes) => {
  const Profile = sequelize.define('profile', {
    customer_id: { type: DataTypes.INTEGER, unique: true },
    state: { type: DataTypes.STRING },
    city: { type: DataTypes.STRING },
    pincode: { type: DataTypes.INTEGER },
    bio: { type: DataTypes.TEXT },
    insta_link: { type: DataTypes.STRING },
    insta_verified: { type: DataTypes.BOOLEAN },
    fb_link: { type: DataTypes.STRING },
    height: { type: DataTypes.STRING },
    weight: { type: DataTypes.INTEGER },
    dob: { type: DataTypes.STRING },
    personality_meaning: { type: DataTypes.ARRAY(DataTypes.STRING) },
    share_pic: { type: DataTypes.STRING },
    pic1: { type: DataTypes.STRING },
    pic1_status: { type: DataTypes.STRING }, // hard-coded values: "pending", "approved", "rejected"
    pic1_score: { type: DataTypes.INTEGER },
    pic2: { type: DataTypes.STRING },
    pic2_status: { type: DataTypes.STRING }, // hard-coded values: "pending", "approved", "rejected"
    pic2_score: { type: DataTypes.INTEGER },
    pic3: { type: DataTypes.STRING },
    pic3_status: { type: DataTypes.STRING }, // hard-coded values: "pending", "approved", "rejected"
    pic3_score: { type: DataTypes.INTEGER },
    pic4: { type: DataTypes.STRING },
    pic4_status: { type: DataTypes.STRING }, // hard-coded values: "pending", "approved", "rejected"
    pic4_score: { type: DataTypes.INTEGER },
    intro_video: { type: DataTypes.STRING },
    intro_video_status: { type: DataTypes.STRING }, // hard-coded values: "pending", "approved", "rejected"
    reject_reason: { type: DataTypes.TEXT },
    final_status: { type: DataTypes.STRING }, // hard-coded values: "pending", "approved", "rejected"
    active: { type: DataTypes.BOOLEAN },
    created_by: { type: DataTypes.INTEGER },
    updated_by: { type: DataTypes.INTEGER },
  });

  Profile.associate = (models) => {
    Profile.belongsTo(models.Customer, {
      foreignKey: { fieldName: 'customer_id' },
      as: 'customerData',
      constraints: false,
    });
  };

  return Profile;
};

export default profile;
