import { Flex, Spacer, Text } from "@chakra-ui/react";
function SidebarOption({ active, text, Icon }) {
  return (
    <Flex
      flexGrow="0.3"
      alignItems="center"
      cursor="pointer"
      padding="12px"
      _hover={{
        background: "#e8f5fe",
        color: "var(--twitter-color)",
        borderRadius: "25px",
      }}
    >
      <Icon fontSize="30px" />
      <Text
        paddingLeft="20px"
        fontWeight="500"
        fontSize="20px"
        marginEnd="20px"
      >
        {text}
      </Text>
    </Flex>
  );
}

export default SidebarOption;
