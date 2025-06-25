'use client'
import React from 'react';

import { FaGithub } from "react-icons/fa";
import { FaEnvelope } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Image from 'next/image';
const Footer = () => {
  return (
    <div className='flex items-center backdrop-blur-sm justify-center gap-8  py-2 w-full sticky bottom-0'>
      {/* Created by */}
      <div className='flex items-center gap-2'>
        <Image src="/image/jelly.PNG" alt="logo" width={100} height={100} className='rounded-full md:w-10 md:h-10 w-8 h-8' />
        <p className='text-sm md:text-base'>Created by: <span className='text-[#FCD535] font-bold'>Jelly</span></p>
      </div>
      {/* twitter */}
      <div>
        <a href="https://x.com/meiyouguodonge1" target="_blank" rel="noopener noreferrer">
          <FaXTwitter className='text-[#f3f4f6] md:text-2xl text-xl' />
        </a>
      </div>
      {/* github */}
      <div>
        <a href="https://github.com/jelly0127" target="_blank" rel="noopener noreferrer">
          <FaGithub className='text-[#f3f4f6] md:text-2xl text-xl' />
        </a>
      </div>
      {/* email */}
      <div>
        <a href="mailto:jelly806352173@gmail.com" target="_blank" rel="noopener noreferrer">
          <FaEnvelope className='text-[#f3f4f6] md:text-2xl text-xl' />
        </a>
      </div>
    </div>
  );
};

export default Footer;