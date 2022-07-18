import { useState, useEffect } from "react";
import {
  Box,
  Text,
  Button,
  Image,
  Flex,
  IconButton,
  Icon,
} from "@chakra-ui/react";
import axiosInstance from "../../services/axios";
import { getSession } from "next-auth/react";
import { api_origin } from "../../constraint";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import axios from "axios";
useState;

export default function Post(props) {
  const [likes, setLikes] = useState(props.post.likes.length);
  const [isLiked, setIsLiked] = useState(
    props.post.likes.includes(props.user._id)
  );
  const [user, setUser] = useState("");

  // console.log(props.post.likes.includes(props.user._id));
  // useEffect(() => {
  //   setIsLiked(props.post.likes.includes(props.user.userId));
  // }, [(props.user.userId, props.post.likes)]);

  useEffect(() => {
    const fetchUser = async () => {
      const session = await getSession();
      const { accessToken } = session.user;

      const config = {
        headers: { Authorization: `Bearer ${accessToken}` },
      };
      const res = await axiosInstance.get(`/users/profile`, config);
      setUser(res.data.data);
    };
    fetchUser();
  }, [props.user._id]);

  const onLikeHandler = async () => {
    try {
      await axiosInstance.put(`/posts/${props.post._id}`, {
        userId: user._id,
      });
    } catch (error) {}
    setLikes(isLiked ? likes - 1 : likes + 1);
    setIsLiked(!isLiked);
  };
  return (
    <Box
      rounded={5}
      boxShadow="md"
      marginBottom={2}
      padding="2"
      marginInlineStart={"52"}
    >
      <Flex>
        <Image
          src={api_origin + props.post.postedBy.profilePicture}
          height="45px"
          rounded={"full"}
        ></Image>
        <Text marginStart={4} marginTop={2}>
          {props.post.postedBy.username}
        </Text>
      </Flex>
      {props.post.postImage && (
        <Image
          src={api_origin + props.post.postImage}
          maxH="500px"
          minWidth={"100%"}
        ></Image>
      )}
      <Text>{props.post.desc}</Text>
      <Flex flexDirection={"row"}>
        {isLiked ? (
          <IconButton
            variant={"unstyled"}
            color="red.400"
            icon={<Icon as={BsHeartFill} onClick={onLikeHandler} />}
          ></IconButton>
        ) : (
          <IconButton
            variant={"unstyled"}
            icon={<Icon as={BsHeart} onClick={onLikeHandler} />}
          ></IconButton>
        )}
        <Text marginTop={1.5}>{likes}</Text>
      </Flex>

      {/* <Button margin={2} onClick={onLikeHandler}>
        Like
      </Button> */}
    </Box>
  );
}
