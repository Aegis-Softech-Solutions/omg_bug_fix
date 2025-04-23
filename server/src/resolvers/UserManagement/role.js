export default {
  Query: {
    roles: async (parent, args, { models }) => await models.Role.findAll(),
    role: async (parent, { id }, { models }) => await models.Role.findById(id)
  },

  Mutation: {
    addRole: async (parent, { title, permissions }, { models }) => {
      const role = await models.Role.create({ title, permissions });
      return role;
    },

    updateRole: async (parent, { id, title, permissions }, { models }) => {
      let resultset;
      const role = await models.Role
        .update(
          { title, permissions },
          {
            where: { id: id },
            returning: true, //if set to true it will give all the data which gets updated
            plain: true //it will show the object in plain format
          }
        )
        .then((result) => {
          return (resultset = result);
        });

      return {
        id: resultset[1].id,
        title: resultset[1].title,
        permissions: resultset[1].permissions
      };
    }
  }
};
