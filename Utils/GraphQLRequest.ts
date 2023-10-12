import type { AxiosResponse } from "axios";
import axios from "axios";

// import DocumentNode
// import print
import type { GraphQLResponse } from "./types";
import type {
  ActivityQuery,
  ActivityQueryVariables,
  AiringQuery,
  AiringQueryVariables,
  AnimeQuery,
  AnimeQueryVariables,
  CharacterQuery,
  CharacterQueryVariables,
  GetMediaCollectiobQuery,
  GetMediaCollectiobQueryVariables,
  MangaQuery,
  MangaQueryVariables,
  MediaListCollection,
  MediaListCollectionCustomListsArgs,
  RecentChartQuery,
  RecentChartQueryVariables,
  RecommendationsQuery,
  RecommendationsQueryVariables,
  StaffQuery,
  StaffQueryVariables,
  StudioQuery,
  StudioQueryVariables,
  TextActivity,
  TextActivityTextArgs,
  UserCardQuery,
  UserCardQueryVariables,
  UserQuery,
  UserQueryVariables,
} from "../GraphQL/types";
import Queries from "../GraphQL/types/queries";

type Query = keyof typeof Queries;

const baseUrl = process.env.ANILIST_API || "https://graphql.anilist.co";

interface QueryVariables {
  Airing: [AiringQuery, AiringQueryVariables];
  Anime: [AnimeQuery, AnimeQueryVariables];
  GetMediaCollection: [GetMediaCollectiobQuery, GetMediaCollectiobQueryVariables];
  Manga: [MangaQuery, MangaQueryVariables];
  MediaList: [MediaListCollection, MediaListCollectionCustomListsArgs];
  RecentChart: [RecentChartQuery, RecentChartQueryVariables];
  Recommendations: [RecommendationsQuery, RecommendationsQueryVariables];
  Staff: [StaffQuery, StaffQueryVariables];
  Studio: [StudioQuery, StudioQueryVariables];
  TextActivity: [TextActivity, TextActivityTextArgs];
  UserCard: [UserCardQuery, UserCardQueryVariables];
  Activity: [ActivityQuery, ActivityQueryVariables];
  Character: [CharacterQuery, CharacterQueryVariables];
  User: [UserQuery, UserQueryVariables];
}

export function GraphQLRequest<QueryKey extends Query>(queryKey: QueryKey, vars: QueryVariables[QueryKey][1], token?: string, url = baseUrl) {
  if (token && token.length > 1000) axios.defaults.headers.common.Authorization = `Bearer ${token}`;

  return new Promise<GraphQLResponse<QueryVariables[QueryKey][0]>>((resolve, reject) => {
    axios
      .post(url, {
        variables: vars,
        query: Queries[queryKey],
      })
      .then((res: AxiosResponse) => {
        resolve({ data: res.data.data, headers: res.headers });
      })
      .catch((err: any) => {
        console.error(err);
        reject(`GraphQL Request Rejected\n\n${err?.response?.data?.errors?.map((e: any) => `> ${e.message}\n`) || err}`);
      });
  });
}
