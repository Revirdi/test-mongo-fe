import { useState, useEffect } from "react";
import { Box, Text, Button } from "@chakra-ui/react";
import axiosInstance from "../../services/axios";
import { getSession } from "next-auth/react";
import axios from "axios";
useState;

export default function Post(props) {
  const [likes, setLikes] = useState(props.post.likes.length);
  const [isLiked, setIsLiked] = useState(
    props.post.likes.includes(props.user._id)
  );
  const [user, setUser] = useState("");
  console.log(props.post.likes.includes(props.user._id));

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
  }, [props.user.userId]);

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
    <Box bgColor={"red.300"} marginBottom={2} width="500px">
      <Text>{props.post.postedBy.username}</Text>
      <Text>{props.post.desc}</Text>
      <Text>{likes}</Text>
      <Text>{props.post.comments.length}</Text>
      <Button margin={2} onClick={onLikeHandler}>
        Like
      </Button>
    </Box>
  );
}
