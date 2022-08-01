import { getSession } from "next-auth/react";
import { Flex, Button, Box, VStack } from "@chakra-ui/react";
import Head from "next/head";
import { useState } from "react";
import ProfileBox from "../../components/ProfileBox";
import Sidebar from "../../components/Sidebar";
import axiosInstance from "../../services/axios";
import Post from "../../components/Post";
import CommentBox from "../../components/CommentBox";
import Comment from "../../components/Comment";

export default function PostDetail(props) {
  const { post } = props;
  const { comment } = props;

  const [listComment, setListComment] = useState(comment);
  const [commentLength, setCommentLength] = useState(props.commentLength);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const renderComment = () => {
    return listComment.map((comment) => {
      return <Comment key={comment._id} comment={comment} />;
    });
  };
  const getComments = async () => {
    try {
      const session = await getSession();
      const { accessToken } = session.user;
      const config = {
        params: { page: 1, pageSize },
        headers: { Authorization: `Bearer ${accessToken}` },
      };
      const newComment = await axiosInstance.get(
        `/comments/${post._id}`,
        config
      );
      setListComment(newComment.data.data);
      setPage(1);
    } catch (error) {
      if (error.response.data) return alert(error.response.data.message);
      alert(error.message);
    }
  };
  const showMoreHandler = async () => {
    setPage(page + 1);
    try {
      const session = await getSession();
      const { accessToken } = session.user;
      const config = {
        params: { page: page + 1, pageSize },
        headers: { Authorization: `Bearer ${accessToken}` },
      };
      const newComment = await axiosInstance.get(
        `/comments/${post._id}`,
        config
      );
      setListComment([...listComment, ...newComment.data.data]);
    } catch (error) {
      if (error.response.data) return alert(error.response.data.message);
      alert(error.message);
    }
  };

  return (
    <VStack>
      <Flex
        height="100vh"
        width="full"
        maxWidth="100vw"
        ms="auto"
        me="auto"
        padding="0 10px"
      >
        <Head>
          <title>Cuiters</title>
          <meta name="Detail Post" content="Cuiters" />
          <link rel="icon" href="/twitter.ico" />
        </Head>

        <Sidebar />

        <Flex flexGrow={"0.4"} w="70%" flexDirection="column" marginInline={2}>
          <Post key={post._id} post={post} user={props.user}></Post>

          <Box
            rounded={5}
            boxShadow="md"
            marginBottom={2}
            padding="2"
            marginInlineStart={"25%"}
          >
            <CommentBox
              key={comment._id}
              postId={post._id}
              getComments={getComments}
            />
            {renderComment()}

            <Flex flexDirection="row-reverse" mt="2">
              {listComment.length < commentLength && (
                <Button variant="link" onClick={showMoreHandler}>
                  Show More Comment
                </Button>
              )}
            </Flex>
          </Box>
        </Flex>
        <ProfileBox user={props.user} />
      </Flex>
    </VStack>
  );
}

export async function getServerSideProps(context) {
  try {
    const session = await getSession({ req: context.req });

    if (!session) return { redirect: { destination: "/login" } };

    const { accessToken, userId } = session.user;
    const page = 1;
    const pageSize = 5;

    const config = {
      params: { page, pageSize },
      headers: { Authorization: `Bearer ${accessToken}` },
    };

    const { postId } = context.params;

    const comment = await axiosInstance.get(`/comments/${postId}`, config);
    const res = await axiosInstance.get("/users/profile/" + userId);
    const post = await axiosInstance.get(`/posts/${postId}`, config);
    if (!post.data.data[0]) return { redirect: { destination: "/home" } };
    return {
      props: {
        post: post.data.data[0],
        user: res.data.data,
        comment: comment.data.data,
        commentLength: comment.data.length,
      },
    };
  } catch (error) {
    console.error(error.response.data);
    const { message } = error;

    return { props: { message } };
  }
}
