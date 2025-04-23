import React from "react";
import styled from "styled-components";
import { color, space, typography, shadow } from "styled-system";

const Paragraph = styled.p`
  margin-bottom: 0;
  font-size: 16px;
  font-weight: 300;
  line-height: 22px;
  color: #000000;
  opacity: 0.8;
  ${space};
  ${typography};
  ${shadow};
`;

const CardTitle = styled.p`
  margin-bottom: 0;
  font-size: 22px;
  font-weight: 600;
  line-height: 22px;
  ${color};
  opacity: 0.8;
  ${space};
  ${typography};
  ${shadow};
`;

const ParagraphBold = styled.p`
  margin-bottom: 0;
  font-size: 16px;
  font-weight: 600;
  line-height: 22px;
  ${color};
  opacity: 0.8;
  ${space};
  ${typography};
  ${shadow};
`;

const ParagraphSmall = styled(Paragraph)`
  font-size: 14px;
  letter-spacing: -0.5px;
  line-height: 24px;
  ${color};
  ${space};
  ${typography};
  ${shadow};
`;

const ParagraphLandingSmall = styled(Paragraph)`
  font-size: 14px;
  letter-spacing: -0.5px;
  line-height: 18px;
  font-weight: 600;
  ${color};
  ${space};
  ${typography};
  ${shadow};
`;

const ErrorText = styled(Paragraph)`
  font-size: 12px;
  letter-spacing: -0.5px;
  line-height: 20px;
  color: red;
`;

const ParagraphVerySmall = styled(Paragraph)`
  font-size: 12px;
  letter-spacing: -0.5px;
  line-height: 14px;
  font-weight: 300;
  ${color};
  ${space};
  ${typography};
  ${shadow};
`;

const CustomTitle = styled.p`
  margin-bottom: 0;
  font-size: 22px;
  letter-spacing: 0px;
  line-height: 22px;
  color: #000000;
`;

const CustomTitlePlain = styled.p`
  margin-bottom: 0;
  font-size: 42px;
  letter-spacing: -2px;
  line-height: 40px;
  color: #000000;
  font-family: Arimo !important;
  font-weight: 600;
`;

const ContestantName = styled.p`
  margin-bottom: 0;
  font-size: 22px;
  letter-spacing: 0px;
  line-height: 17px;
  color: #000000;
`;

const MoreLink = styled.p`
  margin-bottom: 0;
  font-size: 15px;
  font-weight: 600;
  line-height: 15px;
  color: #000000;
  float: right;
  border-bottom: 2px solid red;
`;

const Text = ({ variant, ...props }) => {
  let TextRender;

  switch (variant) {
    case "small":
      TextRender = ParagraphSmall;
      break;
    case "very-small":
      TextRender = ParagraphVerySmall;
      break;
    case "custom-title":
      TextRender = CustomTitle;
      break;

    case "custom-title-plain":
      TextRender = CustomTitlePlain;
      break;
    case "more-link":
      TextRender = MoreLink;
      break;
    case "bold":
      TextRender = ParagraphBold;
      break;
    case "contestant-name":
      TextRender = ContestantName;
      break;
    case "card-title":
      TextRender = CardTitle;
      break;
    case "error":
      TextRender = ErrorText;
      break;
    case "landing-small":
      TextRender = ParagraphLandingSmall;
      break;
    default:
      TextRender = Paragraph;

      break;
  }

  return <TextRender color="text" {...props} />;
};

export default Text;
