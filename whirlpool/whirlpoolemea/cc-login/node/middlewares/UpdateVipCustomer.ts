import { CLRecord } from "../typings/MasterData";
import { ProfileCustomFields } from "../typings/order";
import { CLEntityFields, CLEntityName } from "../utils/constants";

export async function UpdateVipCustomer(ctx: Context | NewOrder, next: () => Promise<any>) {
  const { state: { order: { salesChannel, customData }, appSettings: { VIP: vipSettings, llLoggerConstants } }, clients: { masterdata } } = ctx
  const orderCustomProfile = (customData.customApps.find(customData => customData.id == "profile")?.fields as ProfileCustomFields)
  if (!vipSettings?.checkoutRegistrationEnabled || salesChannel != vipSettings?.tradePolicyId || !orderCustomProfile?.email) {
    await next()
    return
  }
  try {
    const [clUser] = await masterdata.searchDocuments<CLRecord>({
      dataEntity: CLEntityName,
      fields: CLEntityFields,
      pagination: {
        page: 1,
        pageSize: 1
      }, where: `email=${orderCustomProfile.email}`
    })
    if (clUser?.id && (clUser.userType == null || clUser.partnerCode == null)) {
      await masterdata.updatePartialDocument({
        dataEntity: CLEntityName,
        id: clUser.id,
        fields: {
          userType: vipSettings.cluster,
          partnerCode: clUser.partnerCode || orderCustomProfile.accessCode
        }
      })
    }
  } catch (err) {
    ctx.state.llCustomLog = { event: llLoggerConstants?.vipUserUpdate || '' }
    ctx.state.llLogger.error({ status: err.code ? err.code : err.status || 500, message: err.msg ? err.msg : err.data || "Internal Server Error" });
  }
  await next()
}
