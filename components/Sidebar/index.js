import { Icon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";
import {
  BsTwitter,
  BsFillHouseDoorFill,
  BsHash,
  BsBookmark,
  BsList,
  BsFileEarmarkPerson,
  BsHeartFill,
  BsEmojiSmile,
} from "react-icons/bs";
import { IoIosNotificationsOutline } from "react-icons/io";
import { IoMailOutline } from "react-icons/io5";
import SidebarOption from "./SidebarOption";
import { Box, Link } from "@chakra-ui/react";
import NextLink from "next/link";
function Sidebar() {
  return (
    <Box
      minW="250px"
      mt="10px"
      paddingStart="20px"
      paddingEnd="20px"
      position={"fixed"}
      overflow="hidden"
      left={6}
      top={2}
    >
      <Icon
        as={BsTwitter}
        fontSize="30px"
        marginStart="10px"
        marginBottom="20px"
        color="var(--twitter-color)"
      />

      <NextLink href="/home" passHref>
        <Link style={{ textDecoration: "none" }}>
          <SidebarOption Icon={BsFillHouseDoorFill} text="Home" />
        </Link>
      </NextLink>
      <NextLink href="/profile" passHref>
        <Link style={{ textDecoration: "none" }}>
          <SidebarOption Icon={BsFileEarmarkPerson} text="Profile" />
        </Link>
      </NextLink>
      <NextLink href="/post/likedPost" passHref>
        <Link style={{ textDecoration: "none" }}>
          <SidebarOption Icon={BsHeartFill} text="Liked Post" />
        </Link>
      </NextLink>
      <NextLink href="/post/myPost" passHref>
        <Link style={{ textDecoration: "none" }}>
          <SidebarOption Icon={BsEmojiSmile} text="My Post" />
        </Link>
      </NextLink>

      <Button
        colorScheme="twitter"
        height="50px"
        w="100%"
        mt="20px"
        borderRadius="30px"
        fontWeight="700"
      >
        Cuiter
      </Button>
    </Box>
  );
}

export default Sidebar;
