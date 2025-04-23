import gql from "graphql-tag";

export const TOP_500_LEADERBOARD_BY_SEARCH = gql`
  query ($gender: String, $searchTerm: String, $offset: Int) {
    top500LeaderboardBySearch(
      gender: $gender
      searchTerm: $searchTerm
      offset: $offset
    ) {
      id
      full_name
      slug
      votes
      top_500_final_rank
      profile_pic
      city
    }
  }
`;
