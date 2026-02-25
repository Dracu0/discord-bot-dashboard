import React, { useContext } from "react";

// Custom components
import FeatureGrid from "./components/FeatureGrid";
import { FeaturesContext } from "contexts/FeaturesContext";
import { DataList } from "components/card/data/DataCard";
import { config } from "config/config";
import { Locale, useLocale } from "utils/Language";
import { useLayoutUpdate } from "contexts/layouts/LayoutContext";
import { BannerButton } from "components/card/Banner";
import { FaTripadvisor } from "react-icons/fa";

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
        zh: "機器人功能",
        en: "Bot Features"
      }),
      description: locale({
        zh: `啟用並配置${config.name}在此伺服器的功能`,
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
    leftIcon={<FaTripadvisor size={20} />}
    url={config.tutorialUrl}
  >
    <Locale zh="發現它們" en="Discover" />
  </BannerButton>
}