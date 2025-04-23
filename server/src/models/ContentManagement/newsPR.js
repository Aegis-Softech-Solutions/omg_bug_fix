const newsPR = (sequelize, DataTypes) => {
  const NewsPR = sequelize.define('news_pr', {
    title: { type: DataTypes.STRING },
    slug: { type: DataTypes.STRING },
    featured_image: { type: DataTypes.STRING },
    media_type: { type: DataTypes.STRING }, // hard-coded values: "image", "video"
    html_content: { type: DataTypes.TEXT },
    excerpt: { type: DataTypes.TEXT },
    publish_at: { type: DataTypes.STRING }, // a timestamp for later publishing
    active: { type: DataTypes.BOOLEAN },
    created_by: { type: DataTypes.INTEGER },
    updated_by: { type: DataTypes.INTEGER },
  });

  return NewsPR;
};

export default newsPR;
