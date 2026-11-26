// Types for Jobs & Staffing v1. Field docs: https://heydavidmorales.com/ext/jobs/v1/

export type WorkerKind = "HUMAN" | "AI_AGENT";
export type Channel = "phone" | "chat" | "email" | "social" | "video" | "back-office";

export interface Organization { name: string; url?: string }
export interface Disclosure { type: "referral" | "employee" | "paid" | "affiliate" | "other"; text: string }
export interface Source { publisher: string; updated: string; url?: string; authority?: string }

export interface Cost {
  name: string; amount: number; currency: string; refundable: boolean;
  oneTime?: boolean; refundCondition?: string; regularAmount?: number; priceValidUntil?: string; appliesTo?: string;
  offsetBy?: { name: string; amount: number; currency: string; condition?: string };
}

export interface Location {
  remote: boolean; countries: string[];
  type?: "REMOTE" | "ONSITE" | "HYBRID" | "MOBILE";
  places?: { name?: string; city?: string; region?: string; postalCode?: string; country?: string }[];
  notes?: string;
}

export interface Employment {
  type: "FULL_TIME" | "PART_TIME" | "CONTRACTOR" | "TEMPORARY" | "INTERN" | "PER_DIEM" | "OTHER";
  workerType?: "EMPLOYEE" | "INDEPENDENT_CONTRACTOR" | "TEMP_AGENCY" | "AGENT_OPERATOR" | "OTHER";
  engagement?: "ON_DEMAND" | "SCHEDULED_PART_TIME" | "FULL_TIME" | "FIXED_TERM" | "PER_TASK";
  classification?: string; ongoing?: boolean; taxForm?: string; taxesWithheld?: boolean;
  benefitsProvided?: boolean; workerProvidesEquipment?: boolean;
}

export interface Pay {
  currency: string; unit: "HOUR" | "DAY" | "WEEK" | "MONTH" | "YEAR" | "TASK" | "REQUEST"; min: number; max?: number;
  frequency: "DAILY" | "WEEKLY" | "BIWEEKLY" | "SEMIMONTHLY" | "MONTHLY" | "PER_TASK";
  firstPaymentDelayDays?: number; notes?: string;
  components?: { type: "BASE" | "TIPS" | "COMMISSION" | "BONUS" | "PER_TASK" | "MILEAGE" | "SHIFT_DIFFERENTIAL" | "OTHER"; description?: string; amount?: number; currency?: string; unit?: string; guaranteed?: boolean }[];
  settlement?: { methods?: ("BANK" | "CARD" | "PAYPAL" | "PAYROLL" | "X402" | "STABLECOIN" | "OTHER")[]; asset?: string; network?: string; payee?: "WORKER" | "AGENT_OPERATOR"; notes?: string };
}

export interface Modules {
  contactCenter?: { channels?: Channel[]; programs?: string[]; platforms?: string[]; languages?: string[]; inbound?: boolean; outbound?: boolean };
  remoteSetup?: { computer?: string; headset?: string; internetMinMbps?: number; wiredInternetRequired?: boolean; quietPrivateSpace?: boolean; other?: string[] };
  licensing?: { required?: { name: string; issuer?: string; region?: string; providedByEmployer?: boolean }[]; backgroundCheck?: boolean; drugTest?: boolean; fingerprinting?: boolean };
  driving?: { vehicleRequired?: boolean; vehicleTypes?: string[]; licenseClass?: string; insuranceRequired?: boolean; mileageReimbursed?: boolean; minVehicleYear?: number };
  aiAgent?: {
    protocols?: ("A2A" | "MCP" | "HTTP_API" | "OTHER")[]; skills?: string[]; inputModes?: string[]; outputModes?: string[];
    maxResponseSeconds?: number; qualityBar?: string; evaluation?: string; humanOversight?: boolean; operatorMustBeIdentified?: boolean;
    dataHandling?: { personalDataInvolved?: boolean; retentionAllowed?: string; compliance?: string[] };
  };
  [custom: `x-${string}` | `http${string}`]: Record<string, unknown> | undefined;
}

export interface JobOpportunity {
  $type: "JobOpportunity"; $schema?: string;
  id: string; title: string; summary: string;
  workerKinds?: WorkerKind[];
  hiringOrganization: Organization;
  occupation?: { onet?: string; name?: string };
  industries?: string[];
  /** Prefer modules.contactCenter.channels. */
  channels?: Channel[];
  employment: Employment;
  location: Location;
  pay: Pay;
  /** Required unless the work is for AI agents only. */
  schedule?: { selfScheduled: boolean; minShiftMinutes?: number; minHoursPerWeek?: number; notes?: string };
  /** Required unless the work is for AI agents only. */
  eligibility?: { minAge: number; experienceRequired: boolean; equipment?: string[]; other?: string[] };
  training?: { name?: string; paid?: boolean; notes?: string };
  teaming?: { aiInvolvement?: "NONE" | "SOME" | "ALWAYS"; humanRole?: string; aiRole?: string; oversight?: string };
  costs: Cost[];
  growth?: string[];
  modules?: Modules;
  apply: { url: string; steps?: string[] };
  faqUrl?: string;
  disclosures: Disclosure[];
  source: Source;
}

export interface StaffingRequest {
  $type: "StaffingRequest"; $schema?: string;
  company: string; contact: { name: string; email: string; role?: string }; needs: string;
  roles?: string[]; headcount?: number; workerKinds?: WorkerKind[];
  workerTypes?: ("EMPLOYEE" | "INDEPENDENT_CONTRACTOR" | "TEMP_AGENCY" | "OTHER")[];
  location?: Location; channels?: Channel[]; agentsNeeded?: number; weeklyContacts?: number;
  peakPeriod?: string; startBy?: string; industry?: string; platform?: string; usesAI?: boolean;
  compliance?: string[]; languages?: string[]; modules?: Modules;
  consent: { shareWithProvider: true; at?: string };
}

export interface OpportunityFeed {
  $type: "OpportunityFeed"; $schema?: string; publisher: Organization; updated: string; opportunities: JobOpportunity[];
}

export interface ValidationResult {
  valid: boolean;
  type: "JobOpportunity" | "StaffingRequest" | "OpportunityFeed" | undefined;
  errors: { path: string; message: string }[];
}

export declare const schema: Record<string, unknown>;
export declare const EXTENSION_URI: "https://heydavidmorales.com/ext/jobs/v1";
export declare const SCHEMA_URL: "https://heydavidmorales.com/ext/jobs/v1/schema.json";
export declare const TYPES: readonly ["JobOpportunity", "StaffingRequest", "OpportunityFeed"];
export declare function validate(doc: unknown): ValidationResult;
export declare function extensionDeclaration(options?: { version?: string; feed?: string }): { uri: string; required: false; params: { version: string; schema: string; feed?: string } };
export declare function dataPart<T extends JobOpportunity | StaffingRequest | OpportunityFeed>(obj: T): { data: T; metadata: { extension: string } };
