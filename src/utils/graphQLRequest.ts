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
export async function graphQLRequest<QueryKey extends Query>(queryKey: QueryKey, vars: QueryVariables[QueryKey][1], token?: string, url = baseUrl) {
  const headers = new Headers()
  if (token && token.length > 1000)
    headers.append('Authorization', `Bearer ${token}`)

  headers.append('Content-Type', 'application/json');

  const reqOptions = {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query: Queries[queryKey],
      variables: vars,
    })
  } satisfies FetchRequestInit

  try {
    const res = await fetch(url, reqOptions)
    if (!res.ok) {
      const errorMsg = res.statusText
      throw new Error(`GraphQL Request Rejected\n\n${errorMsg}`)
    }
    const data = await res.json() as GraphQLResponse<QueryVariables[QueryKey][0]>
    return data;
  } catch (e: any) {
    console.error(e)
    throw new Error(e?.message || e, { cause: vars });
  }
}
