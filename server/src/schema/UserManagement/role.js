import { gql } from 'apollo-server-express';

export default gql`
	extend type Query {
		roles: [Role!]
		role(id: ID!): Role!
	}

	extend type Mutation {
		addRole(title: String!, permissions: String!): Role!
		updateRole(id: ID!, title: String!, permissions: String!): Role!
	}

	type Role {
		id: ID!
		title: String!
		permissions: String!
	}

	type ReturnID {
		id: ID!
	}
`;
