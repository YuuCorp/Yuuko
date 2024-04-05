import type { AxiosResponse } from 'axios'
import axios from 'axios'

// import DocumentNode
// import print
import type {
  ActivityQuery,
  ActivityQueryVariables,
  AiringQuery,
  AiringQueryVariables,
  AnimeQuery,
  AnimeQueryVariables,
  CharacterQuery,
  CharacterQueryVariables,
  GetMediaCollectionQuery,
  GetMediaCollectionQueryVariables,
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
  ViewerQuery,
  ViewerQueryVariables,
  ListQueryQuery,
  ListQueryQueryVariables,
  SaveMediaListEntryMutation,
  SaveMediaListEntryMutationVariables,
  SaveTextActivityMutation,
  SaveTextActivityMutationVariables,
} from '../graphQL/types'
import Queries from '../graphQL/types/queries'
import type { GraphQLResponse } from './types'

type Query = keyof typeof Queries

const baseUrl = process.env.ANILIST_API || 'https://graphql.anilist.co'

interface QueryVariables {
  Airing: [AiringQuery, AiringQueryVariables]
  Anime: [AnimeQuery, AnimeQueryVariables]
  GetMediaCollection: [GetMediaCollectionQuery, GetMediaCollectionQueryVariables]
  Manga: [MangaQuery, MangaQueryVariables]
  MediaList: [MediaListCollection, MediaListCollectionCustomListsArgs]
  RecentChart: [RecentChartQuery, RecentChartQueryVariables]
  Recommendations: [RecommendationsQuery, RecommendationsQueryVariables]
  Staff: [StaffQuery, StaffQueryVariables]
  Studio: [StudioQuery, StudioQueryVariables]
  TextActivity: [TextActivity, TextActivityTextArgs]
  UserCard: [UserCardQuery, UserCardQueryVariables]
  Activity: [ActivityQuery, ActivityQueryVariables]
  Character: [CharacterQuery, CharacterQueryVariables]
  User: [UserQuery, UserQueryVariables]
  Viewer: [ViewerQuery, ViewerQueryVariables]
  SaveMediaList: [SaveMediaListEntryMutation, SaveMediaListEntryMutationVariables]
  SaveTextActivity: [SaveTextActivityMutation, SaveTextActivityMutationVariables]
  ListQuery: [ListQueryQuery, ListQueryQueryVariables]
}

export function graphQLRequest<QueryKey extends Query>(queryKey: QueryKey, vars: QueryVariables[QueryKey][1], token?: string, url = baseUrl) {
  if (token && token.length > 1000)
    axios.defaults.headers.common.Authorization = `Bearer ${token}`

  return new Promise<GraphQLResponse<QueryVariables[QueryKey][0]>>((resolve, reject) => {
    axios
      .post(url, {
        variables: vars,
        query: Queries[queryKey],
      })
      .then((res: AxiosResponse) => {
        resolve({ data: res.data.data, headers: res.headers })
      })
      .catch((err: any) => {
        console.error(err)
        reject(`GraphQL Request Rejected\n\n${err?.response?.data?.errors?.map((e: any) => `> ${e.message}\n`) || err}`)
      })
  })
}
