// Chakra imports
import {Box, Flex, FormLabel, Switch, Text, useColorModeValue,} from "@chakra-ui/react";
// Custom components
import React from "react";

export default function Default(props) {
  const {
    id,
    label,
    isChecked,
    onChange,
    reversed,
    ...rest
  } = props;
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const brandColor = useColorModeValue("brand.500", "brand.300");
  const labelColor = isChecked ? brandColor : textColorPrimary;
  return (
    <Box w="100%" fontWeight="500" {...rest}>
        <Flex direction={reversed? "row-reverse" : "row"} align="center" justify={reversed? "start" : "space-between"} gap={5}>
          <FormLabel
              htmlFor={id}
              _hover={{ cursor: "pointer" }}
              direction="column"
              mb="0px"
              maxW={{base: "100%", md: "75%"}}
          >
            <Text align="start" color={labelColor} fontSize="md" fontWeight="500"
                  transition="color 0.2s ease">
              {label}
            </Text>
          </FormLabel>
          <Switch
            isChecked={isChecked}
            id={id}
            variant="main"
            colorScheme="brandScheme"
            size="md"
            onChange={onChange}
          />
        </Flex>
    </Box>
  );
}
