import React from 'react';
import "../Stylesheets/Global.css"
import {
  FacebookShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailShareButton,
  PinterestShareButton,
  LinkedinShareButton,
} from 'react-share';
import { Facebook, LinkedIn, Mail, Pinterest, Telegram, WhatsApp } from '../assets'; // Import your image icons

const ShareModal = ({ isOpen, onClose, shareUrl, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black blurred-background bg-opacity-50 z-50">
      <div className="bg-white w-[30rem] p-8 rounded-lg">
      <button onClick={onClose} className=" px-4 float-right rounded-md">
         &times;
        </button>
        <h2 className="text-xl font-bold mb-4 pt-4 textFlex">{title} <p className='textFlexed p-1 mt-4 text-xs text-blue-700 bg-gray-200'>Share Url - {shareUrl}</p></h2>
       
        <div className="flex justify-around p-4 ">
          <FacebookShareButton url={shareUrl}>
            <img src={Facebook} alt="Facebook" className="social-icon w-12 h-12" />
          </FacebookShareButton>
          <LinkedinShareButton url={shareUrl}>
            <img src={LinkedIn} alt="LinkedIn" className="social-icon w-12 h-12" />
          </LinkedinShareButton>
          <WhatsappShareButton url={shareUrl}>
            <img src={WhatsApp} alt="WhatsApp" className="social-icon w-12 h-12" />
          </WhatsappShareButton>
          <TelegramShareButton url={shareUrl}>
            <img src={Telegram} alt="Telegram" className="social-icon w-12 h-12" />
          </TelegramShareButton>
          <EmailShareButton url={shareUrl}>
            <img src={Mail} alt="Email" className="social-icon w-12 h-12" />
          </EmailShareButton>
          <PinterestShareButton url={shareUrl}>
            <img src={Pinterest} alt="Pinterest" className="social-icon w-12 h-12" />
          </PinterestShareButton>
        </div>

     
      </div>
    </div>
  );
};

export default ShareModal;
