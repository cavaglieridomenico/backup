import React, { useEffect } from "react";
import classnames from "classnames";
import styles from "./styles.css";
import locationSanitizer from './utils/locationSanitizer';
import getSLServices from './graphql/queries/queryServices.gql';
import getAppSettings from './graphql/queries/getAppSettings.gql'
import { Link } from "vtex.render-runtime";
import { Helmet } from "vtex.render-runtime/react/components/RenderContext";
import { useQuery } from "react-apollo";
import { appInfos } from "./utils/constants";

interface service {
  name: string;
  address: string;
  phone: string;
};

export interface ServiceLocatorCitiesProps {
  params: any;
  brand: string;
  country: string;
  locale: string;
  country_id: string;
  assistanceCenter: string;
  assistanceCall: string;
  canonicalbaseURL: string;
  textTitleBeforeCity: string;
  textTitleAfterCity: string;
  textMetaBeforeCity:string;
  textMetaAfterCity:string;
  hideCityName: boolean;
};

const ServiceLocatorCities = (props: ServiceLocatorCitiesProps) => {
  const { data, error } = useQuery(getSLServices, {
    variables: {
      brand: props.brand,
      country: props.country,
      locale: props.locale,
      country_id: props.country_id,
      province: props.params.province,
      region: props.params.region,
      city: props.params.city
    }
  });

  const { data: getAppSettingsResponse } = useQuery(getAppSettings, {
    variables: {
      app: `${appInfos.vendor}.${appInfos.appName}`,
      version: appInfos.version,
    },
  });
  
  useEffect(() => {
    if(!getAppSettingsResponse) {
      return;
    }
  }, [getAppSettingsResponse])
  
  const appSettings = getAppSettingsResponse && JSON.parse(getAppSettingsResponse?.publicSettingsForApp?.message || '{}');
  const citiesWithCustomHelmets : {
    cityName: string,
    metaTags: {
      metaTagName: string,
    metaTagContent: string
    }[]
  }[] = appSettings?.citiesWithCustomHelmet ?? []
  const cityCustomHelmets = citiesWithCustomHelmets.find(city => city.cityName === props?.params?.city)

  if (error) {
    console.error("Error in SERVICE LOCATOR getSLServices: ", error);
  }

  var cityData: string = "", cityName: string = "";

  /* Fix for WHIT case */
  if ((props.brand === "WP" && props.country === "IT") || (props.brand === "HP" && props.country === "IT")) 
  {
    cityData = locationSanitizer(props.params.city);
  } 
  else 
  {
    cityData = locationSanitizer(data?.getSLServices.locations.results[0]?.parent_label ?? "");
  }
  
  cityName = cityData.charAt(0).toUpperCase() + cityData.slice(1);

  return (
     <>
      <Helmet>
        {
          cityCustomHelmets && cityCustomHelmets.metaTags?.map((metaTag) =>
            <meta name={metaTag?.metaTagName ?? ''} content={metaTag?.metaTagContent ?? ''} />
          )
        }
        <title>
          {`${props.textTitleBeforeCity} ${cityName} ${props.textTitleAfterCity}`}
        </title>
        <link rel="canonical" href={`${props.canonicalbaseURL}/${props.params.region.toLowerCase()}/${props.params.province.toLowerCase()}/${props.params.city.toLowerCase()}`}/>
        <meta name="description" content={` ${props.textMetaBeforeCity} ${cityName} ${props.textMetaAfterCity}`} />
      </Helmet>

      <div className={classnames(styles.container, styles.containerService)}>
        <h1 className={classnames(styles.title, styles.titleService)}>
          {props.assistanceCenter}
          {cityName}
        </h1>
        <p className={classnames(styles.text, styles.textService)}>
        {!props.hideCityName && cityName}
        {props.assistanceCall}
        </p>
        <br></br>
        <br></br>
        <br></br>
        <div className={classnames(styles.list, styles.listService)}>
          {data && data.getSLServices.locations.results.map((service: service, i: number) => (
            <p>
              <b>{service.name}</b>
              <br></br>
              {service.address}
              <br></br>
              <Link key={i} className={classnames(styles.link, styles.linkService)}> {service.phone}</Link>
            </p>
          ))}
        </div>
      </div>
    </>
  );
};

ServiceLocatorCities.schema = {
  title: "editor.serviceLocatorCities.title",
  description: "editor.serviceLocatorCities.description",
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
    textTitleBeforeCity: {
      title: 'Make your title',
      description: 'Set text before City',
      default: '',
      type: 'string',
    },
    textTitleAfterCity: {
      title: 'Make your title / 2',
      description: 'Set text after City',
      default: '',
      type: 'string',
    },
    textMetaBeforeCity: {
      title: 'Make your Meta',
      description: 'Set text before City',
      default: '',
      type: 'string',
    },
    textMetaAfterCity: {
      title: 'Make your Meta / 2',
      description: 'Set text after City',
      default: '',
      type: 'string',
    },
    hideCityName: {
      title: 'Hide city text name from seo description?',
      type: 'boolean',
      default: false,
    },
  },
};

export default ServiceLocatorCities;
