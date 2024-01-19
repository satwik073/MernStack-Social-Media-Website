
import { MdExplore, MdSpaceDashboard } from "react-icons/md";
import { TfiSearch } from "react-icons/tfi";
import { RiNotificationLine } from "react-icons/ri";
import { BiMessageSquareDots } from "react-icons/bi";
import { TfiWorld } from "react-icons/tfi";

export const getMenuLinksData = (userData) => {
  return [
    {
      id: 1,
      linkTitle: "Home",
      icon: <MdSpaceDashboard />,
    //   Onclick: `/profile/${userData.userId}`
      Onclick: ``
    },
    {
      id: 2,
      linkTitle: "Search",
      icon: <TfiSearch />,
      Onclick: ""
    },
    {
      id: 3,
      linkTitle: "Explore",
      icon: <TfiWorld />,
      Onclick: "/Explore"
    },
    {
      id: 4,
      linkTitle: "Notifications",
      icon: <RiNotificationLine />,
      Onclick: "/"
    },
    {
      id: 5,
      linkTitle: "Messages",
      icon: <BiMessageSquareDots />,
      Onclick: "/Messages"
    },
  ];
};

export const emojis = [
    '❤️', '😊', '🎉', '🔥', '🌟', '🎶', '🍕', '🌈', '😂', '😍',
    '👍', '🙌', '💯', '💕', '✨', '👏', '🔔', '🚀', '💡', '🤩',
    '💪', '😎', '🎈', '💃', '🕺', '🍔', '🍦', '🍹', '🌺', '🌼',
    '🍀', '🎨', '🎮', '🚗', '🛸', '🏖️', '🎭', '🎻', '🎸', '🚀',
    '🏆', '⚽', '🏀', '🏈', '⚾', '🎱', '🎾', '🏐', '🏓', '🏸',
    '🥇', '🥈', '🥉', '🎖️', '🏅', '🥋', '⛷️', '🏂', '🏋️‍♂️', '🏋️‍♀️',
    '🚴', '🚵', '🤸‍♂️', '🤸‍♀️', '⛹️‍♂️', '⛹️‍♀️', '🤺', '🤾‍♂️', '🤾‍♀️', '🏌️‍♂️',
    '🏌️‍♀️', '🏇', '🧘‍♂️', '🧘‍♀️', '🏄‍♂️', '🏄‍♀️', '🏊‍♂️', '🏊‍♀️', '🤽‍♂️', '🤽‍♀️',
    '🚣‍♂️', '🚣‍♀️', '🧗‍♂️', '🧗‍♀️', '🚵‍♂️', '🚵‍♀️', '🎣', '🧚‍♂️', '🧚‍♀️', '🧜‍♂️',
    '🧜‍♀️', '🧝‍♂️', '🧝‍♀️', '🧞‍♂️', '🧞‍♀️', '🧟‍♂️', '🧟‍♀️', '🦸‍♂️', '🦸‍♀️', '🦹‍♂️',
    '🦹‍♀️', '🤍', '🖤', '💔', '❣️', '💥', '💫', '💢', '💦', '💨',
    '🐵', '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🦝', '🐻', '🐼',
    
  ];