import React, { Component } from "react";
import Router from "next/router";
import ReactPlayer from "react-player";
import Link from "next/link";
import styled from "styled-components";
import { Container, Row, Col } from "react-bootstrap";
import Slider from "react-slick";
import DatePicker from "react-datepicker";
import { destroyCookie } from "nookies";
import ReactModal from "react-modal";
import ReactCrop from "react-image-crop";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import { breakpoints } from "../../utils";
import {
  Title,
  Button,
  Section,
  Box,
  Text,
  Input,
  Select,
} from "../../components/Core";
import _ from "lodash";
import moment from "moment";

import { CopyToClipboard } from "react-copy-to-clipboard";

import { toast } from "react-nextjs-toast";

import loaderGif from "../../assets/image/loader.gif";

import closeUpHairstylistImage from "../../assets/image/profile-form/gender-h-category-closeup-image.jpeg";

import closeUpImage from "../../assets/image/profile-form/close-up-placeholder.jpg";
import fullProfileImage from "../../assets/image/profile-form/full-profile-placeholder.jpg";
import midShotImage from "../../assets/image/profile-form/mid-shot-placeholder.jpg";

import closeUpMaleImage from "../../assets/image/profile-form/close-up-placeholder-male.jpg";
import fullProfileMaleImage from "../../assets/image/profile-form/full-profile-placeholder-male.jpg";
import midShotMaleImage from "../../assets/image/profile-form/mid-shot-placeholder-male.jpg";

import femaleSampleVideo from "../../assets/image/profile-form/female-sample-video.mp4";
import instagramVideo from "../../assets/image/profile-form/instagram-verification.mp4";

import { Query, Mutation } from "react-apollo";
import { ApolloConsumer } from "react-apollo";
import { PINCODE, UPSERT_PROFILE } from "./queries.js";

const axios = require("axios");

const CalendarCustomInput = ({ value, onClick }) =>
  value && value !== "" ? (
    <button
      className="calendar-custom-input"
      onClick={onClick}
      style={{ paddingTop: "5px", fontSize: "15px" }}
    >
      {value}
    </button>
  ) : (
    <button
      className="calendar-custom-input"
      onClick={onClick}
      style={{ paddingTop: "28px", fontSize: "15px" }}
    >
      {value}
    </button>
  );

const heightOptions = [
  { value: "", label: "Height", isDisabled: true },
  { value: "4' 5''", label: "4' 5''" },
  { value: "4' 6''", label: "4' 6''" },
  { value: "4' 7''", label: "4' 7''" },
  { value: "4' 8''", label: "4' 8''" },
  { value: "4' 9''", label: "4' 9''" },
  { value: "4' 10''", label: "4' 10''" },
  { value: "4' 11''", label: "4' 11''" },
  { value: "5' 0''", label: "5' 0''" },
  { value: "5' 1''", label: "5' 1''" },
  { value: "5' 2''", label: "5' 2''" },
  { value: "5' 3''", label: "5' 3''" },
  { value: "5' 4''", label: "5' 4''" },
  { value: "5' 5''", label: "5' 5''" },
  { value: "5' 6''", label: "5' 6''" },
  { value: "5' 7''", label: "5' 7''" },
  { value: "5' 8''", label: "5' 8''" },
  { value: "5' 9''", label: "5' 9''" },
  { value: "5' 10''", label: "5' 10''" },
  { value: "5' 11''", label: "5' 11''" },
  { value: "6' 0''", label: "6' 0''" },
  { value: "6' 1''", label: "6' 1''" },
  { value: "6' 2''", label: "6' 2''" },
  { value: "6' 3''", label: "6' 3''" },
  { value: "6' 4''", label: "6' 4''" },
  { value: "6' 5''", label: "6' 5''" },
  { value: "6' 6''", label: "6' 6''" },
  { value: "6' 7''", label: "6' 7''" },
  { value: "6' 8''", label: "6' 8''" },
  { value: "6' 9''", label: "6' 9''" },
  { value: "6' 10''", label: "6' 10''" },
  { value: "6' 11''", label: "6' 11''" },
];

const SliderStyled = styled(Slider)`
  .slick-dots {
    position: relative;
    margin-top: 10px;
    li {
      font-size: 0;
      width: 17px;
      height: 8px;
      border-radius: 4px;
      background-color: ${({ theme }) => theme.colors.shadow};
      margin-left: 5px;
      margin-right: 5px;
      transition: 0.5s;
      &.slick-active {
        width: 45px;
        height: 8px;
        border-radius: 4px;
        background-color: ${({ theme }) => theme.colors.secondary};
      }
      button {
        width: 100%;
        height: 100%;
        &:before {
          content: none;
        }
      }
    }
  }
`;

const slickSettings = {
  dots: true,
  infinite: false,
  arrows: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  // centerMode: true,
  // centerPadding: "1px",
  responsive: [
    {
      breakpoint: breakpoints.md,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

class ProfileForm extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  constructor(props) {
    super(props);

    // Extract hairstylist-specific fields from bio
    let parsedSpecialization = "";
    let parsedWorkExperience = "";
    let parsedSalonName = "";
    let parsedParticipationReason = "";
    let parsedwillingToTravel = null;
    let parsedallergiesOrMedicalConditions = "";

    let onlineVoting;
    if (props.contestStages) {
      props.contestStages.forEach((stageDetail) => {
        if (stageDetail.stage === "online_voting" && stageDetail.active)
          onlineVoting = true;
      });
    }
    if (props.profileByCustomerId?.bio && props.customerDetails?.gender === "h") {
      const bioLines = props.profileByCustomerId.bio.split("\n");
      bioLines.forEach((line) => {
        if (line.startsWith("Specialization:")) {
          parsedSpecialization = line.replace("Specialization: ", "").trim();
        } else if (line.startsWith("Work Experience:")) {
          parsedWorkExperience = line.replace("Work Experience: ", "").replace(" years", "").trim();
        } else if (line.startsWith("Salon/Business Name:")) {
          parsedSalonName = line.replace("Salon/Business Name: ", "").trim();
        } else if (line.startsWith("Participation Reason:")) {
          parsedParticipationReason = line.replace("Participation Reason: ", "").trim();
        }
        else if (line.startsWith("Willing to Travel:")) {
          parsedwillingToTravel = line.replace("Willing to Travel: ", "").trim();
        }
        else if (line.startsWith("Allergies/Medical Conditions:")) {
          parsedallergiesOrMedicalConditions = line.replace("Allergies/Medical Conditions: ", "").trim();
        }
      });
    }
    let maxBirthdate = new Date();
    maxBirthdate.setFullYear(maxBirthdate.getFullYear() - 18);

    let convertedBirthDate = null;

    if (props.profileByCustomerId && props.profileByCustomerId.dob !== null) {
      try {
        convertedBirthDate = moment(
          Number(props.profileByCustomerId.dob)
        ).toDate();
      } catch (error) {
        convertedBirthDate = null;
      }
    }

    let fullNameArray =
      props.customerDetails && props.customerDetails.full_name
        ? props.customerDetails.full_name.split(" ")
        : [""];

    let firstName, lastName;

    if (fullNameArray.length > 1) {
      firstName = fullNameArray[0] + "";
      fullNameArray.shift();
      lastName = fullNameArray.join(" ");
    } else {
      firstName = fullNameArray[0];
    }

    this.state = {
      specialization: parsedSpecialization,
      workExperience: parsedWorkExperience,
      salonName: parsedSalonName,
      participationReason: parsedParticipationReason,
      willingToTravel: parsedwillingToTravel,
      allergiesOrMedicalConditions: parsedallergiesOrMedicalConditions,
      onlineVoting: onlineVoting,
      dataChanged: false,
      crop: {
        height: 1000,
        aspect: 3 / 4,
      },
      maxBirthdate: maxBirthdate,
      showModal: false,
      showVideoModal: false,
      showInstagramVerificationModal: false,
      closeUpPath:
        props.profileByCustomerId && props.profileByCustomerId.pic1
          ? props.profileByCustomerId.pic1
          : null,
      midShotPath:
        props.profileByCustomerId && props.profileByCustomerId.pic2
          ? props.profileByCustomerId.pic2
          : null,
      fullProfilePath:
        props.profileByCustomerId && props.profileByCustomerId.pic3
          ? props.profileByCustomerId.pic3
          : null,
      additionalImagePath:     // Aditional image path for hairstylist
        props.profileByCustomerId && props.profileByCustomerId.pic4
          ? props.profileByCustomerId.pic4
          : null,
      bio:
        props.profileByCustomerId && props.profileByCustomerId.bio
          ? props.profileByCustomerId.bio
          : "",
      birthDate: convertedBirthDate,
      bioLength:
        props.profileByCustomerId && props.profileByCustomerId.bio
          ? props.profileByCustomerId.bio.length
          : 0,
      introVideoPath:
        props.profileByCustomerId && props.profileByCustomerId.intro_video
          ? props.profileByCustomerId.intro_video
          : null,
      personalityMeaning:
        props.profileByCustomerId &&
          props.profileByCustomerId.personality_meaning
          ? props.profileByCustomerId.personality_meaning
          : [],
      acceptChecked: false,
      height:
        props.profileByCustomerId && props.profileByCustomerId.height
          ? props.profileByCustomerId.height
          : null,
      weight:
        props.profileByCustomerId && props.profileByCustomerId.weight
          ? props.profileByCustomerId.weight
          : null,
      pincode:
        props.profileByCustomerId && props.profileByCustomerId.pincode
          ? props.profileByCustomerId.pincode
          : null,
      stateName:
        props.profileByCustomerId && props.profileByCustomerId.state
          ? props.profileByCustomerId.state
          : null,
      cityName:
        props.profileByCustomerId && props.profileByCustomerId.city
          ? props.profileByCustomerId.city
          : null,
      instagramLink:
        props.profileByCustomerId && props.profileByCustomerId.insta_link
          ? props.profileByCustomerId.insta_link
          : null,
      instagramVerified:
        props.profileByCustomerId && props.profileByCustomerId.insta_verified
          ? props.profileByCustomerId.insta_verified
          : null,
      firstName: firstName,
      lastName: lastName,
      final_status:
        props.profileByCustomerId && props.profileByCustomerId.final_status
          ? props.profileByCustomerId.final_status
          : null,
      gender:
        props.customerDetails && props.customerDetails.gender
          ? props.customerDetails.gender
          : "m",
      instaVerifyCode: "",
    };

    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);

    this.handleOpenVideoModal = this.handleOpenVideoModal.bind(this);
    this.handleCloseVideoModal = this.handleCloseVideoModal.bind(this);

    this.handleOpenInstagramVerificationModal =
      this.handleOpenInstagramVerificationModal.bind(this);
    this.handleCloseInstagramVerificationModal =
      this.handleCloseInstagramVerificationModal.bind(this);
  }

  makeID = (length) => {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    this.setState({ instaVerifyCode: result });
  };

  // If you setState the crop in here you should return false.
  onImageLoaded = (image) => {
    this.imageRef = image;
    this.setState({
      crop: {
        height: 1000,
        aspect: 3 / 4,
      },
    });
    return false;
  };

  onCropComplete = (crop) => {
    this.makeClientCrop(crop);
  };

  onCropChange = (crop, percentCrop) => {
    this.setState({ crop });
  };

  async makeClientCrop(crop) {
    if (this.imageRef && crop.width && crop.height) {
      const croppedImageUrl = await this.getCroppedImg(
        this.imageRef,
        crop,
        "newFile.jpeg"
      );
      const croppedBlob = await this.getCroppedImgBlob(
        this.imageRef,
        crop,
        "newFile.jpeg"
      );
      this.setState({ croppedImageUrl, croppedBlob });
    }
  }

  getCroppedImgBlob(image, crop, fileName) {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = Math.ceil(crop.width * scaleX);
    canvas.height = Math.ceil(crop.height * scaleY);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error("Canvas is empty");
          return;
        }
        blob.name = fileName;
        resolve(blob);
      }, "image/jpeg");
    });
  }

  getCroppedImg(image, crop, fileName) {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = Math.ceil(crop.width * scaleX);
    canvas.height = Math.ceil(crop.height * scaleY);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );
    return canvas.toDataURL("image/jpeg", 1.0);
  }

  updateProfilePicture = (croppedImageUrl, croppedBlob, imageType) => {
    let updatedImage = new File([croppedBlob], "updated-image.jpg", {
      type: "image/jpeg",
      lastModified: Date.now(),
    });
    this.setState({
      [imageType + "Path"]: updatedImage,
      [imageType + "Changed"]: true,
      [imageType]: croppedImageUrl,
      showCropModal: false,
      dataChanged: true,
    });
  };

  onSelectImage = (e, imageType) => {
    if (e.target.files && e.target.files.length > 0) {
      if (e.target.files[0].size / (1024 * 1024) > 3) {
        toast.notify("", {
          duration: 5,
          type: "error",
          position: "top-right",
          title: "Image size should be less than 3MB",
        });
        e.target.value = "";
      } else {
        this.setState({
          [imageType + "Path"]: e.target.files[0],
          [imageType + "Changed"]: true,
          showCropModal: true,
          imageTypeDesc: imageType,
          dataChanged: true,
        });
        const reader = new FileReader();
        reader.addEventListener("load", () =>
          this.setState({ [imageType]: reader.result })
        );
        reader.readAsDataURL(e.target.files[0]);
        e.target.value = "";
      }
    }
  };

  handleOpenModal() {
    this.setState({ showModal: true });
  }

  handleCloseModal() {
    this.setState({ showModal: false });
  }

  handleOpenVideoModal() {
    this.setState({ showVideoModal: true });
  }

  handleCloseVideoModal() {
    this.setState({ showVideoModal: false });
  }

  handleOpenInstagramVerificationModal() {
    this.makeID(6);

    if (
      !this.state.instagramLink ||
      this.state.instagramLink === "" ||
      /\s/g.test(this.state.instagramLink)
    ) {
      toast.notify("", {
        duration: 5,
        type: "error",
        position: "top-right",
        title: "Please fill a valid instagram handle without spaces",
      });
    } else {
      this.setState({ showInstagramVerificationModal: true });
    }
  }

  handleCloseInstagramVerificationModal() {
    this.setState({ showInstagramVerificationModal: false });
  }

  async verifyInstagram() {
    const userInfoSource = await axios.get(
      "https://www.instagram.com/" + this.state.instagramLink + "/"
    );

    const jsonObject = userInfoSource.data
      .match(
        /<script type="text\/javascript">window\._sharedData = (.*)<\/script>/
      )[1]
      .slice(0, -1);

    const userInfo = JSON.parse(jsonObject);

    if (
      userInfo.entry_data.ProfilePage[0].graphql.user.biography.includes(
        this.state.instaVerifyCode
      )
    ) {
      this.setState(
        {
          instagramVerified: true,
          showInstagramVerificationModal: false,
          formMessage: "",
          dataChanged: true,
        },
        () =>
          toast.notify("", {
            duration: 5,
            type: "success",
            position: "top-right",
            title: "Instagram verified successfully.",
          })
      );
    } else {
      toast.notify("", {
        duration: 5,
        type: "error",
        position: "top-right",
        title: "Unable to verify, please retry the steps.",
      });
    }
  }

  onSelectVideo = (e, imageType) => {
    if (e.target.files && e.target.files.length > 0) {
      if (e.target.files[0].size / (1024 * 1024) > 25) {
        toast.notify("", {
          duration: 5,
          type: "error",
          position: "top-right",
          title: "Video size should be less than 25MB",
        });
      } else {
        this.setState({
          introVideoPath: e.target.files[0],
          introVideo: URL.createObjectURL(e.target.files[0]),
          introVideoChanged: true,
          dataChanged: true,
        });
      }
    }
  };

  onChangeBio = (e) => {
    if (e.target.value.length < 501) {
      this.setState({
        bio: e.target.value,
        bioLength: e.target.value.length,
        formMessage: "",
        dataChanged: true,
      });
    }
  };

  onChangeHeight = (e) => {
    this.setState({ height: e.value, formMessage: "", dataChanged: true });
  };

  onChangeWeight = (e) => {
    this.setState({
      weight: e.target.value,
      formMessage: "",
      dataChanged: true,
    });
  };
  onChangeCity = (e) => {
    this.setState({
      cityName: e.target.value,
      formMessage: "",
      dataChanged: true,
    });
  };
  onChangeState = (e) => {
    this.setState({
      stateName: e.target.value,
      formMessage: "",
      dataChanged: true,
    });
  };

  setBirthDate = (date) => {
    this.setState({ birthDate: date, formMessage: "", dataChanged: true });
  };

  onChangePincode = (pincodeValue, data) => {
    this.setState({
      pincode: pincodeValue,
      stateName: data.pincode && data.pincode.state ? data.pincode.state : "",
      cityName:
        data.pincode && data.pincode.district ? data.pincode.district : "",
      formMessage: "",
      dataChanged: true,
    });
  };

  onChangeInstagramLink = (e) => {
    this.setState({
      instagramLink: e.target.value.trim(),
      instagramVerified: false,
      formMessage: "",
      dataChanged: true,
    });
  };

  onChangeFacebookLink = (e) => {
    this.setState({
      facebookLink: e.target.value,
      formMessage: "",
      dataChanged: true,
    });
  };

  onChangeAccepted = (e) => {
    this.setState({
      acceptChecked: e.target.checked,
      formMessage: "",
      dataChanged: true,
    });
  };

  onChangePersonality = (e) => {
    // current array of options
    const personalityMeaning = this.state.personalityMeaning
      ? this.state.personalityMeaning
      : [];
    let index;

    // check if the check box is checked or unchecked
    if (e.target.checked) {
      // add the numerical value of the checkbox to options array
      personalityMeaning.push(e.target.value);
    } else {
      // or remove the value from the unchecked checkbox from the array
      index = personalityMeaning.indexOf(e.target.value);
      personalityMeaning.splice(index, 1);
    }

    // update the state with the new array of options
    this.setState({
      personalityMeaning: personalityMeaning,
      dataChanged: true,
    });
  };

  logOutUser = () => {
    destroyCookie(null, "token");
    setTimeout(function () {
      Router.push({
        pathname: "/login",
      });
    }, 1000);
  };

  previewProfile = (e, upsertProfileMutation) => {
    if (!this.state.dataChanged) {
      Router.push("/my-profile");
    } else {
      let variables = {
        pic1: this.state.closeUpPath,
        pic2: this.state.gender !== "h" ? this.state.midShotPath : null,
        pic3: this.state.gender !== "h" ? this.state.fullProfilePath : null,
        pic4: this.state.gender !== "h" ? this.state.additionalImagePath : null,
        intro_video: this.state.introVideoPath,
        personality_meaning: this.state.personalityMeaning,
        bio: this.state.bio,
        height: this.state.height,
        weight: parseInt(this.state.weight, 10),
        dob: this.state.birthDate
          ? String(moment(this.state.birthDate, "DD-MM-YYYY").valueOf())
          : null,
        pincode: parseInt(this.state.pincode, 10),
        state: this.state.stateName,
        city: this.state.cityName,
        insta_link: this.state.instagramLink,
        insta_verified: this.state.instagramVerified,
        fb_link: this.state.facebookLink,
        final_status: "draft",
      };
      if (this.state.closeUpPath === null || this.state.closeUpPath === "") {
        this.setState({ formMessage: this.state.gender !== "h" ? "Please upload a close up image." : "Please upload Profile Photo" });
      } else if (
        this.state.gender !== "h" && (
        this.state.midShotPath === null ||
        this.state.midShotPath === "")
      ) {
        this.setState({ formMessage: "Please upload a waist up image." });
      } else if (
        this.state.gender !== "h" && (
        this.state.fullProfilePath === null ||
        this.state.fullProfilePath === "")
      ) {
        this.setState({ formMessage: "Please upload a full profile image." });
      }
      // else if (
      //   this.state.gender !== "h" && 
      //   this.state.additionalImagePath === null
      // ) {
      //   this.setState({ formMessage: "Please upload a showcase image 3" });
      // }
      // else if (
      //   this.state.introVideoPath === null ||
      //   this.state.introVideoPath === ""
      // ) {
      //   this.setState({ formMessage: "Please upload your intro video." });
      // }
      else if (
        this.state.personalityMeaning === null ||
        this.state.personalityMeaning === [] ||
        this.state.personalityMeaning.length === 0
      ) {
        this.setState({
          formMessage: "Please select what personality means to you.",
        });
      } else if (this.state.bio.length < 100 && this.state.gender !== "h" ) {
        this.setState({ formMessage: "Bio should atleast be 100 characters." });
      } else if (this.state.height === null || this.state.height === "") {
        this.setState({ formMessage: "Please select your height." });
      } else if (this.state.weight === null || this.state.weight === "") {
        this.setState({ formMessage: "Please fill your weight." });
      } else if (this.state.birthDate === null || this.state.birthDate === "") {
        this.setState({ formMessage: "Please select your birth date." });
      } else if (this.state.pincode === null || this.state.pincode === "") {
        this.setState({ formMessage: "Please fill your pincode." });
      } else if (
        this.state.instagramLink === null ||
        this.state.instagramLink === "" ||
        /\s/g.test(this.state.instagramLink)
      ) {
        this.setState({
          formMessage: "Please fill your instagram handle without spaces.",
        });
      } else if (this.state.gender === "h" && (this.state.participationReason.trim() === "" || this.state.participationReason === null)) {
        this.setState({
          formMessage:
            "Please describe why you want to participate in the competition.",
        });
      }
      else if (this.state.gender === "h" &&
        (this.state.willingToTravel === null ||
        this.state.willingToTravel === "")
      ) {
        this.setState({
          formMessage: "Please specify if you are willing to travel for the competition finals.",
        });
      } else if (
        this.state.gender === "h" &&
       ( this.state.workExperience === null ||
        this.state.workExperience.trim() === "")
      ) {
        this.setState({ formMessage: "Please fill your work experience." });
      } else if (
        this.state.gender === "h" &&
        (this.state.specialization === null ||
        this.state.specialization.trim() === "")
      ) {
        this.setState({ formMessage: "Please fill your specialization." });
      } else if (
        this.state.gender === "h" &&
        (this.state.allergiesOrMedicalConditions === null ||
        this.state.allergiesOrMedicalConditions.trim() === "")
      ) {
        this.setState({ formMessage: "Please fill your allergies/medical conditions." });
      }
       else {
        this.setState({ hideButtons: true });
        upsertProfileMutation({ variables })
          .then((results) => {
            Router.push("/my-profile");
            this.setState({
              formMessage: "",
              hideButtons: false,
            });
          })
          .catch((error) => {
            this.setState({
              formMessage: Object.values(error)[0][0].message,
              hideButtons: false,
            });
          });
      }
    }
  };

  updateProfile = (e, upsertProfileMutation, saveType) => {
    // Initialize concatenated bio with existing bio content
    let concatenatedBio = "";

    // Append hairstylist-specific fields only if gender is 'h' and fields are not empty
    if (this.state.gender === "h") {
      const extraFields = [];
      if (this.state.specialization && this.state.specialization.trim()) {
        extraFields.push(`Specialization: ${this.state.specialization.trim()}`);
      }
      if (this.state.workExperience && this.state.workExperience.trim()) {
        extraFields.push(`Work Experience: ${this.state.workExperience.trim()} years`);
      }
      if (this.state.salonName && this.state.salonName.trim()) {
        extraFields.push(`Salon/Business Name: ${this.state.salonName.trim()}`);
      }
      if (this.state.participationReason && this.state.participationReason.trim()) {
        extraFields.push(`Participation Reason: ${this.state.participationReason.trim()}`);
      }
      if (this.state.willingToTravel && this.state.willingToTravel.trim()) {
        extraFields.push(`Willing to Travel: ${this.state.willingToTravel.trim()}`);
      }
      if (this.state.allergiesOrMedicalConditions && this.state.allergiesOrMedicalConditions.trim()) {
        extraFields.push(`Allergies/Medical Conditions: ${this.state.allergiesOrMedicalConditions.trim()}`);
      }
      // Only append non-empty fields
      if (extraFields.length > 0) {
        concatenatedBio += "\n" + extraFields.join("\n");
      }
    }

    let variables = {
      pic1: this.state.closeUpPath,
      pic2: this.state.gender !== "h" ? this.state.midShotPath : null,
      pic3: this.state.gender !== "h" ? this.state.fullProfilePath : null,
      pic4: this.state.gender !== "h" ? this.state.additionalImagePath : null,
      intro_video: this.state.introVideoPath,
      personality_meaning: this.state.personalityMeaning,
      bio: concatenatedBio, // Updated bio
      height: this.state.height,
      weight: parseInt(this.state.weight, 10),
      dob: this.state.birthDate
        ? String(moment(this.state.birthDate, "DD-MM-YYYY").valueOf())
        : null,
      pincode: parseInt(this.state.pincode, 10),
      state: this.state.stateName,
      city: this.state.cityName,
      insta_link: this.state.instagramLink,
      insta_verified: this.state.instagramVerified,
      fb_link: this.state.facebookLink,
      final_status: "draft",
    };

    if (
      saveType === "final" &&
      (this.state.closeUpPath === null || this.state.closeUpPath === "")
    ) {
      this.setState({ formMessage: "Please upload a close up image." });
    }
    else if (
      saveType === "final" &&
      (this.state.workExperience === null || this.state.workExperience === "")
    ) {
      this.setState({ formMessage: "Please fill your work experience." });
    }
    else if (
      saveType === "final" &&
      (this.state.specialization === null || this.state.specialization === "")
    ) {
      this.setState({ formMessage: "Please fill your specialization." });
    }
    else if (
      saveType === "final" &&
      (this.state.participationReason === null || this.state.participationReason === "")
    ) {
      this.setState({
        formMessage:
          "Please describe why you want to participate in the competition.",
      });
    }
    else if (
      saveType === "final" &&
      (this.state.willingToTravel === null || this.state.willingToTravel === "")
    ) {
      this.setState({ formMessage: "Please specify if you are willing to travel for the competition finals.", });
    }
    else if (
      saveType === "final" &&
      (this.state.midShotPath === null || this.state.midShotPath === "")
    ) {
      this.setState({ formMessage: "Please upload a mid shot image." });
    } else if (
      saveType === "final" &&
      (this.state.fullProfilePath === null || this.state.fullProfilePath === "")
    ) {
      this.setState({ formMessage: "Please upload a full profile image." });
    }
    // else if (
    //   saveType === "final" &&
    //   (this.state.introVideoPath === null || this.state.introVideoPath === "")
    // ) {
    //   this.setState({ formMessage: "Please upload your intro video." });
    // }
    else if (
      saveType === "final" &&
      (this.state.personalityMeaning === null ||
        this.state.personalityMeaning === [] ||
        this.state.personalityMeaning.length === 0)
    ) {
      this.setState({
        formMessage: "Please select what personality means to you.",
      });
    } else if (saveType === "final" && this.state.bio.length < 100) {
      this.setState({ formMessage: "Bio should atleast be 100 characters." });
    } else if (
      saveType === "final" &&
      (this.state.height === null || this.state.height === "")
    ) {
      this.setState({ formMessage: "Please select your height." });
    } else if (
      saveType === "final" &&
      (this.state.weight === null || this.state.weight === "")
    ) {
      this.setState({ formMessage: "Please fill your weight." });
    } else if (
      saveType === "final" &&
      (this.state.birthDate === null || this.state.birthDate === "")
    ) {
      this.setState({ formMessage: "Please select your birth date." });
    } else if (
      saveType === "final" &&
      (this.state.pincode === null || this.state.pincode === "")
    ) {
      this.setState({ formMessage: "Please fill your pincode." });
    } else if (
      saveType === "final" &&
      (this.state.instagramLink === null || this.state.instagramLink === "")
    ) {
      this.setState({ formMessage: "Please fill your instagram handle." });
    } else {
      this.setState({ hideButtons: true });

      upsertProfileMutation({ variables })
        .then((results) => {
          if (saveType === "draft") {
            toast.notify("", {
              duration: 10,
              type: "success",
              position: "top-right",
              title:
                "Draft saved successfully. Please make sure to preview and submit.",
            });
            this.setState({ formMessage: "", hideButtons: false });
          } else {
            toast.notify("", {
              duration: 5,
              type: "success",
              position: "top-right",
              title: "Submitted successfully",
            });
            this.setState({ formMessage: "", hideButtons: true });
          }
        })
        .catch((error) => {
          this.setState({
            formMessage: Object.values(error)[0][0].message,
            hideButtons: false,
          });
        });
    }
  };

  render() {
    const { crop, croppedImageUrl, croppedBlob } = this.state;
    return (
      <ApolloConsumer>
        {(client) => (
          <Mutation mutation={UPSERT_PROFILE}>
            {(upsertProfileMutation, { data, loading, error }) => (
              <Section pb={"30px"} pt={"70px"}>
                <ReactModal
                  isOpen={this.state.showModal}
                  contentLabel="Guidelines"
                  className="Modal"
                  overlayClassName="ReactModalOverlay"
                >
                  <Row>
                    <Col xs="8">
                      <Text
                        variant="bold"
                        color="#000000"
                        style={{ paddingBottom: "10px" }}
                      >
                        Photo Guidelines
                      </Text>
                    </Col>
                    <Col
                      xs="4"
                      style={{ textAlign: "right", paddingRight: "20px" }}
                    >
                      <Text variant="bold" onClick={this.handleCloseModal}>
                        <strong>X</strong>
                      </Text>
                    </Col>
                  </Row>

                  <Text variant="small" color="#000000">
                    1. Please submit three photos of yourself not above 3 MB in
                    vertical orientation (portrait mode): <br />
                    a. Close Up
                    <br />
                    b. Waist Up
                    <br />
                    c. Full Length
                    <br />
                    <br />
                    2. The images can be either phone clicked or professionally
                    done. Selfie images/videos will be disqualified.
                    <br />
                    <br />
                    3. All pictures should be with clear background preferably a
                    light colour (white/cream/pastel).
                    <br />
                    <br />
                    4. All pictures should be shot with proper makeover and
                    groomed hair.
                    <br />
                    <br />
                    5. The pictures shot should not be of any brand shoot or
                    copyrighted by any photographer.
                    <br />
                    <br />
                    6. The pictures if carrying any explicit content shall call
                    for immediate disqualification.
                  </Text>
                </ReactModal>

                <ReactModal
                  isOpen={this.state.showVideoModal}
                  contentLabel="Guidelines"
                  className="Modal"
                  overlayClassName="ReactModalOverlay"
                >
                  <Row>
                    <Col xs="9">
                      <Text
                        variant="bold"
                        color="#000000"
                        style={{ paddingBottom: "10px" }}
                      >
                        Intro Video Guidelines
                      </Text>
                    </Col>
                    <Col
                      xs="3"
                      style={{ textAlign: "right", paddingRight: "20px" }}
                    >
                      <Text variant="bold" onClick={this.handleCloseVideoModal}>
                        <strong>X</strong>
                      </Text>
                    </Col>
                  </Row>

                  <Text variant="small" color="#000000">
                    1. Introduction video to be uploaded has to be shot by a
                    mobile or camera with a maximum size of 25 MB.
                    <br />
                    <br />
                    2. The video should be shot with proper makeover and groomed
                    hair. Please refer the sample video and make sure to include
                    the following pointers: <br />
                    a. Name
                    <br />
                    b. City
                    <br />
                    c. Currently working as
                    <br />
                    d. Hobbies
                    <br />
                    e. Role Model
                    <br />
                    f. Why are you a part of OMG?
                    <br />
                    <br />
                    3. The video shot should not be of any brand shoot or
                    copyrighted by any photographer.
                    <br />
                    <br />
                    4. The video if carrying any explicit content shall call for
                    immediate disqualification.
                  </Text>
                </ReactModal>

                <ReactModal
                  isOpen={this.state.showInstagramVerificationModal}
                  contentLabel="Instagram Verification"
                  className="Modal"
                  overlayClassName="ReactModalOverlay"
                >
                  <Row>
                    <Col xs="8">
                      <Text
                        variant="bold"
                        color="#000000"
                        style={{ paddingBottom: "10px" }}
                      >
                        Instagram Verification
                      </Text>
                    </Col>
                    <Col
                      xs="4"
                      style={{ textAlign: "right", paddingRight: "20px" }}
                    >
                      <Text
                        variant="bold"
                        onClick={this.handleCloseInstagramVerificationModal}
                      >
                        <strong>X</strong>
                      </Text>
                    </Col>
                  </Row>

                  <Row className="mt-4">
                    <Col xs="6">
                      <Text variant="bold" color="#000000">
                        {this.state.instaVerifyCode}
                      </Text>
                      {/* <Input
                        type="text"
                        placeholder=""
                        // isRequired={true}
                        variant="dark"
                        disabled
                        value={this.state.instaVerifyCode}
                      /> */}
                    </Col>
                    <Col xs="6" style={{ textAlign: "right" }}>
                      <CopyToClipboard
                        text={this.state.instaVerifyCode}
                        onCopy={() =>
                          toast.notify("", {
                            duration: 5,
                            type: "success",
                            position: "top-right",
                            title: "Copied!",
                          })
                        }
                      >
                        {/* <Button width="100%" variant="custom" borderRadius={10}>
                          
                        </Button> */}
                        <Text
                          variant="bold"
                          color="#000000"
                          style={{ textDecoration: "underline" }}
                        >
                          Copy Code
                        </Text>
                      </CopyToClipboard>
                    </Col>
                  </Row>
                  <Row className="mt-4">
                    <Col xs="12">
                      <Text variant="small" color="#000000">
                        COPY the code from above, then PASTE it in your
                        instagram BIO, and return to this page and click the
                        VERIFY button shown below. Once verified, you can then
                        delete the code from the bio. This process takes less
                        than 10 seconds!
                      </Text>
                    </Col>
                  </Row>
                  <Row className="mt-4">
                    <Col xs="12">
                      <Button
                        width="100%"
                        variant="custom"
                        borderRadius={10}
                        onClick={(e) => this.verifyInstagram()}
                      >
                        Verify
                      </Button>
                    </Col>
                  </Row>
                  <Row className="mt-4">
                    {/* <Col xs="12">
                      <Text variant="bold" color="#000000">
                        {" "}
                        Process Explainer Video :{" "}
                      </Text>
                    </Col> */}
                    <Col xs="12">
                      <Accordion allowZeroExpanded={true}>
                        <AccordionItem uuid={99}>
                          <AccordionItemHeading>
                            <AccordionItemButton>
                              <Text
                                variant="small"
                                color="#000000"
                                style={{ textDecoration: "underline" }}
                              >
                                View Process Explainer Video
                              </Text>
                            </AccordionItemButton>
                          </AccordionItemHeading>
                          <AccordionItemPanel>
                            <video
                              src={instagramVideo + "#t=0.1"}
                              width="100%"
                              controls
                              playsInline
                            />
                          </AccordionItemPanel>
                        </AccordionItem>
                      </Accordion>
                    </Col>
                  </Row>
                </ReactModal>

                <ReactModal
                  isOpen={this.state.showCropModal}
                  contentLabel="Image"
                  className="ImageCropModal"
                  ariaHideApp={false}
                  overlayClassName="ReactModalOverlayCrop"
                >
                  <Container>
                    <ReactCrop
                      src={
                        this.state[this.state.imageTypeDesc]
                          ? this.state[this.state.imageTypeDesc]
                          : null
                      }
                      crop={crop}
                      ruleOfThirds
                      onImageLoaded={this.onImageLoaded}
                      onComplete={this.onCropComplete}
                      onChange={this.onCropChange}
                    />
                    {croppedImageUrl && (
                      <React.Fragment>
                        <div
                          className="col-12"
                          style={{ marginTop: "2%", textAlign: "center" }}
                        >
                          <Button
                            width="100%"
                            variant="custom"
                            borderRadius={10}
                            onClick={(e) => {
                              e.preventDefault,
                                this.updateProfilePicture(
                                  croppedImageUrl,
                                  croppedBlob,
                                  this.state.imageTypeDesc
                                );
                            }}
                          >
                            Update Picture
                          </Button>
                        </div>
                      </React.Fragment>
                    )}
                  </Container>
                </ReactModal>

                <Box pb={"30px"} pt={"20px"} pl={"10px"} pr={"10px"}>
                  {this.props.customerDetails &&
                    this.props.customerDetails.id ? (
                    this.state.final_status === "pending" ? (
                      <Container style={{ minHeight: "60vh", padding: "20px" }}>
                        <Row>
                          Hey!
                          <br />
                          Your profile is currently under review. You will
                          recieve an email after the status has been updated.
                          Stay tuned.
                        </Row>
                      </Container>
                    ) : this.state.final_status === "approved" ? (
                      <Container style={{ minHeight: "60vh", padding: "20px" }}>
                        <Row>
                          Hey!
                          <br />
                          Your profile has been approved. Share your profile as
                          much as possible to get votes and qualify to the next
                          round!
                          <br />
                          <br />
                          <Link href="/my-profile">
                            <a>
                              <Button
                                width="100%"
                                // type="submit"
                                variant="custom"
                                borderRadius={10}
                              >
                                View Profile
                              </Button>
                            </a>
                          </Link>
                        </Row>
                      </Container>
                    ) : (
                      <>
                        <Container>
                          <Row>
                            <Col xs="8">
                              <Text
                                fontSize="18px"
                                as="h4"
                                variant="contestant-name"
                                className="pb-1"
                              >
                                {this.state.firstName}
                                <br />
                                {this.state.lastName}
                              </Text>
                            </Col>
                            <Col xs="4"></Col>
                          </Row>
                        </Container>

                        <Container>
                          <Accordion
                            preExpanded={[1]}
                            allowMultipleExpanded={true}
                          >
                            <AccordionItem uuid={1}>
                              <AccordionItemHeading>
                                <AccordionItemButton>
                                  <span className="profile-form-accordian-number">
                                    1
                                  </span>
                                  <strong>PHOTOS</strong>
                                </AccordionItemButton>
                              </AccordionItemHeading>
                              <AccordionItemPanel>
                                <Box>
                                  <SliderStyled {...slickSettings}>
                                    <Box
                                      css={`
                                        &:focus {
                                          outline: none;
                                        }
                                        position: relative;
                                      `}
                                    >
                                      <img
                                        src={
                                          this.state.closeUpChanged
                                            ? this.state.closeUp
                                            : this.state.closeUpPath
                                              ? process.env.REACT_APP_IMAGE_URL +
                                              process.env
                                                .REACT_APP_PROFILE_IMAGE_PATH +
                                              this.state.closeUpPath
                                              : this.state.closeUp
                                                ? this.state.closeUp
                                                : this.state.gender === "m"
                                                  ? closeUpMaleImage
                                                  : this.state.gender === "h"
                                                    ? closeUpHairstylistImage
                                                    : closeUpImage
                                        }
                                        alt=""
                                        width="100%"
                                      />

                                      <label className="custom-file-upload">
                                        <input
                                          type="file"
                                          accept="image/*"
                                          onChange={(e) =>
                                            this.onSelectImage(e, "closeUp")
                                          }
                                          disabled={this.state.hideButtons}
                                        />
                                        <span>
                                          <i
                                            className="fas fa-cloud-upload-alt"
                                            style={{ paddingRight: "5px" }}
                                          ></i>
                                          {this.state.gender === 'h' ? 'Upload Professional Headshot' : 'Upload Close Up'}
                                        </span>
                                      </label>
                                    </Box>
                                    {this.state.gender !== "h" && <Box
                                      css={`
                                        &:focus {
                                          outline: none;
                                        }
                                        position: relative;
                                      `}
                                    >
                                      <img
                                        src={
                                          this.state.midShotChanged
                                            ? this.state.midShot
                                            : this.state.midShotPath
                                              ? process.env.REACT_APP_IMAGE_URL +
                                              process.env
                                                .REACT_APP_PROFILE_IMAGE_PATH +
                                              this.state.midShotPath
                                              : this.state.midShot
                                                ? this.state.midShot
                                                : this.state.gender === "m"
                                                  ? midShotMaleImage
                                                  : midShotImage
                                        }
                                        alt=""
                                        width="100%"
                                      />
                                      <label className="custom-file-upload">
                                        <input
                                          type="file"
                                          accept="image/*"
                                          onChange={(e) =>
                                            this.onSelectImage(e, "midShot")
                                          }
                                          disabled={this.state.hideButtons}
                                        />
                                        <span>
                                          <i
                                            className="fas fa-cloud-upload-alt"
                                            style={{ paddingRight: "5px" }}
                                          ></i>
                                          {this.state.gender === 'h' ? 'Upload Showcase Image 1' : 'Upload Waist Up'}
                                        </span>
                                      </label>
                                    </Box>}
                                    {this.state.gender !== "h" && <Box
                                      css={`
                                        &:focus {
                                          outline: none;
                                        }
                                        position: relative;
                                      `}
                                    >
                                      <img
                                        src={
                                          this.state.fullProfileChanged
                                            ? this.state.fullProfile
                                            : this.state.fullProfilePath
                                              ? process.env.REACT_APP_IMAGE_URL +
                                              process.env
                                                .REACT_APP_PROFILE_IMAGE_PATH +
                                              this.state.fullProfilePath
                                              : this.state.fullProfile
                                                ? this.state.fullProfile
                                                : this.state.gender === "m"
                                                  ? fullProfileMaleImage
                                                  : fullProfileImage
                                        }
                                        alt=""
                                        width="100%"
                                      />

                                      <label className="custom-file-upload">
                                        <input
                                          type="file"
                                          accept="image/*"
                                          onChange={(e) =>
                                            this.onSelectImage(e, "fullProfile")
                                          }
                                          disabled={this.state.hideButtons}
                                        />
                                        <span>
                                          <i
                                            className="fas fa-cloud-upload-alt"
                                            style={{ paddingRight: "5px" }}
                                          ></i>
                                          {this.state.gender === 'h' ? 'Upload Showcase Image 2' : 'Upload Full Length'}
                                        </span>
                                      </label>
                                    </Box>}
                                    {/* this.state.gender === "h" && 
                                    <Box
                                    css={`
                                      &:focus {
                                        outline: none;
                                      }
                                      position: relative;
                                    `}
                                  >
                                    <img
                                      src={
                                        this.state.additionalImageChanged
                                          ? this.state.additionalImage
                                          : this.state.additionalImagePath
                                            ? process.env.REACT_APP_IMAGE_URL +
                                            process.env
                                              .REACT_APP_PROFILE_IMAGE_PATH +
                                            this.state.additionalImagePath
                                            : this.state.additionalImage
                                              ? this.state.additionalImage
                                              : this.state.gender === "m"
                                                ? fullProfileMaleImage
                                                : fullProfileImage
                                      }
                                      alt=""
                                      width="100%"
                                    />

                                    <label className="custom-file-upload">
                                      <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) =>
                                          this.onSelectImage(e, "additionalImage")
                                        }
                                        disabled={this.state.hideButtons}
                                      />
                                      <span>
                                        <i
                                          className="fas fa-cloud-upload-alt"
                                          style={{ paddingRight: "5px" }}
                                        ></i>
                                         Upload Showcase Image 3
                                      </span>
                                    </label>
                                  </Box>
                                    */}
                                  </SliderStyled>
                                </Box>
                                <Text
                                  variant="very-small"
                                  style={{
                                    width: "100%",
                                    textAlign: "right",
                                  }}
                                  onClick={this.handleOpenModal}
                                >
                                  Guidelines*
                                </Text>
                                {this.state.gender !== "h" && <Box
                                  mt={2}
                                  mb={3}
                                  style={{
                                    marginTop: "5px",
                                    // paddingLeft: "20px",
                                    // paddingRight: "20px",
                                  }}
                                >
                                  <Input
                                    type="text"
                                    as="textarea"
                                    placeholder="Bio"
                                    rows={4}
                                    variant="dark"
                                    onChange={(e) => this.onChangeBio(e)}
                                    maxLength={500}
                                    value={this.state.bio}
                                    isRequired={true}
                                    disabled={this.state.hideButtons}
                                  />
                                  <div
                                    style={{
                                      fontSize: "12px",
                                      textAlign: "right",
                                    }}
                                  >
                                    {this.state.bioLength}/500 characters (min
                                    100)
                                  </div>
                                </Box>}
                                {this.state.gender === "h" && (
                                  <>
                                    <Box mb={3}>
                                      <Text variant="very-small" className="pt-2 input-title" color="#000000">
                                        Salon/Business Name (if applicable)
                                      </Text>
                                      <Input
                                        type="text"
                                        // placeholder="Salon/Business Name"
                                        variant="dark"
                                        onChange={(e) => this.setState({ salonName: e.target.value })}
                                        value={this.state.salonName}
                                        disabled={this.state.hideButtons}
                                      />
                                    </Box>

                                    <Box mb={3}>
                                      <Text variant="very-small" className="pt-2 input-title" color="#000000">
                                        Work Experience (in years)
                                      </Text>
                                      <Input
                                        type="number"
                                        // placeholder="Work Experience"
                                        variant="dark"
                                        onChange={(e) => this.setState({ workExperience: e.target.value })}
                                        value={this.state.workExperience}
                                        disabled={this.state.hideButtons}
                                      />
                                    </Box>

                                    <Box mb={3}>
                                      <Text variant="very-small" className="pt-2 input-title" color="#000000">
                                        Specialization (e.g., bridal, editorial, avant-garde, etc.)
                                      </Text>
                                      <Input
                                        type="text"
                                        // placeholder="Specialization"
                                        variant="dark"
                                        onChange={(e) => this.setState({ specialization: e.target.value })}
                                        value={this.state.specialization}
                                        disabled={this.state.hideButtons}
                                      />
                                    </Box>

                                    <Box mb={3}>
                                      <Text variant="very-small" className="pt-2 input-title" color="#000000">
                                        Why do you want to participate in the Hairstylist of the Year Pageant?
                                      </Text>
                                      <Input
                                        type="text"
                                        as="textarea"
                                        // placeholder="Why do you want to participate?"
                                        rows={4}
                                        variant="dark"
                                        onChange={(e) => this.setState({ participationReason: e.target.value })}
                                        value={this.state.participationReason}
                                        disabled={this.state.hideButtons}
                                      />
                                    </Box>
                                    <Box mb={3}>
                                      <Text variant="very-small" className="pt-2 input-title" color="#000000">
                                        Are you willing to travel for the competition finals? (Yes/No)
                                      </Text>
                                      <Select
                                        options={[
                                          { value: "Yes", label: "Yes" },
                                          { value: "No", label: "No" },
                                        ]}
                                        onChange={(e) => this.setState({ willingToTravel: e.value })}
                                        value={
                                          this.state.willingToTravel
                                            ? { value: this.state.willingToTravel, label: this.state.willingToTravel }
                                            : null
                                        }
                                        isDisabled={this.state.hideButtons}
                                      />
                                    </Box>

                                    <Box mb={3}>
                                      <Text variant="very-small" className="pt-2 input-title" color="#000000">
                                        Do you have any allergies or medical conditions we should be aware of? If yes, please specify:
                                      </Text>
                                      <Input
                                        type="text"
                                        // placeholder="Specify allergies or medical conditions"
                                        variant="dark"
                                        onChange={(e) => this.setState({ allergiesOrMedicalConditions: e.target.value })}
                                        value={this.state.allergiesOrMedicalConditions}
                                        disabled={this.state.hideButtons}
                                      />
                                    </Box>

                                  </>
                                )}

                                <Box
                                  mb={4}
                                  style={{
                                    marginTop: "25px",
                                    // paddingLeft: "20px",
                                    // paddingRight: "20px",
                                  }}
                                >
                                  <Text variant="very-small" color="#000000">
                                    WHAT DOES PERSONALITY MEAN TO YOU?
                                    <span style={{ color: "#FF0000" }}>*</span>
                                  </Text>
                                  <Row style={{ marginTop: "10px" }}>
                                    <Col xs="6">
                                      <Text
                                        variant="very-small"
                                        color="#000000"
                                        style={{
                                          fontSize: "15px",
                                          color: "#000000",
                                          fontWeight: "300",
                                          marginTop: "5px",
                                        }}
                                      >
                                        <input
                                          type="checkbox"
                                          id="personality"
                                          name="looks"
                                          value="Looks"
                                          onChange={(e) =>
                                            this.onChangePersonality(e)
                                          }
                                          checked={
                                            this.state.personalityMeaning.includes(
                                              "Looks"
                                            ) ||
                                            this.state.personalityMeaning.includes(
                                              "looks"
                                            )
                                          }
                                        />
                                        &nbsp;&nbsp;&nbsp;Looks
                                      </Text>
                                    </Col>
                                    <Col xs="6">
                                      <Text
                                        variant="very-small"
                                        color="#000000"
                                        style={{
                                          fontSize: "15px",
                                          color: "#000000",
                                          fontWeight: "300",
                                          marginTop: "5px",
                                        }}
                                      >
                                        <input
                                          type="checkbox"
                                          id="personality"
                                          name="attitude"
                                          value="Attitude"
                                          onChange={(e) =>
                                            this.onChangePersonality(e)
                                          }
                                          checked={
                                            this.state.personalityMeaning.includes(
                                              "Attitude"
                                            ) ||
                                            this.state.personalityMeaning.includes(
                                              "attitude"
                                            )
                                          }
                                        />
                                        &nbsp;&nbsp;&nbsp;Attitude
                                      </Text>
                                    </Col>
                                  </Row>
                                  <Row style={{ marginTop: "5px" }}>
                                    <Col xs="6">
                                      <Text
                                        variant="very-small"
                                        color="#000000"
                                        style={{
                                          fontSize: "15px",
                                          color: "#000000",
                                          fontWeight: "300",
                                          marginTop: "5px",
                                        }}
                                      >
                                        <input
                                          type="checkbox"
                                          id="personality"
                                          name="witty"
                                          value="Witty"
                                          onChange={(e) =>
                                            this.onChangePersonality(e)
                                          }
                                          checked={
                                            this.state.personalityMeaning.includes(
                                              "Witty"
                                            ) ||
                                            this.state.personalityMeaning.includes(
                                              "witty"
                                            )
                                          }
                                        />
                                        &nbsp;&nbsp;&nbsp;Witty
                                      </Text>
                                    </Col>
                                    <Col xs="6">
                                      <Text
                                        variant="very-small"
                                        color="#000000"
                                        style={{
                                          fontSize: "15px",
                                          color: "#000000",
                                          fontWeight: "300",
                                          marginTop: "5px",
                                        }}
                                      >
                                        <input
                                          type="checkbox"
                                          id="personality"
                                          name="confidence"
                                          value="Confidence"
                                          onChange={(e) =>
                                            this.onChangePersonality(e)
                                          }
                                          checked={
                                            this.state.personalityMeaning.includes(
                                              "Confidence"
                                            ) ||
                                            this.state.personalityMeaning.includes(
                                              "confidence"
                                            )
                                          }
                                        />
                                        &nbsp;&nbsp;&nbsp;Confidence
                                      </Text>
                                    </Col>
                                  </Row>
                                </Box>
                              </AccordionItemPanel>
                            </AccordionItem>
                            {/* <AccordionItem uuid={2}>
                              <AccordionItemHeading>
                                <AccordionItemButton>
                                  <span className="profile-form-accordian-number">
                                    2
                                  </span>
                                  <strong>VIDEO</strong>
                                </AccordionItemButton>
                              </AccordionItemHeading>
                              <AccordionItemPanel>
                                <ReactPlayer
                                  url={
                                    this.state.introVideoChanged
                                      ? this.state.introVideo
                                      : this.state.introVideoPath
                                      ? process.env.REACT_APP_IMAGE_URL +
                                        process.env
                                          .REACT_APP_PROFILE_IMAGE_PATH +
                                        this.state.introVideoPath +
                                        "#t=0.1"
                                      : this.state.introVideo
                                      ? this.state.introVideo + "#t=0.1"
                                      : femaleSampleVideo + "#t=0.1"
                                  }
                                  width="100%"
                                  height="30vh"
                                  controls={
                                    this.state.hideButtons ? false : true
                                  }
                                />
                                <Row
                                  style={{
                                    paddingBottom: "10px",
                                    textAlign: "right",
                                  }}
                                >
                                  <Col xs="12">
                                    <Text
                                      variant="very-small"
                                      style={{
                                        width: "100%",
                                        textAlign: "right",
                                        paddingTop: "5px",
                                      }}
                                      onClick={this.handleOpenVideoModal}
                                    >
                                      Guidelines*
                                    </Text>
                                  </Col>
                                </Row>

                                <label className="custom-video-upload">
                                  <input
                                    type="file"
                                    accept="video/mp4,video/x-m4v,video/*"
                                    onChange={(e) => this.onSelectVideo(e)}
                                    disabled={this.state.hideButtons}
                                  />

                                  <Row>
                                    <Col xs="6">
                                      {this.state.introVideoPath ? (
                                        <span>Video Uploaded</span>
                                      ) : null}
                                    </Col>
                                    <Col xs="6">
                                      <span className="upload-button">
                                        <i
                                          className="fas fa-cloud-upload-alt"
                                          style={{ paddingRight: "5px" }}
                                        ></i>
                                        Upload
                                      </span>
                                    </Col>
                                  </Row>
                                </label>
                              </AccordionItemPanel>
                            </AccordionItem> */}
                            <AccordionItem uuid={3}>
                              <AccordionItemHeading>
                                <AccordionItemButton>
                                  <span className="profile-form-accordian-number">
                                    2
                                  </span>
                                  <strong>BASIC INFORMATION</strong>
                                </AccordionItemButton>
                              </AccordionItemHeading>
                              <AccordionItemPanel>
                                <Box mb={3}>
                                  <Row>
                                    <Col xs="6">
                                      <Text
                                        variant="very-small"
                                        className="pt-2 input-title"
                                        color="#000000"
                                      >
                                        DOB
                                        <span style={{ color: "red" }}>*</span>
                                      </Text>
                                      <DatePicker
                                        selected={this.state.birthDate}
                                        onChange={(date) =>
                                          this.setBirthDate(date)
                                        }
                                        disabled={this.state.hideButtons}
                                        showMonthDropdown
                                        showYearDropdown
                                        dropdownMode="select"
                                        maxDate={this.state.maxBirthdate}
                                        dateFormat="dd-MM-yyyy"
                                        customInput={<CalendarCustomInput />}
                                      />
                                    </Col>
                                    <Col xs="6">
                                      <Text
                                        variant="very-small"
                                        className="pt-2 input-title"
                                        color="#000000"
                                      >
                                        Height
                                        <span style={{ color: "red" }}>*</span>
                                      </Text>
                                      <Select
                                        isDisabled={this.state.hideButtons}
                                        name="Height"
                                        options={heightOptions}
                                        onChange={(e) => this.onChangeHeight(e)}
                                        value={heightOptions.filter(
                                          (option) =>
                                            option.value === this.state.height
                                        )}
                                      />
                                    </Col>
                                  </Row>
                                </Box>
                                <Box mb={3}>
                                  <Row>
                                    <Col xs="6">
                                      <Input
                                        disabled={this.state.hideButtons}
                                        type="number"
                                        placeholder="Weight(kgs)"
                                        isRequired={true}
                                        variant="dark"
                                        onChange={(e) => this.onChangeWeight(e)}
                                        value={this.state.weight}
                                      />
                                    </Col>

                                    <Col xs="6">
                                      <Input
                                        disabled={this.state.hideButtons}
                                        type="number"
                                        placeholder="Pincode"
                                        isRequired={true}
                                        variant="dark"
                                        // onChange={(e) =>
                                        //   this.onChangePincode(e)
                                        // }
                                        value={this.state.pincode}
                                        onChange={async (e) => {
                                          let pincodeValue = e.target.value;
                                          const { data } = await client.query({
                                            query: PINCODE,
                                            variables: {
                                              pincode:
                                                e.target.value &&
                                                  e.target.value.length > 5
                                                  ? parseInt(e.target.value, 10)
                                                  : 0,
                                            },
                                          });
                                          this.onChangePincode(
                                            pincodeValue,
                                            data
                                          );
                                        }}
                                      />
                                    </Col>
                                  </Row>
                                </Box>
                                <Box mb={3}>
                                  <Row>
                                    <Col xs="6">
                                      <Input
                                        type="text"
                                        placeholder="City"
                                        isRequired={true}
                                        variant="dark"
                                        onChange={(e) => this.onChangeCity(e)}
                                        // disabled
                                        value={this.state.cityName}
                                      />
                                    </Col>
                                    <Col xs="6">
                                      <Input
                                        type="text"
                                        placeholder="State"
                                        isRequired={true}
                                        variant="dark"
                                        onChange={(e) => this.onChangeState(e)}
                                        // disabled
                                        value={this.state.stateName}
                                      />
                                    </Col>
                                  </Row>
                                </Box>
                                <Box mb={3}>
                                  <Row>
                                    <Col xs="12">
                                      <Input
                                        disabled={this.state.hideButtons}
                                        type="text"
                                        isInstaHandle={true}
                                        style={{ display: "inline-block" }}
                                        placeholder="Instagram Handle"
                                        isRequired={true}
                                        variant="dark"
                                        width="90%"
                                        onChange={(e) =>
                                          this.onChangeInstagramLink(e)
                                        }
                                        value={this.state.instagramLink}
                                      />
                                    </Col>
                                    {/* <Col xs="12" style={{ textAlign: "right" }}>
                                      {!this.state.instagramVerified ? (
                                        <Text
                                          variant="small"
                                          onClick={(e) =>
                                            this.handleOpenInstagramVerificationModal()
                                          }
                                        >
                                          Verify Instagram
                                        </Text>
                                      ) : (
                                        <Text variant="small">
                                          Verified Successfully
                                        </Text>
                                      )}
                                    </Col> */}
                                  </Row>
                                </Box>
                                <Box mb={3}>
                                  <Row>
                                    <Col xs="12">
                                      <Input
                                        type="text"
                                        placeholder="Facebook Link"
                                        variant="dark"
                                        onChange={(e) =>
                                          this.onChangeFacebookLink(e)
                                        }
                                        value={this.state.facebookLink}
                                        disabled={this.state.hideButtons}
                                      />
                                    </Col>
                                  </Row>
                                </Box>
                              </AccordionItemPanel>
                            </AccordionItem>
                          </Accordion>
                          <Box mt={1}>
                            <Row>
                              <Col xs="12">
                                {this.state.formMessage &&
                                  this.state.formMessage !== "" ? (
                                  <div style={{ minHeight: "22px" }}>
                                    <Text variant="error" color="#FFFFFF">
                                      {this.state.formMessage}
                                    </Text>
                                  </div>
                                ) : (
                                  <div style={{ minHeight: "28px" }}></div>
                                )}
                              </Col>
                            </Row>
                            {this.state.final_status &&
                              this.state.final_status === "pending" ? (
                              <Row className="text-center">
                                <Col xs="12">
                                  <Text>
                                    Your profile is currently under review.
                                  </Text>
                                </Col>
                              </Row>
                            ) : !this.state.hideButtons ? (
                              <Row>
                                <Col xs="6">
                                  <Button
                                    width="100%"
                                    variant="custom"
                                    borderRadius={10}
                                    onClick={(e) =>
                                      this.updateProfile(
                                        e,
                                        upsertProfileMutation,
                                        "draft"
                                      )
                                    }
                                  >
                                    Save Draft
                                  </Button>
                                </Col>
                                <Col xs="6" style={{ textAlign: "right" }}>
                                  <Button
                                    width="100%"
                                    variant="custom"
                                    borderRadius={10}
                                    onClick={(e) =>
                                      this.previewProfile(
                                        e,
                                        upsertProfileMutation
                                      )
                                    }
                                  >
                                    Preview
                                  </Button>
                                </Col>
                              </Row>
                            ) : (
                              <Row className="text-center">
                                <Col xs="12">
                                  <Text>
                                    <strong>Changes are being saved </strong>
                                    <img src={loaderGif} width="40px" />
                                  </Text>
                                </Col>
                              </Row>
                            )}
                            { }

                            {/* <Row className="mt-3">
                            <Col xs="12">
                              <Text variant="small" color="#000000" width="90%">
                                <input
                                  type="checkbox"
                                  value="accepted"
                                  onChange={(e) => this.onChangeAccepted(e)}
                                />
                                {"  "}I have read and accept the application
                                process and terms and conditions.
                              </Text>
                            </Col>
                          </Row> */}
                            {/* <Row className="mt-4">
                            <Col xs="12" className="text-center">
                              <Button
                                width="100%"
                                type="submit"
                                variant="custom"
                                borderRadius={10}
                                onClick={(e) =>
                                  this.updateProfile(
                                    e,
                                    upsertProfileMutation,
                                    "final"
                                  )
                                }
                              >
                                SUBMIT
                              </Button>
                            </Col>
                          </Row> */}
                          </Box>
                        </Container>
                      </>
                    )
                  ) : (
                    <Container style={{ minHeight: "70vh" }}>
                      <Text variant="bold">
                        Please login to continue
                        <br />
                        <br />
                      </Text>
                      <Link href="/login">
                        <a>
                          <Button
                            width="100%"
                            type="submit"
                            variant="custom"
                            borderRadius={10}
                          >
                            Login
                          </Button>
                        </a>
                      </Link>
                    </Container>
                  )}
                </Box>
              </Section>
            )}
          </Mutation>
        )}
      </ApolloConsumer>
    );
  }
}

export default ProfileForm;
