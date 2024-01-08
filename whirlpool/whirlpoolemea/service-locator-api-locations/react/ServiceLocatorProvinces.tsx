import React from "react";
import classnames from "classnames";
import styles from "./styles.css";
import getSLProvinces from './graphql/queries/queryProvinces.gql';
import locationSanitizer from "./utils/locationSanitizer";
import { Link } from "vtex.render-runtime";
import { Helmet } from "vtex.render-runtime/react/components/RenderContext";
import { useQuery } from "react-apollo";

interface province {
  id: number;
  label: string;
  parent_label: string;
  slug: string;
};

export interface ServiceLocatorProvincesProps {
  params: any;
  brand: string;
  country: string;
  locale: string;
  country_id: string;
  assistanceCenter: string;
  assistanceCall: string;
  canonicalbaseURL: string;
  textTitleBeforeRegion: string;
  textTitleAfterRegion: string;
  textMetaBeforeRegion: string;
  textMetaAfterRegion: string;
  hideRegionName: boolean;
};

const ServiceLocatorProvinces = (props: ServiceLocatorProvincesProps) => {
  const { data, error } = useQuery(getSLProvinces, {
    variables: {
      brand: props.brand,
      country: props.country,
      locale: props.locale,
      country_id: props.country_id,
      region: props.params.region
    }
  });

  if (error) {
    console.error("Error in SERVICE LOCATOR getSLProvinces: ", error);
  }

  /* Fix for WHIT case */
  var regionData = locationSanitizer(data?.getSLProvinces.locations.results[0]?.parent_label ?? "");
  var regionName = regionData.charAt(0).toUpperCase() + regionData.slice(1);

  return (
    <>
      <Helmet>
        <title>
          {`${props.textTitleBeforeRegion} ${regionName} ${props.textTitleAfterRegion}`}
        </title>
        <link rel="canonical" href={`${props.canonicalbaseURL}/${props.params.region.toLowerCase()}`} />
        <meta name="description" content={`${props.textMetaBeforeRegion} ${regionName} ${props.textMetaAfterRegion}`} />
      </Helmet>

      <div className={classnames(styles.container, styles.containerProvince)}>
        <h1 className={classnames(styles.title, styles.titleProvince)}>
          {props.assistanceCenter}
          {regionName}
        </h1>
        <p className={classnames(styles.text, styles.textProvince)}>
          {!props.hideRegionName && regionName}
          {props.assistanceCall}
        </p>
        <br></br>
        <br></br>

        <br></br>
        <div>
          <ul className={classnames(styles.list, styles.listProvince)}>
            {data && data.getSLProvinces.locations.results.map((province: province, index: number) => (
              <li>
                <b>
                  <Link
                    key={index}
                    page={"store.custom#service-locator-cities"}
                    params={{ province: province.slug.toLowerCase(), region: props.params.region }}
                    className={classnames(styles.link, styles.linkProvince)}
                  >
                    {province.label}
                  </Link>
                </b>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

ServiceLocatorProvinces.schema = {
  title: "editor.serviceLocatorProvinces.title",
  description: "editor.serviceLocatorProvinces.description",
  type: "object",
  properties: {
    brand: {
      title: 'Brand value',
      description: 'Set the brand',
      default: '',
      type: 'string',
    },
    country: {
      title: 'Country value',
      description: 'Set the country',
      default: '',
      type: 'string',
    },
    locale: {
      title: 'Locale value',
      description: 'Set the locale',
      default: '',
      type: 'string',
    },
    country_id: {
      title: 'Country id value',
      description: 'Set the country_id',
      default: '',
      type: 'string',
    },
    assistanceCenter: {
      title: 'Assistance Center value',
      description: 'Set the assistanceCenter',
      default: '',
      type: 'string',
    },
    assistanceCall: {
      title: 'Assistance Call value',
      description: 'Set the assistanceCall',
      default: '',
      type: 'string',
    },
    canonicalbaseURL: {
      title: 'Canonical Base URL value',
      description: 'Set the assistance Call',
      default: '',
      type: 'string',
    },
    textTitleBeforeRegion: {
      title: 'Make your title',
      description: 'Set text before Region',
      default: '',
      type: 'string',
    },
    textTitleAfterRegion: {
      title: 'Make your title / 2',
      description: 'Set text after Region',
      default: '',
      type: 'string',
    },
    textMetaBeforeRegion: {
      title: 'Make your Meta',
      description: 'Set text before Region',
      default: '',
      type: 'string',
    },
    textMetaAfterRegion: {
      title: 'Make your Meta / 2',
      description: 'Set text after Region',
      default: '',
      type: 'string',
    },
    hideRegionName: {
      title: 'Hide region text name from seo description?',
      type: 'boolean',
      default: false,
    },
  },
};

export default ServiceLocatorProvinces;