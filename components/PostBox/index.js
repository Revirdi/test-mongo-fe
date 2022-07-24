import { Box, Image, Flex, Textarea, Icon, Button } from "@chakra-ui/react";
import { useState } from "react";
import { api_origin } from "../../constraint";
import { BsCardImage } from "react-icons/bs";
import { CloseIcon } from "@chakra-ui/icons";
import axiosInstance from "../../services/axios";
import { getSession } from "next-auth/react";

export default function PostBox(props) {
  const [user, setUser] = useState(props.user);
  const [desc, setDesc] = useState("");
  const [postImage, setPostImage] = useState(null);

  const postHandler = async () => {
    const session = await getSession();
    const { accessToken } = session.user;
    const config = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };
    const newPost = {
      desc,
    };
    if (postImage) {
      const data = new FormData();
      const fileName = Date.now() + postImage.name;
      data.append("name", fileName);
      data.append("postImage", postImage);
      newPost.postImage = `/public/post/${fileName}`;
      try {
        await axiosInstance.post("/posts/upload", data, config);
      } catch (error) {}
    }
    try {
      await axiosInstance.post("/posts", newPost, config);
      window.location.reload();
    } catch (error) {}
  };

  return (
    <Box
      rounded={5}
      boxShadow="md"
      marginBottom={2}
      padding="2"
      marginInlineStart={"25%"}
    >
      <Flex flexWrap="wrap">
        <Image
          src={api_origin + user.profilePicture}
          width="40px"
          height="40px"
          rounded="full"
        />
        <Textarea
          variant="unstyled"
          width="90%"
          marginStart={4}
          resize="none"
          height="fit-content"
          placeholder="What's happening?"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        {postImage && (
          <Flex flexDirection="column">
            <CloseIcon onClick={() => setPostImage(null)} />
            <Image src={URL.createObjectURL(postImage)} />
          </Flex>
        )}
      </Flex>
      <Flex justifyContent="space-between" marginTop={2}>
        <label
          htmlFor="postImage"
          style={{
            alignItems: "center",
            cursor: "pointer",
            marginLeft: "60px",
            marginTop: "5px",
          }}
        >
          <Icon as={BsCardImage} color="green.200" fontSize={"20px"} />
          <input
            style={{ display: "none" }}
            type="file"
            id="postImage"
            onChange={(e) => setPostImage(e.target.files[0])}
          />
        </label>
        <Button
          variant="solid"
          colorScheme="twitter"
          rounded="lg"
          onClick={postHandler}
        >
          Cuit
        </Button>
      </Flex>
    </Box>
  );
}
