import { useState } from "react";
import { getSession, signOut } from "next-auth/react";
import Head from "next/head";
import axiosInstance from "../../services/axios";
import { api_origin } from "../../constraint";
import Sidebar from "../../components/Sidebar";
import {
  Text,
  VStack,
  Box,
  Flex,
  HStack,
  Image,
  Button,
  Input,
} from "@chakra-ui/react";
import ProfileBox from "../../components/ProfileBox";

export default function Profile(props) {
  const [avatar, setAvatar] = useState({});
  const [user, setUser] = useState(props.user);
  const [imageSource, setImageSource] = useState(
    api_origin + props.user.profilePicture
  );
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const resendHandler = async () => {
    setIsLoading(!isLoading);
    const body = {
      email: props.user.email,
      userId: props.user._id,
    };
    await axiosInstance.post("/auth/verify", body);
    alert("Success sending email");
    setIsLoading(false);
  };

  const onSaveProfileUpdate = async () => {
    try {
      const session = await getSession();
      const { accessToken } = session.user;
      const config = {
        headers: { Authorization: `Bearer ${accessToken}` },
      };
      await axiosInstance.patch(`/users/`, user, config);
      alert("Success edit profile");
      const resGetUserProfile = await axiosInstance.get(
        "/users/profile",
        config
      );

      setUser(resGetUserProfile.data.data);
      setEditMode(false);
      window.location.reload();
    } catch (error) {
      console.log({ error });
      alert(error.response.data.message);
    }
  };

  const onFileChange = (event) => {
    setAvatar(event.target.files[0]);
    setImageSource(URL.createObjectURL(event.target.files[0]));
  };
  const onSaveButton = async () => {
    try {
      const session = await getSession();
      const { accessToken } = session.user;
      const body = new FormData();
      body.append("avatar", avatar);
      const config = {
        headers: { Authorization: `Bearer ${accessToken}` },
      };
      const res = await axiosInstance.patch("/users/avatar", body, config);
      alert(res.data.message);
    } catch (error) {
      console.log({ Error });
      alert(error.response.data.message);
    }
  };

  const onHandleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  return (
    <VStack>
      <Box backgroundColor={"gray.100"} mt="2" rounded="12">
        {!props.user.isVerified && (
          <HStack paddingBlock="1" paddingInline="6">
            <Text>Click to resend a verification and check your email</Text>
            <Button
              isLoading={isLoading}
              backgroundColor={"yellow.300"}
              onClick={resendHandler}
            >
              Resend
            </Button>
          </HStack>
        )}
      </Box>
      <Flex
        height="100vh"
        width="full"
        maxWidth="100vw"
        ms="auto"
        me="auto"
        padding="0 10px"
      >
        <Head>
          <title>Profile</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Sidebar />

        <Flex flexGrow={"0.4"} w="70%" flexDirection="column" marginInline={2}>
          {!editMode ? (
            <Box
              rounded={5}
              boxShadow="md"
              marginBottom={2}
              padding="2"
              marginInlineStart={"25%"}
            >
              <Image
                src={imageSource}
                width={200}
                height={200}
                rounded="full"
              />
              {user.firstName && (
                <Text>{`${user.firstName} ${user.lastName}`}</Text>
              )}
              <Text>{`@${user.username}`}</Text>

              {user.bio && <Text marginBottom={5}>{user.bio}</Text>}
              <Text>Username : {user.username}</Text>
              <Text>Fullname : {`${user.firstName} ${user.lastName}`}</Text>
              <Text>Email : {user.email}</Text>
              <Button
                marginTop={4}
                onClick={() => setEditMode(true)}
                width="fit-content"
              >
                Edit Profile
              </Button>
            </Box>
          ) : (
            <Box
              rounded={5}
              boxShadow="md"
              marginBottom={2}
              padding="2"
              marginInlineStart={"25%"}
            >
              <Image
                src={imageSource}
                width={200}
                height={200}
                rounded="full"
              />
              <input type="file" onChange={onFileChange} />
              <Button onClick={onSaveButton}>Change profile image</Button>

              <HStack marginBlockEnd={3}>
                <Text>Bio : </Text>
                <Input
                  width="auto"
                  name="bio"
                  type="text"
                  value={user.bio}
                  variant="filled"
                  mb={3}
                  onChange={onHandleChange}
                />
              </HStack>
              <HStack marginBlockEnd={3}>
                <Text>Username : </Text>
                <Input
                  width="auto"
                  name="username"
                  type="text"
                  value={user.username}
                  variant="filled"
                  mb={3}
                  onChange={onHandleChange}
                />
              </HStack>
              <HStack marginBlockEnd={3}>
                <Text>Firstname : </Text>
                <Input
                  width="auto"
                  name="firstName"
                  type="text"
                  value={user.firstName}
                  variant="filled"
                  mb={3}
                  onChange={onHandleChange}
                />
              </HStack>
              <HStack marginBlockEnd={3}>
                <Text>Lastname : </Text>
                <Input
                  width="auto"
                  name="lastName"
                  type="text"
                  value={user.lastName}
                  variant="filled"
                  mb={3}
                  onChange={onHandleChange}
                />
              </HStack>
              <HStack marginBlockEnd={3}>
                <Text>Email : </Text>
                <Input
                  width="auto"
                  name="email"
                  type="text"
                  disabled
                  value={user.email}
                  variant="filled"
                  mb={3}
                  onChange={onHandleChange}
                />
              </HStack>

              <Button onClick={onSaveProfileUpdate}>Save</Button>
            </Box>
          )}
        </Flex>
        <ProfileBox user={user} />
      </Flex>
    </VStack>
  );
}

export async function getServerSideProps(context) {
  try {
    const session = await getSession({ req: context.req });
    // console.log(session.error);

    if (!session) return { redirect: { destination: "/login" } };

    const { accessToken } = session.user;

    const config = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };

    const res = await axiosInstance.get("/users/profile", config);

    return {
      props: { user: res.data.data, session },
    };
  } catch (error) {
    console.error(error.response?.data);

    return { props: {} };
  }
}
