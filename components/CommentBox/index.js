import { Textarea, Button, Flex, Text } from "@chakra-ui/react";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import axiosInstance from "../../services/axios";

export default function CommentBox(props) {
  const [commentInput, setCommentInput] = useState("");
  const [commentLength, setCommentLength] = useState(0);
  const [textColor, setTextColor] = useState("black");
  const [isInvalid, setIsInvalid] = useState(false);
  const onInputHandler = (event) => {
    setCommentInput(event.target.value);
  };
  useEffect(() => {
    setCommentLength(commentInput.length);
  }, [commentInput]);

  useEffect(() => {
    if (commentLength >= 300) {
      setIsInvalid(true);
      setTextColor("red");
    } else {
      setIsInvalid(false);
      setTextColor("black");
    }
  }, [commentLength]);

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
      await axiosInstance.post("/comments/", body, config);
      props.getComments();
      setCommentInput("");
      window.location.reload(false);
    } catch (error) {}
  };
  return (
    <>
      <Textarea
        maxLength={300}
        value={commentInput}
        isInvalid={isInvalid}
        placeholder="Add a comment"
        resize="none"
        size={"sm"}
        onChange={onInputHandler}
      />
      <Flex justifyContent="space-between" mt="2">
        <Text
          fontSize={"medium"}
          fontStyle="italic"
          fontWeight={"semibold"}
          color={textColor}
        >
          Max Characters {commentLength}/300
        </Text>
        <Button variant="ghost" onClick={onCommentHandler}>
          Comment
        </Button>
      </Flex>
    </>
  );
}
