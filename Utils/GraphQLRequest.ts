import axios, { AxiosResponse } from "axios";
import { GraphQLResponse } from "./types";

export function GraphQLRequest(query: any, vars: any, token: string, url: string = process.env.ANILIST_API || "https://graphql.anilist.co"): Promise<GraphQLResponse> {
  if (token?.length > 1000) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  return new Promise<GraphQLResponse>((resolve, reject) => {
    axios
      .post(url, {
        query,
        variables: vars,
      })
      .then((res: AxiosResponse<any>) => {
        resolve({ data: res.data.data, headers: res.headers });
      })
      .catch((err: any) => {
        console.error(err);
        reject("GraphQL Request Rejected\n\n" + (err?.response?.data?.errors?.map((e: any) => `> ${e.message}\n`) || err));
      });
  });
}
