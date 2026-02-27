import React, {useContext} from "react";
import {Button, Box} from "@chakra-ui/react";

import {useFeatureInfo} from "contexts/FeatureDetailContext";
import {FeaturesContext} from "contexts/FeaturesContext";

// Assets
import {GuildContext} from "contexts/guild/GuildContext";
import {useLayoutUpdate} from "contexts/layouts/LayoutContext";
import BackNavButton from "components/navigation/BackNavButton";
import {useEnableFeatureMutation} from "api/utils";
import {Locale} from "utils/Language";

function EnableToggle() {
    const { id: serverId } = useContext(GuildContext)
    const { id: featureId } = useFeatureInfo()
    const featuresData = useContext(FeaturesContext)
    const enabled = featuresData?.enabled?.includes(featureId)
    const mutation = useEnableFeatureMutation(serverId, featureId)

    return (
        <Button
            onClick={() => mutation.mutate(!enabled)}
            isLoading={mutation.isLoading}
            size="sm"
            minH="40px"
            fontSize="sm"
            borderRadius="70px"
            px="24px"
            bg={enabled ? "green.500" : "whiteAlpha.300"}
            color="white"
            _hover={{ bg: enabled ? "green.600" : "whiteAlpha.400" }}
        >
            <Box
                as="span"
                w="8px"
                h="8px"
                borderRadius="full"
                bg={enabled ? "white" : "red.300"}
                mr={2}
            />
            {enabled
                ? <Locale zh="已啟用" en="Enabled" />
                : <Locale zh="已停用" en="Disabled" />
            }
        </Button>
    )
}

export default function useBanner(localeName) {
    const { id: serverId } = useContext(GuildContext)
    const {description} = useFeatureInfo()

    useLayoutUpdate({
        banner: {
            title: localeName,
            description,
            buttons: [
                <EnableToggle key="toggle" />,
                <BackNavButton
                    key="back"
                    to={`/guild/${serverId}/features`}
                    zh="返回功能"
                    en="Back to Features"
                    ariaLabel="Back to Features"
                />,
            ]
        }
    })
}
