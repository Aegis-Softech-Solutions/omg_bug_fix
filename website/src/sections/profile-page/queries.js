import gql from "graphql-tag";

export const UPSERT_PROFILE = gql`
  mutation (
    $dob: String
    $bio: String
    $insta_link: String
    $fb_link: String
    $height: String
    $weight: Int
    $state: String
    $city: String
    $pincode: Int
    $pic1: Upload
    $pic2: Upload
    $pic3: Upload
    $intro_video: Upload
    $personality_meaning: [String]
    $final_status: String
  ) {
    upsertProfile(
      dob: $dob
      bio: $bio
      insta_link: $insta_link
      fb_link: $fb_link
      height: $height
      weight: $weight
      state: $state
      city: $city
      pincode: $pincode
      pic1: $pic1
      pic2: $pic2
      pic3: $pic3
      intro_video: $intro_video
      personality_meaning: $personality_meaning
      final_status: $final_status
    )
  }
`;

export const UPLOAD_TOP_150_VIDEO = gql`
  mutation ($video: Upload) {
    uploadTop150Video(video: $video)
  }
`;

export const UPLOAD_TOP_75_VIDEO = gql`
  mutation ($video: Upload) {
    uploadTop75Video(video: $video)
  }
`;

export const UPLOAD_TOP_30_VIDEO = gql`
  mutation ($video: Upload) {
    uploadTop30Video(video: $video)
  }
`;

export const UPLOAD_TOP_20_VIDEO = gql`
  mutation ($video: Upload) {
    uploadTop20Video(video: $video)
  }
`;
