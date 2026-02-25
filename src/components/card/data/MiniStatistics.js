// Chakra imports
import {Flex, Stat, StatLabel, StatNumber} from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
import React from "react";
import {useDetailColor, useTextColor} from "../../../utils/colors";

export default function Default(props) {
  const { startContent, endContent, name, value } = props;
  const textColor = useTextColor()
  const textColorSecondary = useDetailColor();

  return (
    <Card py='15px'>
      <Flex
        my='auto'
        h='100%'
        align={{ base: "center", xl: "start" }}
        justify={{ base: "center", xl: "center" }}>
        {startContent}

        <Stat my='auto' ms={startContent ? "18px" : "0px"}>
          <StatLabel
            lineHeight='100%'
            color={textColorSecondary}
            fontSize={{ base: "sm" }}
            fontWeight="500"
          >
            {name}
          </StatLabel>
          <StatNumber
            color={textColor}
            fontSize={{ base: "2xl" }}
            fontFamily="'Space Grotesk', sans-serif"
            fontWeight="700"
          >
            {value}
          </StatNumber>
        </Stat>
        <Flex ms='auto' w='max-content'>
          {endContent}
        </Flex>
      </Flex>
    </Card>
  );
}
