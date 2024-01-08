import React from "react";
import classnames from "classnames";
import styles from "./styles.css";
import locationSanitizer from './utils/locationSanitizer'
import getSLCities from './graphql/queries/queryCities.gql';
import { Link } from "vtex.render-runtime";
import { Helmet } from "vtex.render-runtime/react/components/RenderContext";
import { useQuery } from "react-apollo";

interface city {
  id: number;
  label: string;
  parent_label: string;
  slug: string;
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
  textTitleBeforeProvince: string;
  textTitleAfterProvince: string;
  textMetaBeforeProvince: string;
  textMetaAfterProvince: string;
  hideProvinceName: boolean;
};

const ServiceLocatorCities = (props: ServiceLocatorCitiesProps) => {
  const { data, error } = useQuery(getSLCities, {
    variables: {
      brand: props.brand,
      country: props.country,
      locale: props.locale,
      country_id: props.country_id,
      province: props.params.province,
      region: props.params.region
    }
  });

  if (error) {
    console.error("Error in SERVICE LOCATOR getSLCities: ", error);
  }

  /* Fix for WHIT case */
  var provinceData = locationSanitizer(data?.getSLCities.locations.results[0]?.parent_label ?? "");
  var provinceName = provinceData.charAt(0).toUpperCase() + provinceData.slice(1);

  return (
    <>
      <Helmet>
        <title>
          {`${props.textTitleBeforeProvince} ${provinceName} ${props.textTitleAfterProvince}`}
        </title>
        <link rel="canonical" href={`${props.canonicalbaseURL}/${props.params.region.toLowerCase()}/${props.params.province.toLowerCase()}`} />
        <meta name="description" content={`${props.textMetaBeforeProvince} ${provinceName} ${props.textMetaAfterProvince}`} />
      </Helmet>

      <div className={classnames(styles.container, styles.containerCity)}>
        <h1 className={classnames(styles.title, styles.titleCity)}>
          {props.assistanceCenter}
          {provinceName}
        </h1>
        <p className={classnames(styles.text, styles.textCity)}>
          {!props.hideProvinceName && provinceName}
          {props.assistanceCall}
        </p>
        <br></br>
        <br></br>
        <br></br>
        <div>
          <ul className={classnames(styles.list, styles.listCity)}>
            {data && data.getSLCities.locations.results.map((city: city, i: number) => (
              <li>
                <b>
                  <Link
                    key={i}
                    page={"store.custom#service-locator-services"}
                    params={{
                      city: city.slug.toLowerCase(),
                      region: props.params.region,
                      province: props.params.province
                    }}
                    className={classnames(styles.link, styles.linkCity)}
                  >
                    {city.label}
                  </Link>
                </b>
              </li>
            ))}{" "}
          </ul>
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
    textTitleBeforeProvince: {
      title: 'Make your title',
      description: 'Set text before Province',
      default: '',
      type: 'string',
    },
    textTitleAfterProvince: {
      title: 'Make your title / 2',
      description: 'Set text after Province',
      default: '',
      type: 'string',
    },
    textMetaBeforeProvince: {
      title: 'Make your Meta',
      description: 'Set text before Province',
      default: '',
      type: 'string',
    },
    textMetaAfterProvince: {
      title: 'Make your Meta / 2',
      description: 'Set text after Province',
      default: '',
      type: 'string',
    },
    hideProvinceName: {
      title: 'Hide province text name from seo description?',
      type: 'boolean',
      default: false,
    },
  },
};

export default ServiceLocatorCities;
