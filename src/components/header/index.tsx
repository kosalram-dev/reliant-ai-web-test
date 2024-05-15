import Image from "next/image";
import React, { FunctionComponent } from "react";

import Logo from "@/assets/logo.png";

const Header: FunctionComponent = () => {
  return (
    <header className="flex h-16 w-full flex-row items-center px-4 bg-white reliant-shadow">
      <Image
        src={Logo}
        quality={90}
        priority
        width={100}
        height={100}
        alt="logo"
      />
    </header>
  );
};

export default Header;
