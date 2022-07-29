import { Flex, Text, Image } from "@chakra-ui/react";
import moment from "moment";
import { useState } from "react";
import { api_origin } from "../../constraint";

export default function Comment(props) {
  const { comment } = props;

  return (
    <Flex
      direction={"column"}
      mt="5px"
      borderBlockEnd="1px"
      borderColor="blue.200"
    >
      <Flex direction={"row"}>
        <Image
          src={api_origin + comment.postedBy.profilePicture}
          height="30px"
          width="30px"
          rounded={"full"}
          marginBottom={2}
        />
        <Text marginStart={2}>@{comment.postedBy.username}</Text>
        <Text marginStart={3}>{moment(comment.createdAt).fromNow()}</Text>
      </Flex>
      <Text paddingBlockEnd={"3"}>{comment.text}</Text>
    </Flex>
  );
}
