import baseApis from "../baseApis";

export interface LegalInfo {
  _id?: string;
  id?: string;
  siteName: string;
  tagline: string;
  companyName: string;
  businessType: string;
  registeredAddress: string;
  contactEmail: string;
  contactPhone: string;
  jurisdiction: string;
  officialWebsite: string;
  facebookLink?: string;
  instagramLink?: string;
  linkedinLink?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LegalInfoResponse {
  success: boolean;
  message: string;
  data: LegalInfo;
}

export const legalinfoApis = baseApis.injectEndpoints({
  endpoints: (builder) => ({
    addUpdateLegalInfo: builder.mutation<LegalInfoResponse, Partial<LegalInfo>>(
      {
        query: (data) => ({
          url: "/legal-info/add-update",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["legal-info"],
      },
    ),
    getLegalInfo: builder.query<LegalInfoResponse, void>({
      query: () => ({
        url: "/legal-info/get",
        method: "GET",
      }),
      providesTags: ["legal-info"],
    }),
  }),
});

export const { useAddUpdateLegalInfoMutation, useGetLegalInfoQuery } =
  legalinfoApis;

