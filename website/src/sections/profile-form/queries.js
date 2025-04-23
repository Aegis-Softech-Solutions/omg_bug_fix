import gql from "graphql-tag";

export const UPSERT_PROFILE = gql`
  mutation(
    $dob: String
    $bio: String
    $insta_link: String
    $insta_verified: Boolean
    $fb_link: String
    $height: String
    $weight: Int
    $state: String
    $city: String
    $pincode: Int
    $pic1: Upload
    $pic2: Upload
    $pic3: Upload
    $pic4: Upload
    $intro_video: Upload
    $personality_meaning: [String]
    $final_status: String
  ) {
    upsertProfile(
      dob: $dob
      bio: $bio
      insta_link: $insta_link
      insta_verified: $insta_verified
      fb_link: $fb_link
      height: $height
      weight: $weight
      state: $state
      city: $city
      pincode: $pincode
      pic1: $pic1
      pic2: $pic2
      pic3: $pic3
      pic4: $pic4
      intro_video: $intro_video
      personality_meaning: $personality_meaning
      final_status: $final_status
    )
  }
`;

export const PINCODE = gql`
  query($pincode: Int!) {
    pincode(pincode: $pincode) {
      pincode
      district
      state
    }
  }
`;
