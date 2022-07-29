import { Box, Text, Textarea, Button, Flex } from "@chakra-ui/react";
import { getSession } from "next-auth/react";
import { useState } from "react";
import axiosInstance from "../../services/axios";

export default function CommentBox(props) {
  const [commentInput, setCommentInput] = useState("");
  const onInputHandler = (event) => {
    setCommentInput(event.target.value);
  };
  const onCommentHandler = async () => {
    const session = await getSession();
    const { accessToken } = session.user;
    const config = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };
    const body = {
      text: commentInput,
      postId: props.postId,
    };
    try {
      const comment = await axiosInstance.post("/comments/", body, config);
      props.getComments();
      setCommentInput("");
    } catch (error) {}
  };
  return (
    <>
      <Textarea
        maxLength={300}
        value={commentInput}
        placeholder="Add a comment"
        resize="none"
        size={"sm"}
        onChange={onInputHandler}
      />
      <Flex flexDirection="row-reverse" mt="2">
        <Button variant="ghost" onClick={onCommentHandler}>
          Comment
        </Button>
      </Flex>
    </>
  );
}
