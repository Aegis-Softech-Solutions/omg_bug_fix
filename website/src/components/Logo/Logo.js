import React from "react";
import Link from "next/link";

import imgL1Logo from "../../assets/image/logo/black-logo-lg.png";
import imgL1LogoWhite from "../../assets/image/logo/white-logo-sm.png";

const Logo = ({ white, height, className = "", ...rest }) => {
  return (
    <Link href="/home" prefetch={false}>
      <a className={`${className}`} {...rest}>
        {white ? (
          <img src={imgL1LogoWhite} alt="" className="header-logo white" />
        ) : (
          <img src={imgL1Logo} alt="" className="header-logo black" />
        )}
      </a>
    </Link>
  );
};

export default Logo;
