import Image from "next/image";
import { useTheme } from "next-themes";
import { useState } from "react";
import Link from "next/link";

import images from "../assets";
import Button from "./Button";

const links = [
  "https://www.instagram.com/vishnuvardhan.chandragiri/",
  "https://twitter.com/Vishnu2562",
  "https://t.me/@Conqueror2562",
  "https://discord.gg/mYxsYFVP",
];

const FooterLinks = ({ heading, items, extraClasses }) => (
  <div className={`flex-1 justify-start items-start ${extraClasses}`}>
    <h3 className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl mb-10">
      {heading}
    </h3>
    {items.map((item, index) => (
      <Link
        href={item[1]}
        target="_blank"
        rel="noopener noreferrer"
        key={index}
      >
        <p
          key={item[0] + index}
          className="font-poppins dark:text-white text-nft-black-1 font-normal text-base cursor-pointer dark:hover:text-nft-gray-1 hover:text-nft-black-1 my-3"
        >
          {item[0]}
        </p>
      </Link>
    ))}
  </div>
);

const Footer = () => {
  const { theme } = useTheme();
  const [name, setName] = useState("");

  const handleEmailClick = () => {
    const mailtoLink = `mailto:chandragirivishnuvardhan@gmail.com?subject=Email from ${name}`;
    window.open(mailtoLink, "_blank");
  };

  const handleInputChange = (e) => {
    setName(e.target.value);
  };

  return (
    <footer className="flexCenter flex-col border-t dark:border-nft-black-1 border-nft-gray-1 sm:py-8 py-16">
      <div className="w-full minmd:w-4/5 flex flex-row md:flex-col sm:px-4 px-16">
        <div className="flexStart flex-1 flex-col">
          <div className="flexCenter cursor-pointer">
            <Image
              src={images.logo02}
              objectFit="contain"
              width={32}
              height={32}
              alt="logo"
            />
            <p className=" dark:text-white text-nft-dark font-semibold text-lg ml-1">
              CryptoLens
            </p>
          </div>
          <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-base mt-6">
            Get the latest updates
          </p>
          <div className="flexBetween md:w-full minlg:w-557 w-357 mt-6 dark:bg-nft-black-2 bg-white border dark:border-nft-black-2 border-nft-gray-2 rounded-md">
            <input
              type="email"
              placeholder="Your Name"
              value={name}
              onChange={handleInputChange}
              className="h-full flex-1 w-full dark:bg-nft-black-2 bg-white px-4 rounded-md font-poppins dark:text-white text-nft-black-1 font-normal text-xs minlg:text-lg outline-none"
            />
            <div className="flex-initial">
              <Button
                btnName="Email me"
                btnType="primary"
                classStyles="rounded-md"
                name={name}
                handleMailClick={() => handleEmailClick(name)}
              />
            </div>
          </div>
        </div>

        <div className="flex-1 flexBetweenStart flex-wrap ml-10 md:ml-0 md:mt-8">
          <FooterLinks
            heading="CryptoLens"
            items={[
              ["Explore", "https://github.com/Vishnu2562000/CryptoLens"],
              [
                "How it Works",
                "https://github.com/Vishnu2562000/CryptoLens/blob/main/README.md",
              ],
              ["Contact Us", "https://vishnu-vardhan-chandragiri.netlify.app/"],
            ]}
          />
          <FooterLinks
            heading="Support"
            items={[
              ["Help Center", "https://github.com/Vishnu2562000/CryptoLens"],
              [
                "Terms of service",
                "https://github.com/Vishnu2562000/CryptoLens/blob/main/LICENSE",
              ],
              [
                "Legal",
                "https://github.com/Vishnu2562000/CryptoLens/blob/main/LICENSE",
              ],
              [
                "Privacy policy",
                "https://github.com/Vishnu2562000/CryptoLens/blob/main/LICENSE",
              ],
            ]}
            extraClasses="ml-4"
          />
        </div>
      </div>

      <div className="flexCenter w-full mt-5 border-t dark:border-nft-black-1 border-nft-gray-1 sm:px-4 px-16">
        <div className="flexBetween flex-row w-full minmd:w-4/5 sm:flex-col mt-7">
          <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-base">
            CryptoLens, Inc. All Rights Reserved
          </p>
          <div className="flex flex-row sm:mt-4">
            {[
              images.instagram,
              images.twitter,
              images.telegram,
              images.discord,
            ].map((image, index) => (
              <Link
                href={links[index]}
                target="_blank"
                relative="noreferrer noopener"
                key={index}
              >
                <div className="mx-2 cursor-pointer" key={`image ${index}`}>
                  <Image
                    src={image}
                    key={index}
                    objectFit="contain"
                    width={24}
                    height={24}
                    alt="social"
                    className={theme === "light" ? "filter invert" : undefined}
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
