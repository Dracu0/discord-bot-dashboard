import React, {useContext} from "react";

// Chakra imports
// Assets
import {GuildContext} from "contexts/guild/GuildContext";

import {useParams} from "react-router-dom";
import {useActionBanner} from "../../components/ActionBanner";
import BackNavButton from "components/navigation/BackNavButton";

export function useBanner() {
  const {action} = useParams()
  const {id: guild} = useContext(GuildContext)

  useActionBanner([
    <BackNavButton
      to={`/guild/${guild}/actions/${action}`}
      zh="返回動作"
      en="Back to Action"
      ariaLabel="Back to Action"
    />,
  ])
}
