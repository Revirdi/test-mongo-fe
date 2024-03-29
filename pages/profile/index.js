import { useState } from "react";
import { getSession } from "next-auth/react";
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
  Table,
  Tbody,
  Tr,
  Td,
  TableContainer,
  Spacer,
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
  const [isDisabled, setIsDisabled] = useState(props.user.isVerified);

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
      const { accessToken, userId } = session.user;
      const config = {
        headers: { Authorization: `Bearer ${accessToken}` },
      };
      await axiosInstance.patch(`/users/`, user, config);

      const resGetUserProfile = await axiosInstance.get(
        `/users/profile/${userId}`,
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
      setUser(res.data.result);
      alert(res.data.message);
    } catch (error) {
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
          <meta name="profile" content="Cuiters profile" />
          <link rel="icon" href="/twitter.ico" />
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
                objectFit={"cover"}
                rounded="full"
                marginBottom={2}
              />
              {user.firstName && (
                <Text
                  fontSize={"md"}
                  fontFamily="cursive"
                >{`${user.firstName} ${user.lastName}`}</Text>
              )}
              <Text fontSize={"md"}>{`@${user.username}`}</Text>

              {user.bio && (
                <Text
                  marginBottom={5}
                  fontStyle="italic"
                  fontWeight={"light"}
                  fontSize="lg"
                >
                  {user.bio}
                </Text>
              )}
              <TableContainer>
                <Table variant="striped">
                  <Tbody>
                    <Tr>
                      <Td>Username</Td>
                      <Td>{user.username}</Td>
                    </Tr>
                    <Tr>
                      <Td>Fullname</Td>
                      <Td>{`${user.firstName} ${user.lastName}`}</Td>
                    </Tr>
                    <Tr>
                      <Td>Email</Td>
                      <Td>{user.email}</Td>
                    </Tr>
                  </Tbody>
                </Table>
              </TableContainer>
              <Flex flexDirection="row-reverse">
                <Button
                  isDisabled={!isDisabled}
                  marginTop={4}
                  colorScheme="linkedin"
                  onClick={() => setEditMode(true)}
                  width="fit-content"
                >
                  Edit Profile
                </Button>
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
              <Image
                src={imageSource}
                width={200}
                objectFit={"cover"}
                height={200}
                rounded="full"
                marginBottom={2}
              />
              <input type="file" value={""} onChange={onFileChange} />
              <Button onClick={onSaveButton}>Change Profile Picture</Button>
              <TableContainer marginBlock={5}>
                <Table variant="unstyled">
                  <Tbody>
                    <Tr>
                      <Td>Bio</Td>
                      <Td>
                        <Input
                          width="full"
                          name="bio"
                          type="text"
                          value={user.bio}
                          variant="filled"
                          onChange={onHandleChange}
                        />
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>Username</Td>
                      <Td>
                        <Input
                          width="full"
                          name="username"
                          type="text"
                          value={user.username}
                          variant="filled"
                          onChange={onHandleChange}
                        />
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>Firstname</Td>
                      <Td>
                        <Input
                          width="full"
                          name="firstName"
                          type="text"
                          value={user.firstName}
                          variant="filled"
                          onChange={onHandleChange}
                        />
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>Lastname</Td>
                      <Td>
                        <Input
                          width="full"
                          name="lastName"
                          type="text"
                          value={user.lastName}
                          variant="filled"
                          onChange={onHandleChange}
                        />
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>Email</Td>
                      <Td>
                        <Input
                          width="full"
                          name="email"
                          type="text"
                          disabled
                          value={user.email}
                          variant="filled"
                          onChange={onHandleChange}
                        />
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
              </TableContainer>
              <Flex flexDirection="row-reverse">
                <Button
                  colorScheme="linkedin"
                  marginLeft={5}
                  onClick={onSaveProfileUpdate}
                >
                  Save
                </Button>
                <Button colorScheme="red" onClick={() => setEditMode(false)}>
                  Cancel
                </Button>
              </Flex>
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

    if (!session) return { redirect: { destination: "/login" } };

    const { userId } = session.user;

    const res = await axiosInstance.get("/users/profile/" + userId);

    return {
      props: { user: res.data.data, session },
    };
  } catch (error) {
    console.error(error.response.data);
    console.log({ error });
    const { message } = error;

    return { props: { message } };
  }
}
