import { CLRecord } from "../typings/MasterData";
import { LLCustomLogger } from "../utils/LLCustomLogger";

export async function InitLoginCustomLogger(ctx: Context, next: () => Promise<any>) {
  try {
    ctx.state.llLogger = new LLCustomLogger(ctx);
    ctx.state.llCustomLog = {
      event: ctx.state.appSettings.llLoggerConstants!.loginEvent!,
      userType: ctx.state.tradePolicyInfo!.name
    }

    await next();
  } catch (err) {
    ctx.status = 500;
    ctx.body = "Internal Server Error";
  }
}

export async function InitSignUpCustomLogger(ctx: Context, next: () => Promise<any>) {
  try {
    ctx.state.llLogger = new LLCustomLogger(ctx);
    ctx.state.llCustomLog = {
      event: ctx.state.appSettings.llLoggerConstants!.signupEvent!,
      userType: ctx.state.tradePolicyInfo!.name
    }
    await next();
  } catch (err) {
    ctx.status = 500;
    ctx.body = "Internal Server Error";
  }
}

export async function InitResetPasswordCustomLogger(ctx: Context, next: () => Promise<any>) {
  try {
    ctx.state.llLogger = new LLCustomLogger(ctx);
    ctx.state.llCustomLog = {
      event: ctx.state.appSettings.llLoggerConstants!.resetPasswordEvent!,
      userType: ctx.state.tradePolicyInfo!.name
    }
    await next();
  } catch (err) {
    ctx.status = 500;
    ctx.body = "Internal Server Error";
  }
}

export async function InitSetPasswordCustomLogger(ctx: Context, next: () => Promise<any>) {
  try {
    ctx.state.llLogger = new LLCustomLogger(ctx);
    ctx.state.llCustomLog = {
      event: ctx.state.appSettings.llLoggerConstants!.setPasswordEvent!,
      userType: ctx.state.tradePolicyInfo!.name
    }

    await next();
  } catch (err) {
    console.log(err);
    ctx.status = 500;
    ctx.body = "Internal Server Error";
  }
}

export async function InitAutologinCustomLogger(ctx: Context, next: () => Promise<any>) {
  try {
    ctx.state.llLogger = new LLCustomLogger(ctx);
    ctx.state.llCustomLog = {
      event: ctx.state.appSettings.llLoggerConstants!.autologinEvent!,
      userType: ctx.state.tradePolicyInfo!.name
    }
    await next();
  } catch (err) {
    ctx.status = 500;
    ctx.body = "Internal Server Error";
  }
}

export async function InitOrderCustomLogger(ctx: Context | NewOrder, next: () => Promise<any>) {
  try {
    ctx.state.llLogger = new LLCustomLogger(ctx);
    ctx.state.llCustomLog = {
      event: ctx.state.appSettings.llLoggerConstants!.increaseOrderNumberEvent!
    }
    await next();
  } catch (err) {
    (ctx as Context).status = 500;
    ctx.body = "Internal Server Error";
  }
}

export function MapOrderCustomLogger(ctx: Context | NewOrder, customer: CLRecord): void {
  ctx.state.llCustomLog!.userType = customer.userType!;
  ctx.state.llCustomLog!.email = customer.email!;
  ctx.state.llCustomLog!.clockNumber = customer.clockNumber!;
  ctx.state.llCustomLog!.hrNumber = customer.hrNumber!;
  ctx.state.llCustomLog!.partnerCode = customer.partnerCode!;
  ctx.state.llCustomLog!.invitingUser = customer.invitingUser!;
  return;
}
