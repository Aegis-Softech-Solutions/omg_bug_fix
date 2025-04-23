import gql from "graphql-tag";

export const TOP_150_LEADERBOARD_BY_SEARCH = gql`
  query ($gender: String, $searchTerm: String, $offset: Int) {
    top150LeaderboardBySearch(
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
