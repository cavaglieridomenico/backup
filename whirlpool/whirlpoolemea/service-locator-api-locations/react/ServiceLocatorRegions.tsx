import React from "react";
import classnames from "classnames";
import styles from "./styles.css";
import getSLRegions from './graphql/queries/queryRegions.gql';
import { Link } from "vtex.render-runtime";
import { Helmet } from "vtex.render-runtime/react/components/RenderContext";
import { useQuery } from "react-apollo";

interface Region {
  id: number;
  label: string;
  parent_label: string;
  slug: string;
};

interface ServiceLocatorRegionsProps {
  brand: string;
  country: string;
  locale: string;
  country_id: string;
  stateLabel: string;
  assistanceCall: string;
  canonicalbaseURL: string;
  textTitleRegion: string;
  textMetaRegion: string;
  dynamicStateLabel: string;
};

const ServiceLocatorRegions = (props: ServiceLocatorRegionsProps) => {
  const { data, error } = useQuery(getSLRegions, {
    variables: {
      brand: props.brand,
      country: props.country,
      locale: props.locale,
      country_id: props.country_id
    }
  });

  if (error) {
    console.error("Error in SERVICE LOCATOR getSLRegions: ", error);
  }

  return (
    <>
      <Helmet>
        <title>{props.textTitleRegion}</title>
        <link rel="canonical" href={props.canonicalbaseURL} />
        <meta name="description" content={props.textMetaRegion} />
      </Helmet>

      <div className={classnames(styles.container, styles.containerRegion)}>
        <h1 className={classnames(styles.title, styles.titleRegion)}>
          {props.dynamicStateLabel ? props.dynamicStateLabel : props.stateLabel}
        </h1>
        <p className={classnames(styles.text, styles.textRegion)}>
          {props.assistanceCall}
        </p>
        <div className={classnames(styles.list, styles.listRegion)}>
          <ul>
            {data && data.getSLRegions.locations.results.map((region: Region, i: number) => {
              return <li>
                <b>
                  <Link
                    key={i}
                    page={"store.custom#service-locator-provinces"}
                    params={{ region: region.slug.toLowerCase() }}
                    className={classnames(styles.link, styles.linkRegion)}
                  >
                    {region.label}
                  </Link>
                </b>
              </li>
            })}
          </ul>
        </div>
      </div>
    </>
  );
};

ServiceLocatorRegions.schema = {
  title: "editor.ServiceLocatorRegions.title",
  description: "editor.ServiceLocatorRegions.description",
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
    textTitleRegion: {
      title: 'Make your title',
      description: 'Set title for this Region',
      default: '',
      type: 'string',
    },
    textMetaRegion: {
      title: 'Make your Meta',
      description: 'Set text Meta for Region',
      default: '',
      type: 'string',
    },
    dynamicStateLabel: {
      title: 'Make your H1',
      description: 'Set text H1 for Region',
      default: '',
      type: 'string',
    }

  },
};

export default ServiceLocatorRegions;
