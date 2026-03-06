import React, { useMemo } from "react";

import bannerImg from "assets/img/common/ActionBanner.png";

import {useActionInfo} from "contexts/actions/ActionDetailContext";
import Banner from "components/card/Banner";
import {useLocale} from "utils/Language";
import {useLayoutUpdate} from "../../../../contexts/layouts/LayoutContext";

export function useActionBanner(buttons) {
    const {name, description, banner} = useActionInfo()
    const locale = useLocale()
  const layoutProps = useMemo(() => ({
    banner: {
      title: locale(name),
      description,
      image: banner,
      buttons
    }
  }), [banner, buttons, description, locale, name])

  useLayoutUpdate(layoutProps)
}

export default function ActionBanner({children}) {
  const {name, description, banner} = useActionInfo()
  const locale = useLocale()

  return (
      <Banner image={banner || bannerImg} title={locale(name)} description={description}>
        {children}
      </Banner>
  );
}