import { Icon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";
import {
  BsTwitter,
  BsFillHouseDoorFill,
  BsHash,
  BsBookmark,
  BsList,
} from "react-icons/bs";
import { IoIosNotificationsOutline } from "react-icons/io";
import { IoMailOutline } from "react-icons/io5";
import SidebarOption from "./SidebarOption";
import { Flex } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
function Sidebar() {
  return (
    <Box
      minW="250px"
      mt="10px"
      paddingStart="20px"
      paddingEnd="20px"
      borderRight="1px solid var(--twitter-background)"
    >
      {/* Twitter Icon */}
      <Icon
        as={BsTwitter}
        fontSize="30px"
        marginStart="10px"
        marginBottom="20px"
        color="var(--twitter-color)"
      />

      {/* Sidebar Option */}
      <SidebarOption Icon={BsFillHouseDoorFill} text="Home" />
      <SidebarOption Icon={BsHash} text="Explore" />
      <SidebarOption Icon={IoIosNotificationsOutline} text="Notification" />
      <SidebarOption Icon={IoMailOutline} text="Messages" />
      <SidebarOption Icon={BsBookmark} text="Bookmarks" />
      <SidebarOption Icon={BsList} text="List" />
      <SidebarOption Icon={BsFillHouseDoorFill} text="Profile" />
      <SidebarOption Icon={BsFillHouseDoorFill} text="More" />

      {/* Button -> Tweet */}
      <Button
        colorScheme="twitter"
        height="50px"
        w="100%"
        mt="20px"
        borderRadius="30px"
        fontWeight="700"
      >
        Twitter
      </Button>
    </Box>
  );
}

export default Sidebar;
