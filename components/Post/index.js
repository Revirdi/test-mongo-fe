import { useState } from "react";
import {
  Box,
  Text,
  Image,
  Flex,
  IconButton,
  Icon,
  Spacer,
  Button,
} from "@chakra-ui/react";
import axiosInstance from "../../services/axios";
// import { getSession } from "next-auth/react";
import { api_origin } from "../../constraint";
import { BsHeart, BsHeartFill } from "react-icons/bs";

export default function Post(props) {
  const [likes, setLikes] = useState(props.post.likes.length);
  const [isLiked, setIsLiked] = useState(
    props.post.likes.includes(props.user._id)
  );

  // const [user, setUser] = useState("");

  // console.log(props.post.likes.includes(props.user._id));
  // useEffect(() => {
  //   setIsLiked(props.post.likes.includes(props.user.userId));
  // }, [(props.user.userId, props.post.likes)]);

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     const session = await getSession();
  //     const { accessToken } = session.user;

  //     const config = {
  //       headers: { Authorization: `Bearer ${accessToken}` },
  //     };
  //     const res = await axiosInstance.get(`/users/profile`, config);
  //     setUser(res.data.data);
  //   };
  //   fetchUser();
  // }, [props.user._id]);

  const onLikeHandler = async () => {
    try {
      await axiosInstance.put(`/posts/${props.post._id}`, {
        userId: props.user._id,
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
      marginInlineStart={"25%"}
    >
      <Flex>
        <Image
          src={api_origin + props.post.postedBy.profilePicture}
          height="45px"
          width="45px"
          rounded={"full"}
          marginBottom={2}
        ></Image>
        <Text marginStart={3} marginTop={2} fontSize="xl">
          @{props.post.postedBy.username}
        </Text>
        {props.post.postedBy._id === props.user._id && (
          <>
            <Spacer />
            <Button>Edit</Button>
          </>
        )}
      </Flex>
      <Text marginStart={12} marginBottom={2}>
        {props.post.desc}
      </Text>
      {props.post.postImage && (
        <Image
          marginStart={12}
          rounded="10"
          src={api_origin + props.post.postImage}
          maxHeight="400px"
          width="90%"
        ></Image>
      )}
      <Flex flexDirection={"row"}>
        {isLiked ? (
          <IconButton
            isDisabled={true}
            marginStart={10}
            padding="3"
            variant={"unstyled"}
            color="red.400"
            _hover={{
              background: "#e8f5fe",
              color: "red.400",
              rounded: "full",
            }}
            icon={<BsHeartFill />}
            onClick={onLikeHandler}
          ></IconButton>
        ) : (
          <IconButton
            isDisabled={true}
            marginStart={10}
            padding="3"
            variant={"unstyled"}
            _hover={{
              background: "#e8f5fe",
              color: "red.400",
              borderRadius: "25px",
            }}
            icon={<BsHeart />}
            onClick={onLikeHandler}
          ></IconButton>
        )}
        <Text marginTop={1.5}>{likes}</Text>
      </Flex>
    </Box>
  );
}
