import { Subscription, SubscriptionPayload } from "../typings/Subscription";
import { MASTER_DATA_ENTITY, ENTITY_FIELDS } from "./constants";
import { RequestWithRetry } from "./RequestHandler";

export const IsSubscribed = ({ clients: { masterdata } }: Context, subscription: SubscriptionPayload) => RequestWithRetry<Subscription[]>(
  masterdata, masterdata.searchDocuments.name, [{
    dataEntity: MASTER_DATA_ENTITY,
    fields: ENTITY_FIELDS,
    pagination: {
      page: 1,
      pageSize: 1
    },
    where: `email=${subscription.email} AND refId=${subscription.refId} AND emailSent=false`
  }]).then(res => res != null && res.length > 0).catch(() => false)


export const SaveSubscription = ({ clients: { masterdata } }: Context, payload: Subscription) => RequestWithRetry(
  masterdata, masterdata.createDocument.name, [{
    dataEntity: MASTER_DATA_ENTITY,
    fields: payload
  }]).then(() => true).catch(() => false)
