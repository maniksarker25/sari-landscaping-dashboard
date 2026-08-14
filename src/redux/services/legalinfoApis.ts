import baseApis from "../baseApis";

export interface LegalInfo {
  siteName: string;
  tagline: string;
  companyName: string;
  businessType: string;
  registeredAddress: string;
  contactEmail: string;
  contactPhone: string;
  jurisdiction: string;
  officialWebsite: string;
}

export interface LegalInfoResponse {
  success: boolean;
  message: string;
  data: LegalInfo;
}

export const legalinfoApis = baseApis.injectEndpoints({
  endpoints: (builder) => ({
    addUpdateLegalInfo: builder.mutation<LegalInfoResponse, LegalInfo>({
      query: (params: LegalInfo) => ({
        url: "/legal-info/add-update",
        method: "POST",
        params,
      }),
    }),
    getLegalInfo: builder.query<LegalInfoResponse, void>({
      query: () => ({
        url: "/legal-info",
        method: "GET",
      }),
    }),
  }),
});

export const { useAddUpdateLegalInfoMutation } = legalinfoApis;
