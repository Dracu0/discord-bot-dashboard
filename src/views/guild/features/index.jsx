import React, { useContext } from "react";

import FeatureGrid from "./components/FeatureGrid";
import { FeaturesContext } from "contexts/FeaturesContext";
import { DataList } from "components/card/data/DataCard";
import { config } from "config/config";
import { Locale, useLocale } from "utils/Language";
import { useLayoutUpdate } from "contexts/layouts/LayoutContext";
import { BannerButton } from "components/card/Banner";
import { Compass } from "lucide-react";

export default function FeaturesBoard() {

  return (
    <Content />
  );
}

function Content() {
  const { data } = useContext(FeaturesContext)
  const locale = useLocale()

  useLayoutUpdate({
    banner: {
      title: locale({
        zh: "\u6a5f\u5668\u4eba\u529f\u80fd",
        en: "Bot Features"
      }),
      description: locale({
        zh: `\u555f\u7528\u4e26\u914d\u7f6e${config.name}\u5728\u6b64\u4f3a\u670d\u5668\u7684\u529f\u80fd`,
        en: `Enable and configure ${config.name}'s features for this server`
      }),
      buttons: [
        config.tutorialUrl && <TutorialButton />
      ]
    },
    dataList: config.data.features && <DataList items={config.data.features(data)} />
  })

  return <FeatureGrid />
}

function TutorialButton() {
  return <BannerButton
    leftIcon={<Compass size={20} />}
    url={config.tutorialUrl}
  >
    <Locale zh="\u767c\u73fe\u5b83\u5011" en="Discover" />
  </BannerButton>
}
