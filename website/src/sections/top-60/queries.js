import gql from "graphql-tag";

export const TOP_30_LEADERBOARD_BY_SEARCH = gql`
  query ($gender: String, $searchTerm: String, $offset: Int) {
    top30LeaderboardBySearch(
      gender: $gender
      searchTerm: $searchTerm
      offset: $offset
    ) {
      id
      full_name
      slug
      votes
      profile_pic
      city
    }
  }
`;
