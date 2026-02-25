import { Textarea } from "@chakra-ui/react";

export default function TextArea(props) {
    return <Textarea
        variant="main"
        _placeholder={{ fontWeight: "400", color: "secondaryGray.600" }}
        placeholder="Enter text"
        resize="none"
        {...props}
    />
}