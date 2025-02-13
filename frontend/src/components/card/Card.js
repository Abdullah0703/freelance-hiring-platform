import { Box, useStyleConfig } from "@chakra-ui/react";
function Card(props) {
  const { variant, children, ...rest } = props;
  const styles = useStyleConfig("Card", { variant });

  return (
    <Box __css={styles} {...rest} bg={"white"} shadow="lg" borderRadius={"lg"} mb={1}>
      {children}
    </Box>
  );
}

export default Card;
