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
  Input,
  Textarea,
} from "@chakra-ui/react";
import axiosInstance from "../../services/axios";
// import { getSession } from "next-auth/react";
import { api_origin } from "../../constraint";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import moment from "moment";

export default function Post(props) {
  const [likes, setLikes] = useState(props.post.likes.length);
  const [isLiked, setIsLiked] = useState(
    props.post.likes.includes(props.user._id)
  );
  const [editMode, setEditMode] = useState(false);
  const [post, setPost] = useState(props.post);

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
      await axiosInstance.put(`/posts/${post._id}`, {
        userId: props.user._id,
      });
    } catch (error) {}
    setLikes(isLiked ? likes - 1 : likes + 1);
    setIsLiked(!isLiked);
  };

  const onChangeHandler = (e) => {
    setPost({ ...post, [e.target.name]: e.target.value });
  };
  return (
    <>
      {!editMode ? (
        <Box
          rounded={5}
          boxShadow="md"
          marginBottom={2}
          padding="2"
          marginInlineStart={"25%"}
        >
          <Flex>
            <Image
              src={api_origin + post.postedBy.profilePicture}
              height="45px"
              width="45px"
              rounded={"full"}
              marginBottom={2}
            ></Image>
            <Text marginStart={3} marginTop={2} fontSize="xl">
              @{post.postedBy.username}
            </Text>
            <Text marginStart={3} marginTop={3}>
              {moment(post.createdAt).fromNow()}
            </Text>
            {post.postedBy._id === props.user._id && (
              <>
                <Spacer />
                <Button onClick={() => setEditMode(!editMode)}>Edit</Button>
              </>
            )}
          </Flex>
          <Text marginStart={12} marginBottom={2}>
            {post.desc}
          </Text>
          {post.postImage && (
            <Image
              marginStart={12}
              rounded="10"
              src={api_origin + post.postImage}
              maxHeight="400px"
              width="90%"
            ></Image>
          )}
          <Flex flexDirection={"row"}>
            {isLiked ? (
              <IconButton
                // isDisabled={true}
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
                // isDisabled={true}
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
      ) : (
        <Box
          rounded={5}
          boxShadow="md"
          marginBottom={2}
          padding="2"
          marginInlineStart={"25%"}
        >
          <Flex>
            <Image
              src={api_origin + post.postedBy.profilePicture}
              height="45px"
              width="45px"
              rounded={"full"}
              marginBottom={2}
            ></Image>
            <Text marginStart={3} marginTop={2} fontSize="xl">
              @{post.postedBy.username}
            </Text>
            {post.postedBy._id === props.user._id && (
              <>
                <Spacer />
                <Button onClick={() => setEditMode(!editMode)}>Edit</Button>
              </>
            )}
          </Flex>
          <Textarea
            marginStart={12}
            marginBottom={2}
            name="desc"
            variant="unstyled"
            value={post.desc}
            onChange={onChangeHandler}
          />
          {post.postImage && (
            <Image
              marginStart={12}
              rounded="10"
              src={api_origin + post.postImage}
              maxHeight="400px"
              width="90%"
            ></Image>
          )}
          <Flex flexDirection={"row"} justifyContent="space-between">
            <Flex marginTop="2">
              {isLiked ? (
                <IconButton
                  // isDisabled={true}
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
                  // isDisabled={true}
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

            <Button marginTop="2" marginRight={8}>
              Save
            </Button>
          </Flex>
        </Box>
      )}
    </>
  );
}
