export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  CountryCode: { input: any; output: any };
  FuzzyDateInt: { input: any; output: any };
  Json: { input: any; output: any };
}

/** Notification for when a activity is liked */
export interface ActivityLikeNotification {
  __typename?: "ActivityLikeNotification";
  /** The liked activity */
  activity?: Maybe<ActivityUnion>;
  /** The id of the activity which was liked */
  activityId: Scalars["Int"]["output"];
  /** The notification context text */
  context?: Maybe<Scalars["String"]["output"]>;
  /** The time the notification was created at */
  createdAt?: Maybe<Scalars["Int"]["output"]>;
  /** The id of the Notification */
  id: Scalars["Int"]["output"];
  /** The type of notification */
  type?: Maybe<NotificationType>;
  /** The user who liked the activity */
  user?: Maybe<User>;
  /** The id of the user who liked to the activity */
  userId: Scalars["Int"]["output"];
}

/** Notification for when authenticated user is @ mentioned in activity or reply */
export interface ActivityMentionNotification {
  __typename?: "ActivityMentionNotification";
  /** The liked activity */
  activity?: Maybe<ActivityUnion>;
  /** The id of the activity where mentioned */
  activityId: Scalars["Int"]["output"];
  /** The notification context text */
  context?: Maybe<Scalars["String"]["output"]>;
  /** The time the notification was created at */
  createdAt?: Maybe<Scalars["Int"]["output"]>;
  /** The id of the Notification */
  id: Scalars["Int"]["output"];
  /** The type of notification */
  type?: Maybe<NotificationType>;
  /** The user who mentioned the authenticated user */
  user?: Maybe<User>;
  /** The id of the user who mentioned the authenticated user */
  userId: Scalars["Int"]["output"];
}

/** Notification for when a user is send an activity message */
export interface ActivityMessageNotification {
  __typename?: "ActivityMessageNotification";
  /** The id of the activity message */
  activityId: Scalars["Int"]["output"];
  /** The notification context text */
  context?: Maybe<Scalars["String"]["output"]>;
  /** The time the notification was created at */
  createdAt?: Maybe<Scalars["Int"]["output"]>;
  /** The id of the Notification */
  id: Scalars["Int"]["output"];
  /** The message activity */
  message?: Maybe<MessageActivity>;
  /** The type of notification */
  type?: Maybe<NotificationType>;
  /** The user who sent the message */
  user?: Maybe<User>;
  /** The if of the user who send the message */
  userId: Scalars["Int"]["output"];
}

/** Replay to an activity item */
export interface ActivityReply {
  __typename?: "ActivityReply";
  /** The id of the parent activity */
  activityId?: Maybe<Scalars["Int"]["output"]>;
  /** The time the reply was created at */
  createdAt: Scalars["Int"]["output"];
  /** The id of the reply */
  id: Scalars["Int"]["output"];
  /** If the currently authenticated user liked the reply */
  isLiked?: Maybe<Scalars["Boolean"]["output"]>;
  /** The amount of likes the reply has */
  likeCount: Scalars["Int"]["output"];
  /** The users who liked the reply */
  likes?: Maybe<Array<Maybe<User>>>;
  /** The reply text */
  text?: Maybe<Scalars["String"]["output"]>;
  /** The user who created reply */
  user?: Maybe<User>;
  /** The id of the replies creator */
  userId?: Maybe<Scalars["Int"]["output"]>;
}

/** Replay to an activity item */
export interface ActivityReplyTextArgs {
  asHtml?: InputMaybe<Scalars["Boolean"]["input"]>;
}

/** Notification for when a activity reply is liked */
export interface ActivityReplyLikeNotification {
  __typename?: "ActivityReplyLikeNotification";
  /** The liked activity */
  activity?: Maybe<ActivityUnion>;
  /** The id of the activity where the reply which was liked */
  activityId: Scalars["Int"]["output"];
  /** The notification context text */
  context?: Maybe<Scalars["String"]["output"]>;
  /** The time the notification was created at */
  createdAt?: Maybe<Scalars["Int"]["output"]>;
  /** The id of the Notification */
  id: Scalars["Int"]["output"];
  /** The type of notification */
  type?: Maybe<NotificationType>;
  /** The user who liked the activity reply */
  user?: Maybe<User>;
  /** The id of the user who liked to the activity reply */
  userId: Scalars["Int"]["output"];
}

/** Notification for when a user replies to the authenticated users activity */
export interface ActivityReplyNotification {
  __typename?: "ActivityReplyNotification";
  /** The liked activity */
  activity?: Maybe<ActivityUnion>;
  /** The id of the activity which was replied too */
  activityId: Scalars["Int"]["output"];
  /** The notification context text */
  context?: Maybe<Scalars["String"]["output"]>;
  /** The time the notification was created at */
  createdAt?: Maybe<Scalars["Int"]["output"]>;
  /** The id of the Notification */
  id: Scalars["Int"]["output"];
  /** The type of notification */
  type?: Maybe<NotificationType>;
  /** The user who replied to the activity */
  user?: Maybe<User>;
  /** The id of the user who replied to the activity */
  userId: Scalars["Int"]["output"];
}

/** Notification for when a user replies to activity the authenticated user has replied to */
export interface ActivityReplySubscribedNotification {
  __typename?: "ActivityReplySubscribedNotification";
  /** The liked activity */
  activity?: Maybe<ActivityUnion>;
  /** The id of the activity which was replied too */
  activityId: Scalars["Int"]["output"];
  /** The notification context text */
  context?: Maybe<Scalars["String"]["output"]>;
  /** The time the notification was created at */
  createdAt?: Maybe<Scalars["Int"]["output"]>;
  /** The id of the Notification */
  id: Scalars["Int"]["output"];
  /** The type of notification */
  type?: Maybe<NotificationType>;
  /** The user who replied to the activity */
  user?: Maybe<User>;
  /** The id of the user who replied to the activity */
  userId: Scalars["Int"]["output"];
}

/** Activity sort enums */
export enum ActivitySort {
  Id = "ID",
  IdDesc = "ID_DESC",
  Pinned = "PINNED",
}

/** Activity type enum. */
export enum ActivityType {
  /** A anime list update activity */
  AnimeList = "ANIME_LIST",
  /** A manga list update activity */
  MangaList = "MANGA_LIST",
  /** Anime & Manga list update, only used in query arguments */
  MediaList = "MEDIA_LIST",
  /** A text message activity sent to another user */
  Message = "MESSAGE",
  /** A text activity */
  Text = "TEXT",
}

/** Activity union type */
export type ActivityUnion = ListActivity | MessageActivity | TextActivity;

/** Notification for when an episode of anime airs */
export interface AiringNotification {
  __typename?: "AiringNotification";
  /** The id of the aired anime */
  animeId: Scalars["Int"]["output"];
  /** The notification context text */
  contexts?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  /** The time the notification was created at */
  createdAt?: Maybe<Scalars["Int"]["output"]>;
  /** The episode number that just aired */
  episode: Scalars["Int"]["output"];
  /** The id of the Notification */
  id: Scalars["Int"]["output"];
  /** The associated media of the airing schedule */
  media?: Maybe<Media>;
  /** The type of notification */
  type?: Maybe<NotificationType>;
}

/** Score & Watcher stats for airing anime by episode and mid-week */
export interface AiringProgression {
  __typename?: "AiringProgression";
  /** The episode the stats were recorded at. .5 is the mid point between 2 episodes airing dates. */
  episode?: Maybe<Scalars["Float"]["output"]>;
  /** The average score for the media */
  score?: Maybe<Scalars["Float"]["output"]>;
  /** The amount of users watching the anime */
  watching?: Maybe<Scalars["Int"]["output"]>;
}

/** Media Airing Schedule. NOTE: We only aim to guarantee that FUTURE airing data is present and accurate. */
export interface AiringSchedule {
  __typename?: "AiringSchedule";
  /** The time the episode airs at */
  airingAt: Scalars["Int"]["output"];
  /** The airing episode number */
  episode: Scalars["Int"]["output"];
  /** The id of the airing schedule item */
  id: Scalars["Int"]["output"];
  /** The associate media of the airing episode */
  media?: Maybe<Media>;
  /** The associate media id of the airing episode */
  mediaId: Scalars["Int"]["output"];
  /** Seconds until episode starts airing */
  timeUntilAiring: Scalars["Int"]["output"];
}

export interface AiringScheduleConnection {
  __typename?: "AiringScheduleConnection";
  edges?: Maybe<Array<Maybe<AiringScheduleEdge>>>;
  nodes?: Maybe<Array<Maybe<AiringSchedule>>>;
  /** The pagination information */
  pageInfo?: Maybe<PageInfo>;
}

/** AiringSchedule connection edge */
export interface AiringScheduleEdge {
  __typename?: "AiringScheduleEdge";
  /** The id of the connection */
  id?: Maybe<Scalars["Int"]["output"]>;
  node?: Maybe<AiringSchedule>;
}

export interface AiringScheduleInput {
  airingAt?: InputMaybe<Scalars["Int"]["input"]>;
  episode?: InputMaybe<Scalars["Int"]["input"]>;
  timeUntilAiring?: InputMaybe<Scalars["Int"]["input"]>;
}

/** Airing schedule sort enums */
export enum AiringSort {
  Episode = "EPISODE",
  EpisodeDesc = "EPISODE_DESC",
  Id = "ID",
  IdDesc = "ID_DESC",
  MediaId = "MEDIA_ID",
  MediaIdDesc = "MEDIA_ID_DESC",
  Time = "TIME",
  TimeDesc = "TIME_DESC",
}

export interface AniChartHighlightInput {
  highlight?: InputMaybe<Scalars["String"]["input"]>;
  mediaId?: InputMaybe<Scalars["Int"]["input"]>;
}

export interface AniChartUser {
  __typename?: "AniChartUser";
  highlights?: Maybe<Scalars["Json"]["output"]>;
  settings?: Maybe<Scalars["Json"]["output"]>;
  user?: Maybe<User>;
}

/** A character that features in an anime or manga */
export interface Character {
  __typename?: "Character";
  /** The character's age. Note this is a string, not an int, it may contain further text and additional ages. */
  age?: Maybe<Scalars["String"]["output"]>;
  /** The characters blood type */
  bloodType?: Maybe<Scalars["String"]["output"]>;
  /** The character's birth date */
  dateOfBirth?: Maybe<FuzzyDate>;
  /** A general description of the character */
  description?: Maybe<Scalars["String"]["output"]>;
  /** The amount of user's who have favourited the character */
  favourites?: Maybe<Scalars["Int"]["output"]>;
  /** The character's gender. Usually Male, Female, or Non-binary but can be any string. */
  gender?: Maybe<Scalars["String"]["output"]>;
  /** The id of the character */
  id: Scalars["Int"]["output"];
  /** Character images */
  image?: Maybe<CharacterImage>;
  /** If the character is marked as favourite by the currently authenticated user */
  isFavourite: Scalars["Boolean"]["output"];
  /** If the character is blocked from being added to favourites */
  isFavouriteBlocked: Scalars["Boolean"]["output"];
  /** Media that includes the character */
  media?: Maybe<MediaConnection>;
  /** Notes for site moderators */
  modNotes?: Maybe<Scalars["String"]["output"]>;
  /** The names of the character */
  name?: Maybe<CharacterName>;
  /** The url for the character page on the AniList website */
  siteUrl?: Maybe<Scalars["String"]["output"]>;
  /** @deprecated No data available */
  updatedAt?: Maybe<Scalars["Int"]["output"]>;
}

/** A character that features in an anime or manga */
export interface CharacterDescriptionArgs {
  asHtml?: InputMaybe<Scalars["Boolean"]["input"]>;
}

/** A character that features in an anime or manga */
export interface CharacterMediaArgs {
  onList?: InputMaybe<Scalars["Boolean"]["input"]>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
  perPage?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<Array<InputMaybe<MediaSort>>>;
  type?: InputMaybe<MediaType>;
}

export interface CharacterConnection {
  __typename?: "CharacterConnection";
  edges?: Maybe<Array<Maybe<CharacterEdge>>>;
  nodes?: Maybe<Array<Maybe<Character>>>;
  /** The pagination information */
  pageInfo?: Maybe<PageInfo>;
}

/** Character connection edge */
export interface CharacterEdge {
  __typename?: "CharacterEdge";
  /** The order the character should be displayed from the users favourites */
  favouriteOrder?: Maybe<Scalars["Int"]["output"]>;
  /** The id of the connection */
  id?: Maybe<Scalars["Int"]["output"]>;
  /** The media the character is in */
  media?: Maybe<Array<Maybe<Media>>>;
  /** Media specific character name */
  name?: Maybe<Scalars["String"]["output"]>;
  node?: Maybe<Character>;
  /** The characters role in the media */
  role?: Maybe<CharacterRole>;
  /** The voice actors of the character with role date */
  voiceActorRoles?: Maybe<Array<Maybe<StaffRoleType>>>;
  /** The voice actors of the character */
  voiceActors?: Maybe<Array<Maybe<Staff>>>;
}

/** Character connection edge */
export interface CharacterEdgeVoiceActorRolesArgs {
  language?: InputMaybe<StaffLanguage>;
  sort?: InputMaybe<Array<InputMaybe<StaffSort>>>;
}

/** Character connection edge */
export interface CharacterEdgeVoiceActorsArgs {
  language?: InputMaybe<StaffLanguage>;
  sort?: InputMaybe<Array<InputMaybe<StaffSort>>>;
}

export interface CharacterImage {
  __typename?: "CharacterImage";
  /** The character's image of media at its largest size */
  large?: Maybe<Scalars["String"]["output"]>;
  /** The character's image of media at medium size */
  medium?: Maybe<Scalars["String"]["output"]>;
}

/** The names of the character */
export interface CharacterName {
  __typename?: "CharacterName";
  /** Other names the character might be referred to as */
  alternative?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  /** Other names the character might be referred to as but are spoilers */
  alternativeSpoiler?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  /** The character's given name */
  first?: Maybe<Scalars["String"]["output"]>;
  /** The character's first and last name */
  full?: Maybe<Scalars["String"]["output"]>;
  /** The character's surname */
  last?: Maybe<Scalars["String"]["output"]>;
  /** The character's middle name */
  middle?: Maybe<Scalars["String"]["output"]>;
  /** The character's full name in their native language */
  native?: Maybe<Scalars["String"]["output"]>;
  /** The currently authenticated users preferred name language. Default romaji for non-authenticated */
  userPreferred?: Maybe<Scalars["String"]["output"]>;
}

/** The names of the character */
export interface CharacterNameInput {
  /** Other names the character might be referred by */
  alternative?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  /** Other names the character might be referred to as but are spoilers */
  alternativeSpoiler?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  /** The character's given name */
  first?: InputMaybe<Scalars["String"]["input"]>;
  /** The character's surname */
  last?: InputMaybe<Scalars["String"]["input"]>;
  /** The character's middle name */
  middle?: InputMaybe<Scalars["String"]["input"]>;
  /** The character's full name in their native language */
  native?: InputMaybe<Scalars["String"]["input"]>;
}

/** The role the character plays in the media */
export enum CharacterRole {
  /** A background character in the media */
  Background = "BACKGROUND",
  /** A primary character role in the media */
  Main = "MAIN",
  /** A supporting character role in the media */
  Supporting = "SUPPORTING",
}

/** Character sort enums */
export enum CharacterSort {
  Favourites = "FAVOURITES",
  FavouritesDesc = "FAVOURITES_DESC",
  Id = "ID",
  IdDesc = "ID_DESC",
  /** Order manually decided by moderators */
  Relevance = "RELEVANCE",
  Role = "ROLE",
  RoleDesc = "ROLE_DESC",
  SearchMatch = "SEARCH_MATCH",
}

/** A submission for a character that features in an anime or manga */
export interface CharacterSubmission {
  __typename?: "CharacterSubmission";
  /** Data Mod assigned to handle the submission */
  assignee?: Maybe<User>;
  /** Character that the submission is referencing */
  character?: Maybe<Character>;
  createdAt?: Maybe<Scalars["Int"]["output"]>;
  /** The id of the submission */
  id: Scalars["Int"]["output"];
  /** Whether the submission is locked */
  locked?: Maybe<Scalars["Boolean"]["output"]>;
  /** Inner details of submission status */
  notes?: Maybe<Scalars["String"]["output"]>;
  source?: Maybe<Scalars["String"]["output"]>;
  /** Status of the submission */
  status?: Maybe<SubmissionStatus>;
  /** The character submission changes */
  submission?: Maybe<Character>;
  /** Submitter for the submission */
  submitter?: Maybe<User>;
}

export interface CharacterSubmissionConnection {
  __typename?: "CharacterSubmissionConnection";
  edges?: Maybe<Array<Maybe<CharacterSubmissionEdge>>>;
  nodes?: Maybe<Array<Maybe<CharacterSubmission>>>;
  /** The pagination information */
  pageInfo?: Maybe<PageInfo>;
}

/** CharacterSubmission connection edge */
export interface CharacterSubmissionEdge {
  __typename?: "CharacterSubmissionEdge";
  node?: Maybe<CharacterSubmission>;
  /** The characters role in the media */
  role?: Maybe<CharacterRole>;
  /** The submitted voice actors of the character */
  submittedVoiceActors?: Maybe<Array<Maybe<StaffSubmission>>>;
  /** The voice actors of the character */
  voiceActors?: Maybe<Array<Maybe<Staff>>>;
}

/** Deleted data type */
export interface Deleted {
  __typename?: "Deleted";
  /** If an item has been successfully deleted */
  deleted?: Maybe<Scalars["Boolean"]["output"]>;
}

export enum ExternalLinkMediaType {
  Anime = "ANIME",
  Manga = "MANGA",
  Staff = "STAFF",
}

export enum ExternalLinkType {
  Info = "INFO",
  Social = "SOCIAL",
  Streaming = "STREAMING",
}

/** User's favourite anime, manga, characters, staff & studios */
export interface Favourites {
  __typename?: "Favourites";
  /** Favourite anime */
  anime?: Maybe<MediaConnection>;
  /** Favourite characters */
  characters?: Maybe<CharacterConnection>;
  /** Favourite manga */
  manga?: Maybe<MediaConnection>;
  /** Favourite staff */
  staff?: Maybe<StaffConnection>;
  /** Favourite studios */
  studios?: Maybe<StudioConnection>;
}

/** User's favourite anime, manga, characters, staff & studios */
export interface FavouritesAnimeArgs {
  page?: InputMaybe<Scalars["Int"]["input"]>;
  perPage?: InputMaybe<Scalars["Int"]["input"]>;
}

/** User's favourite anime, manga, characters, staff & studios */
export interface FavouritesCharactersArgs {
  page?: InputMaybe<Scalars["Int"]["input"]>;
  perPage?: InputMaybe<Scalars["Int"]["input"]>;
}

/** User's favourite anime, manga, characters, staff & studios */
export interface FavouritesMangaArgs {
  page?: InputMaybe<Scalars["Int"]["input"]>;
  perPage?: InputMaybe<Scalars["Int"]["input"]>;
}

/** User's favourite anime, manga, characters, staff & studios */
export interface FavouritesStaffArgs {
  page?: InputMaybe<Scalars["Int"]["input"]>;
  perPage?: InputMaybe<Scalars["Int"]["input"]>;
}

/** User's favourite anime, manga, characters, staff & studios */
export interface FavouritesStudiosArgs {
  page?: InputMaybe<Scalars["Int"]["input"]>;
  perPage?: InputMaybe<Scalars["Int"]["input"]>;
}

/** Notification for when the authenticated user is followed by another user */
export interface FollowingNotification {
  __typename?: "FollowingNotification";
  /** The notification context text */
  context?: Maybe<Scalars["String"]["output"]>;
  /** The time the notification was created at */
  createdAt?: Maybe<Scalars["Int"]["output"]>;
  /** The id of the Notification */
  id: Scalars["Int"]["output"];
  /** The type of notification */
  type?: Maybe<NotificationType>;
  /** The liked activity */
  user?: Maybe<User>;
  /** The id of the user who followed the authenticated user */
  userId: Scalars["Int"]["output"];
}

/** User's format statistics */
export interface FormatStats {
  __typename?: "FormatStats";
  amount?: Maybe<Scalars["Int"]["output"]>;
  format?: Maybe<MediaFormat>;
}

/** Date object that allows for incomplete date values (fuzzy) */
export interface FuzzyDate {
  __typename?: "FuzzyDate";
  /** Numeric Day (24) */
  day?: Maybe<Scalars["Int"]["output"]>;
  /** Numeric Month (3) */
  month?: Maybe<Scalars["Int"]["output"]>;
  /** Numeric Year (2017) */
  year?: Maybe<Scalars["Int"]["output"]>;
}

/** Date object that allows for incomplete date values (fuzzy) */
export interface FuzzyDateInput {
  /** Numeric Day (24) */
  day?: InputMaybe<Scalars["Int"]["input"]>;
  /** Numeric Month (3) */
  month?: InputMaybe<Scalars["Int"]["input"]>;
  /** Numeric Year (2017) */
  year?: InputMaybe<Scalars["Int"]["input"]>;
}

/** User's genre statistics */
export interface GenreStats {
  __typename?: "GenreStats";
  amount?: Maybe<Scalars["Int"]["output"]>;
  genre?: Maybe<Scalars["String"]["output"]>;
  meanScore?: Maybe<Scalars["Int"]["output"]>;
  /** The amount of time in minutes the genre has been watched by the user */
  timeWatched?: Maybe<Scalars["Int"]["output"]>;
}

/** Page of data (Used for internal use only) */
export interface InternalPage {
  __typename?: "InternalPage";
  activities?: Maybe<Array<Maybe<ActivityUnion>>>;
  activityReplies?: Maybe<Array<Maybe<ActivityReply>>>;
  airingSchedules?: Maybe<Array<Maybe<AiringSchedule>>>;
  characterSubmissions?: Maybe<Array<Maybe<CharacterSubmission>>>;
  characters?: Maybe<Array<Maybe<Character>>>;
  followers?: Maybe<Array<Maybe<User>>>;
  following?: Maybe<Array<Maybe<User>>>;
  likes?: Maybe<Array<Maybe<User>>>;
  media?: Maybe<Array<Maybe<Media>>>;
  mediaList?: Maybe<Array<Maybe<MediaList>>>;
  mediaSubmissions?: Maybe<Array<Maybe<MediaSubmission>>>;
  mediaTrends?: Maybe<Array<Maybe<MediaTrend>>>;
  modActions?: Maybe<Array<Maybe<ModAction>>>;
  notifications?: Maybe<Array<Maybe<NotificationUnion>>>;
  /** The pagination information */
  pageInfo?: Maybe<PageInfo>;
  recommendations?: Maybe<Array<Maybe<Recommendation>>>;
  reports?: Maybe<Array<Maybe<Report>>>;
  reviews?: Maybe<Array<Maybe<Review>>>;
  revisionHistory?: Maybe<Array<Maybe<RevisionHistory>>>;
  staff?: Maybe<Array<Maybe<Staff>>>;
  staffSubmissions?: Maybe<Array<Maybe<StaffSubmission>>>;
  studios?: Maybe<Array<Maybe<Studio>>>;
  threadComments?: Maybe<Array<Maybe<ThreadComment>>>;
  threads?: Maybe<Array<Maybe<Thread>>>;
  userBlockSearch?: Maybe<Array<Maybe<User>>>;
  users?: Maybe<Array<Maybe<User>>>;
}

/** Page of data (Used for internal use only) */
export interface InternalPageActivitiesArgs {
  createdAt?: InputMaybe<Scalars["Int"]["input"]>;
  createdAt_greater?: InputMaybe<Scalars["Int"]["input"]>;
  createdAt_lesser?: InputMaybe<Scalars["Int"]["input"]>;
  hasReplies?: InputMaybe<Scalars["Boolean"]["input"]>;
  hasRepliesOrTypeText?: InputMaybe<Scalars["Boolean"]["input"]>;
  id?: InputMaybe<Scalars["Int"]["input"]>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  id_not?: InputMaybe<Scalars["Int"]["input"]>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  isFollowing?: InputMaybe<Scalars["Boolean"]["input"]>;
  mediaId?: InputMaybe<Scalars["Int"]["input"]>;
  mediaId_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  mediaId_not?: InputMaybe<Scalars["Int"]["input"]>;
  mediaId_not_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  messengerId?: InputMaybe<Scalars["Int"]["input"]>;
  messengerId_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  messengerId_not?: InputMaybe<Scalars["Int"]["input"]>;
  messengerId_not_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  sort?: InputMaybe<Array<InputMaybe<ActivitySort>>>;
  type?: InputMaybe<ActivityType>;
  type_in?: InputMaybe<Array<InputMaybe<ActivityType>>>;
  type_not?: InputMaybe<ActivityType>;
  type_not_in?: InputMaybe<Array<InputMaybe<ActivityType>>>;
  userId?: InputMaybe<Scalars["Int"]["input"]>;
  userId_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  userId_not?: InputMaybe<Scalars["Int"]["input"]>;
  userId_not_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
}

/** Page of data (Used for internal use only) */
export interface InternalPageActivityRepliesArgs {
  activityId?: InputMaybe<Scalars["Int"]["input"]>;
  id?: InputMaybe<Scalars["Int"]["input"]>;
}

/** Page of data (Used for internal use only) */
export interface InternalPageAiringSchedulesArgs {
  airingAt?: InputMaybe<Scalars["Int"]["input"]>;
  airingAt_greater?: InputMaybe<Scalars["Int"]["input"]>;
  airingAt_lesser?: InputMaybe<Scalars["Int"]["input"]>;
  episode?: InputMaybe<Scalars["Int"]["input"]>;
  episode_greater?: InputMaybe<Scalars["Int"]["input"]>;
  episode_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  episode_lesser?: InputMaybe<Scalars["Int"]["input"]>;
  episode_not?: InputMaybe<Scalars["Int"]["input"]>;
  episode_not_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  id?: InputMaybe<Scalars["Int"]["input"]>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  id_not?: InputMaybe<Scalars["Int"]["input"]>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  mediaId?: InputMaybe<Scalars["Int"]["input"]>;
  mediaId_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  mediaId_not?: InputMaybe<Scalars["Int"]["input"]>;
  mediaId_not_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  notYetAired?: InputMaybe<Scalars["Boolean"]["input"]>;
  sort?: InputMaybe<Array<InputMaybe<AiringSort>>>;
}

/** Page of data (Used for internal use only) */
export interface InternalPageCharacterSubmissionsArgs {
  assigneeId?: InputMaybe<Scalars["Int"]["input"]>;
  characterId?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<Array<InputMaybe<SubmissionSort>>>;
  status?: InputMaybe<SubmissionStatus>;
  userId?: InputMaybe<Scalars["Int"]["input"]>;
}

/** Page of data (Used for internal use only) */
export interface InternalPageCharactersArgs {
  id?: InputMaybe<Scalars["Int"]["input"]>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  id_not?: InputMaybe<Scalars["Int"]["input"]>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  isBirthday?: InputMaybe<Scalars["Boolean"]["input"]>;
  search?: InputMaybe<Scalars["String"]["input"]>;
  sort?: InputMaybe<Array<InputMaybe<CharacterSort>>>;
}

/** Page of data (Used for internal use only) */
export interface InternalPageFollowersArgs {
  sort?: InputMaybe<Array<InputMaybe<UserSort>>>;
  userId: Scalars["Int"]["input"];
}

/** Page of data (Used for internal use only) */
export interface InternalPageFollowingArgs {
  sort?: InputMaybe<Array<InputMaybe<UserSort>>>;
  userId: Scalars["Int"]["input"];
}

/** Page of data (Used for internal use only) */
export interface InternalPageLikesArgs {
  likeableId?: InputMaybe<Scalars["Int"]["input"]>;
  type?: InputMaybe<LikeableType>;
}

/** Page of data (Used for internal use only) */
export interface InternalPageMediaArgs {
  averageScore?: InputMaybe<Scalars["Int"]["input"]>;
  averageScore_greater?: InputMaybe<Scalars["Int"]["input"]>;
  averageScore_lesser?: InputMaybe<Scalars["Int"]["input"]>;
  averageScore_not?: InputMaybe<Scalars["Int"]["input"]>;
  chapters?: InputMaybe<Scalars["Int"]["input"]>;
  chapters_greater?: InputMaybe<Scalars["Int"]["input"]>;
  chapters_lesser?: InputMaybe<Scalars["Int"]["input"]>;
  countryOfOrigin?: InputMaybe<Scalars["CountryCode"]["input"]>;
  duration?: InputMaybe<Scalars["Int"]["input"]>;
  duration_greater?: InputMaybe<Scalars["Int"]["input"]>;
  duration_lesser?: InputMaybe<Scalars["Int"]["input"]>;
  endDate?: InputMaybe<Scalars["FuzzyDateInt"]["input"]>;
  endDate_greater?: InputMaybe<Scalars["FuzzyDateInt"]["input"]>;
  endDate_lesser?: InputMaybe<Scalars["FuzzyDateInt"]["input"]>;
  endDate_like?: InputMaybe<Scalars["String"]["input"]>;
  episodes?: InputMaybe<Scalars["Int"]["input"]>;
  episodes_greater?: InputMaybe<Scalars["Int"]["input"]>;
  episodes_lesser?: InputMaybe<Scalars["Int"]["input"]>;
  format?: InputMaybe<MediaFormat>;
  format_in?: InputMaybe<Array<InputMaybe<MediaFormat>>>;
  format_not?: InputMaybe<MediaFormat>;
  format_not_in?: InputMaybe<Array<InputMaybe<MediaFormat>>>;
  genre?: InputMaybe<Scalars["String"]["input"]>;
  genre_in?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  genre_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  id?: InputMaybe<Scalars["Int"]["input"]>;
  idMal?: InputMaybe<Scalars["Int"]["input"]>;
  idMal_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  idMal_not?: InputMaybe<Scalars["Int"]["input"]>;
  idMal_not_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  id_not?: InputMaybe<Scalars["Int"]["input"]>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  isAdult?: InputMaybe<Scalars["Boolean"]["input"]>;
  isLicensed?: InputMaybe<Scalars["Boolean"]["input"]>;
  licensedBy?: InputMaybe<Scalars["String"]["input"]>;
  licensedById?: InputMaybe<Scalars["Int"]["input"]>;
  licensedById_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  licensedBy_in?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  minimumTagRank?: InputMaybe<Scalars["Int"]["input"]>;
  onList?: InputMaybe<Scalars["Boolean"]["input"]>;
  popularity?: InputMaybe<Scalars["Int"]["input"]>;
  popularity_greater?: InputMaybe<Scalars["Int"]["input"]>;
  popularity_lesser?: InputMaybe<Scalars["Int"]["input"]>;
  popularity_not?: InputMaybe<Scalars["Int"]["input"]>;
  search?: InputMaybe<Scalars["String"]["input"]>;
  season?: InputMaybe<MediaSeason>;
  seasonYear?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<Array<InputMaybe<MediaSort>>>;
  source?: InputMaybe<MediaSource>;
  source_in?: InputMaybe<Array<InputMaybe<MediaSource>>>;
  startDate?: InputMaybe<Scalars["FuzzyDateInt"]["input"]>;
  startDate_greater?: InputMaybe<Scalars["FuzzyDateInt"]["input"]>;
  startDate_lesser?: InputMaybe<Scalars["FuzzyDateInt"]["input"]>;
  startDate_like?: InputMaybe<Scalars["String"]["input"]>;
  status?: InputMaybe<MediaStatus>;
  status_in?: InputMaybe<Array<InputMaybe<MediaStatus>>>;
  status_not?: InputMaybe<MediaStatus>;
  status_not_in?: InputMaybe<Array<InputMaybe<MediaStatus>>>;
  tag?: InputMaybe<Scalars["String"]["input"]>;
  tagCategory?: InputMaybe<Scalars["String"]["input"]>;
  tagCategory_in?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  tagCategory_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  tag_in?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  tag_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  type?: InputMaybe<MediaType>;
  volumes?: InputMaybe<Scalars["Int"]["input"]>;
  volumes_greater?: InputMaybe<Scalars["Int"]["input"]>;
  volumes_lesser?: InputMaybe<Scalars["Int"]["input"]>;
}

/** Page of data (Used for internal use only) */
export interface InternalPageMediaListArgs {
  compareWithAuthList?: InputMaybe<Scalars["Boolean"]["input"]>;
  completedAt?: InputMaybe<Scalars["FuzzyDateInt"]["input"]>;
  completedAt_greater?: InputMaybe<Scalars["FuzzyDateInt"]["input"]>;
  completedAt_lesser?: InputMaybe<Scalars["FuzzyDateInt"]["input"]>;
  completedAt_like?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["Int"]["input"]>;
  isFollowing?: InputMaybe<Scalars["Boolean"]["input"]>;
  mediaId?: InputMaybe<Scalars["Int"]["input"]>;
  mediaId_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  mediaId_not_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  notes?: InputMaybe<Scalars["String"]["input"]>;
  notes_like?: InputMaybe<Scalars["String"]["input"]>;
  sort?: InputMaybe<Array<InputMaybe<MediaListSort>>>;
  startedAt?: InputMaybe<Scalars["FuzzyDateInt"]["input"]>;
  startedAt_greater?: InputMaybe<Scalars["FuzzyDateInt"]["input"]>;
  startedAt_lesser?: InputMaybe<Scalars["FuzzyDateInt"]["input"]>;
  startedAt_like?: InputMaybe<Scalars["String"]["input"]>;
  status?: InputMaybe<MediaListStatus>;
  status_in?: InputMaybe<Array<InputMaybe<MediaListStatus>>>;
  status_not?: InputMaybe<MediaListStatus>;
  status_not_in?: InputMaybe<Array<InputMaybe<MediaListStatus>>>;
  type?: InputMaybe<MediaType>;
  userId?: InputMaybe<Scalars["Int"]["input"]>;
  userId_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  userName?: InputMaybe<Scalars["String"]["input"]>;
}

/** Page of data (Used for internal use only) */
export interface InternalPageMediaSubmissionsArgs {
  assigneeId?: InputMaybe<Scalars["Int"]["input"]>;
  mediaId?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<Array<InputMaybe<SubmissionSort>>>;
  status?: InputMaybe<SubmissionStatus>;
  submissionId?: InputMaybe<Scalars["Int"]["input"]>;
  type?: InputMaybe<MediaType>;
  userId?: InputMaybe<Scalars["Int"]["input"]>;
}

/** Page of data (Used for internal use only) */
export interface InternalPageMediaTrendsArgs {
  averageScore?: InputMaybe<Scalars["Int"]["input"]>;
  averageScore_greater?: InputMaybe<Scalars["Int"]["input"]>;
  averageScore_lesser?: InputMaybe<Scalars["Int"]["input"]>;
  averageScore_not?: InputMaybe<Scalars["Int"]["input"]>;
  date?: InputMaybe<Scalars["Int"]["input"]>;
  date_greater?: InputMaybe<Scalars["Int"]["input"]>;
  date_lesser?: InputMaybe<Scalars["Int"]["input"]>;
  episode?: InputMaybe<Scalars["Int"]["input"]>;
  episode_greater?: InputMaybe<Scalars["Int"]["input"]>;
  episode_lesser?: InputMaybe<Scalars["Int"]["input"]>;
  episode_not?: InputMaybe<Scalars["Int"]["input"]>;
  mediaId?: InputMaybe<Scalars["Int"]["input"]>;
  mediaId_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  mediaId_not?: InputMaybe<Scalars["Int"]["input"]>;
  mediaId_not_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  popularity?: InputMaybe<Scalars["Int"]["input"]>;
  popularity_greater?: InputMaybe<Scalars["Int"]["input"]>;
  popularity_lesser?: InputMaybe<Scalars["Int"]["input"]>;
  popularity_not?: InputMaybe<Scalars["Int"]["input"]>;
  releasing?: InputMaybe<Scalars["Boolean"]["input"]>;
  sort?: InputMaybe<Array<InputMaybe<MediaTrendSort>>>;
  trending?: InputMaybe<Scalars["Int"]["input"]>;
  trending_greater?: InputMaybe<Scalars["Int"]["input"]>;
  trending_lesser?: InputMaybe<Scalars["Int"]["input"]>;
  trending_not?: InputMaybe<Scalars["Int"]["input"]>;
}

/** Page of data (Used for internal use only) */
export interface InternalPageModActionsArgs {
  modId?: InputMaybe<Scalars["Int"]["input"]>;
  userId?: InputMaybe<Scalars["Int"]["input"]>;
}

/** Page of data (Used for internal use only) */
export interface InternalPageNotificationsArgs {
  resetNotificationCount?: InputMaybe<Scalars["Boolean"]["input"]>;
  type?: InputMaybe<NotificationType>;
  type_in?: InputMaybe<Array<InputMaybe<NotificationType>>>;
}

/** Page of data (Used for internal use only) */
export interface InternalPageRecommendationsArgs {
  id?: InputMaybe<Scalars["Int"]["input"]>;
  mediaId?: InputMaybe<Scalars["Int"]["input"]>;
  mediaRecommendationId?: InputMaybe<Scalars["Int"]["input"]>;
  onList?: InputMaybe<Scalars["Boolean"]["input"]>;
  rating?: InputMaybe<Scalars["Int"]["input"]>;
  rating_greater?: InputMaybe<Scalars["Int"]["input"]>;
  rating_lesser?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<Array<InputMaybe<RecommendationSort>>>;
  userId?: InputMaybe<Scalars["Int"]["input"]>;
}

/** Page of data (Used for internal use only) */
export interface InternalPageReportsArgs {
  reportedId?: InputMaybe<Scalars["Int"]["input"]>;
  reporterId?: InputMaybe<Scalars["Int"]["input"]>;
}

/** Page of data (Used for internal use only) */
export interface InternalPageReviewsArgs {
  id?: InputMaybe<Scalars["Int"]["input"]>;
  mediaId?: InputMaybe<Scalars["Int"]["input"]>;
  mediaType?: InputMaybe<MediaType>;
  sort?: InputMaybe<Array<InputMaybe<ReviewSort>>>;
  userId?: InputMaybe<Scalars["Int"]["input"]>;
}

/** Page of data (Used for internal use only) */
export interface InternalPageRevisionHistoryArgs {
  characterId?: InputMaybe<Scalars["Int"]["input"]>;
  mediaId?: InputMaybe<Scalars["Int"]["input"]>;
  staffId?: InputMaybe<Scalars["Int"]["input"]>;
  studioId?: InputMaybe<Scalars["Int"]["input"]>;
  userId?: InputMaybe<Scalars["Int"]["input"]>;
}

/** Page of data (Used for internal use only) */
export interface InternalPageStaffArgs {
  id?: InputMaybe<Scalars["Int"]["input"]>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  id_not?: InputMaybe<Scalars["Int"]["input"]>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  isBirthday?: InputMaybe<Scalars["Boolean"]["input"]>;
  search?: InputMaybe<Scalars["String"]["input"]>;
  sort?: InputMaybe<Array<InputMaybe<StaffSort>>>;
}

/** Page of data (Used for internal use only) */
export interface InternalPageStaffSubmissionsArgs {
  assigneeId?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<Array<InputMaybe<SubmissionSort>>>;
  staffId?: InputMaybe<Scalars["Int"]["input"]>;
  status?: InputMaybe<SubmissionStatus>;
  userId?: InputMaybe<Scalars["Int"]["input"]>;
}

/** Page of data (Used for internal use only) */
export interface InternalPageStudiosArgs {
  id?: InputMaybe<Scalars["Int"]["input"]>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  id_not?: InputMaybe<Scalars["Int"]["input"]>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  search?: InputMaybe<Scalars["String"]["input"]>;
  sort?: InputMaybe<Array<InputMaybe<StudioSort>>>;
}

/** Page of data (Used for internal use only) */
export interface InternalPageThreadCommentsArgs {
  id?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<Array<InputMaybe<ThreadCommentSort>>>;
  threadId?: InputMaybe<Scalars["Int"]["input"]>;
  userId?: InputMaybe<Scalars["Int"]["input"]>;
}

/** Page of data (Used for internal use only) */
export interface InternalPageThreadsArgs {
  categoryId?: InputMaybe<Scalars["Int"]["input"]>;
  id?: InputMaybe<Scalars["Int"]["input"]>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  mediaCategoryId?: InputMaybe<Scalars["Int"]["input"]>;
  replyUserId?: InputMaybe<Scalars["Int"]["input"]>;
  search?: InputMaybe<Scalars["String"]["input"]>;
  sort?: InputMaybe<Array<InputMaybe<ThreadSort>>>;
  subscribed?: InputMaybe<Scalars["Boolean"]["input"]>;
  userId?: InputMaybe<Scalars["Int"]["input"]>;
}

/** Page of data (Used for internal use only) */
export interface InternalPageUserBlockSearchArgs {
  search?: InputMaybe<Scalars["String"]["input"]>;
}

/** Page of data (Used for internal use only) */
export interface InternalPageUsersArgs {
  id?: InputMaybe<Scalars["Int"]["input"]>;
  isModerator?: InputMaybe<Scalars["Boolean"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  search?: InputMaybe<Scalars["String"]["input"]>;
  sort?: InputMaybe<Array<InputMaybe<UserSort>>>;
}

/** Types that can be liked */
export enum LikeableType {
  Activity = "ACTIVITY",
  ActivityReply = "ACTIVITY_REPLY",
  Thread = "THREAD",
  ThreadComment = "THREAD_COMMENT",
}

/** Likeable union type */
export type LikeableUnion = ActivityReply | ListActivity | MessageActivity | TextActivity | Thread | ThreadComment;

/** User list activity (anime & manga updates) */
export interface ListActivity {
  __typename?: "ListActivity";
  /** The time the activity was created at */
  createdAt: Scalars["Int"]["output"];
  /** The id of the activity */
  id: Scalars["Int"]["output"];
  /** If the currently authenticated user liked the activity */
  isLiked?: Maybe<Scalars["Boolean"]["output"]>;
  /** If the activity is locked and can receive replies */
  isLocked?: Maybe<Scalars["Boolean"]["output"]>;
  /** If the activity is pinned to the top of the users activity feed */
  isPinned?: Maybe<Scalars["Boolean"]["output"]>;
  /** If the currently authenticated user is subscribed to the activity */
  isSubscribed?: Maybe<Scalars["Boolean"]["output"]>;
  /** The amount of likes the activity has */
  likeCount: Scalars["Int"]["output"];
  /** The users who liked the activity */
  likes?: Maybe<Array<Maybe<User>>>;
  /** The associated media to the activity update */
  media?: Maybe<Media>;
  /** The list progress made */
  progress?: Maybe<Scalars["String"]["output"]>;
  /** The written replies to the activity */
  replies?: Maybe<Array<Maybe<ActivityReply>>>;
  /** The number of activity replies */
  replyCount: Scalars["Int"]["output"];
  /** The url for the activity page on the AniList website */
  siteUrl?: Maybe<Scalars["String"]["output"]>;
  /** The list item's textual status */
  status?: Maybe<Scalars["String"]["output"]>;
  /** The type of activity */
  type?: Maybe<ActivityType>;
  /** The owner of the activity */
  user?: Maybe<User>;
  /** The user id of the activity's creator */
  userId?: Maybe<Scalars["Int"]["output"]>;
}

export interface ListActivityOption {
  __typename?: "ListActivityOption";
  disabled?: Maybe<Scalars["Boolean"]["output"]>;
  type?: Maybe<MediaListStatus>;
}

export interface ListActivityOptionInput {
  disabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  type?: InputMaybe<MediaListStatus>;
}

/** User's list score statistics */
export interface ListScoreStats {
  __typename?: "ListScoreStats";
  meanScore?: Maybe<Scalars["Int"]["output"]>;
  standardDeviation?: Maybe<Scalars["Int"]["output"]>;
}

/** Anime or Manga */
export interface Media {
  __typename?: "Media";
  /** The media's entire airing schedule */
  airingSchedule?: Maybe<AiringScheduleConnection>;
  /** If the media should have forum thread automatically created for it on airing episode release */
  autoCreateForumThread?: Maybe<Scalars["Boolean"]["output"]>;
  /** A weighted average score of all the user's scores of the media */
  averageScore?: Maybe<Scalars["Int"]["output"]>;
  /** The banner image of the media */
  bannerImage?: Maybe<Scalars["String"]["output"]>;
  /** The amount of chapters the manga has when complete */
  chapters?: Maybe<Scalars["Int"]["output"]>;
  /** The characters in the media */
  characters?: Maybe<CharacterConnection>;
  /** Where the media was created. (ISO 3166-1 alpha-2) */
  countryOfOrigin?: Maybe<Scalars["CountryCode"]["output"]>;
  /** The cover images of the media */
  coverImage?: Maybe<MediaCoverImage>;
  /** Short description of the media's story and characters */
  description?: Maybe<Scalars["String"]["output"]>;
  /** The general length of each anime episode in minutes */
  duration?: Maybe<Scalars["Int"]["output"]>;
  /** The last official release date of the media */
  endDate?: Maybe<FuzzyDate>;
  /** The amount of episodes the anime has when complete */
  episodes?: Maybe<Scalars["Int"]["output"]>;
  /** External links to another site related to the media */
  externalLinks?: Maybe<Array<Maybe<MediaExternalLink>>>;
  /** The amount of user's who have favourited the media */
  favourites?: Maybe<Scalars["Int"]["output"]>;
  /** The format the media was released in */
  format?: Maybe<MediaFormat>;
  /** The genres of the media */
  genres?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  /** Official Twitter hashtags for the media */
  hashtag?: Maybe<Scalars["String"]["output"]>;
  /** The id of the media */
  id: Scalars["Int"]["output"];
  /** The mal id of the media */
  idMal?: Maybe<Scalars["Int"]["output"]>;
  /** If the media is intended only for 18+ adult audiences */
  isAdult?: Maybe<Scalars["Boolean"]["output"]>;
  /** If the media is marked as favourite by the current authenticated user */
  isFavourite: Scalars["Boolean"]["output"];
  /** If the media is blocked from being added to favourites */
  isFavouriteBlocked: Scalars["Boolean"]["output"];
  /** If the media is officially licensed or a self-published doujin release */
  isLicensed?: Maybe<Scalars["Boolean"]["output"]>;
  /** Locked media may not be added to lists our favorited. This may be due to the entry pending for deletion or other reasons. */
  isLocked?: Maybe<Scalars["Boolean"]["output"]>;
  /** If the media is blocked from being recommended to/from */
  isRecommendationBlocked?: Maybe<Scalars["Boolean"]["output"]>;
  /** If the media is blocked from being reviewed */
  isReviewBlocked?: Maybe<Scalars["Boolean"]["output"]>;
  /** Mean score of all the user's scores of the media */
  meanScore?: Maybe<Scalars["Int"]["output"]>;
  /** The authenticated user's media list entry for the media */
  mediaListEntry?: Maybe<MediaList>;
  /** Notes for site moderators */
  modNotes?: Maybe<Scalars["String"]["output"]>;
  /** The media's next episode airing schedule */
  nextAiringEpisode?: Maybe<AiringSchedule>;
  /** The number of users with the media on their list */
  popularity?: Maybe<Scalars["Int"]["output"]>;
  /** The ranking of the media in a particular time span and format compared to other media */
  rankings?: Maybe<Array<Maybe<MediaRank>>>;
  /** User recommendations for similar media */
  recommendations?: Maybe<RecommendationConnection>;
  /** Other media in the same or connecting franchise */
  relations?: Maybe<MediaConnection>;
  /** User reviews of the media */
  reviews?: Maybe<ReviewConnection>;
  /** The season the media was initially released in */
  season?: Maybe<MediaSeason>;
  /**
   * The year & season the media was initially released in
   * @deprecated
   */
  seasonInt?: Maybe<Scalars["Int"]["output"]>;
  /** The season year the media was initially released in */
  seasonYear?: Maybe<Scalars["Int"]["output"]>;
  /** The url for the media page on the AniList website */
  siteUrl?: Maybe<Scalars["String"]["output"]>;
  /** Source type the media was adapted from. */
  source?: Maybe<MediaSource>;
  /** The staff who produced the media */
  staff?: Maybe<StaffConnection>;
  /** The first official release date of the media */
  startDate?: Maybe<FuzzyDate>;
  stats?: Maybe<MediaStats>;
  /** The current releasing status of the media */
  status?: Maybe<MediaStatus>;
  /** Data and links to legal streaming episodes on external sites */
  streamingEpisodes?: Maybe<Array<Maybe<MediaStreamingEpisode>>>;
  /** The companies who produced the media */
  studios?: Maybe<StudioConnection>;
  /** Alternative titles of the media */
  synonyms?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  /** List of tags that describes elements and themes of the media */
  tags?: Maybe<Array<Maybe<MediaTag>>>;
  /** The official titles of the media in various languages */
  title?: Maybe<MediaTitle>;
  /** Media trailer or advertisement */
  trailer?: Maybe<MediaTrailer>;
  /** The amount of related activity in the past hour */
  trending?: Maybe<Scalars["Int"]["output"]>;
  /** The media's daily trend stats */
  trends?: Maybe<MediaTrendConnection>;
  /** The type of the media; anime or manga */
  type?: Maybe<MediaType>;
  /** When the media's data was last updated */
  updatedAt?: Maybe<Scalars["Int"]["output"]>;
  /** The amount of volumes the manga has when complete */
  volumes?: Maybe<Scalars["Int"]["output"]>;
}

/** Anime or Manga */
export interface MediaAiringScheduleArgs {
  notYetAired?: InputMaybe<Scalars["Boolean"]["input"]>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
  perPage?: InputMaybe<Scalars["Int"]["input"]>;
}

/** Anime or Manga */
export interface MediaCharactersArgs {
  page?: InputMaybe<Scalars["Int"]["input"]>;
  perPage?: InputMaybe<Scalars["Int"]["input"]>;
  role?: InputMaybe<CharacterRole>;
  sort?: InputMaybe<Array<InputMaybe<CharacterSort>>>;
}

/** Anime or Manga */
export interface MediaDescriptionArgs {
  asHtml?: InputMaybe<Scalars["Boolean"]["input"]>;
}

/** Anime or Manga */
export interface MediaRecommendationsArgs {
  page?: InputMaybe<Scalars["Int"]["input"]>;
  perPage?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<Array<InputMaybe<RecommendationSort>>>;
}

/** Anime or Manga */
export interface MediaReviewsArgs {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
  perPage?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<Array<InputMaybe<ReviewSort>>>;
}

/** Anime or Manga */
export interface MediaSourceArgs {
  version?: InputMaybe<Scalars["Int"]["input"]>;
}

/** Anime or Manga */
export interface MediaStaffArgs {
  page?: InputMaybe<Scalars["Int"]["input"]>;
  perPage?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<Array<InputMaybe<StaffSort>>>;
}

/** Anime or Manga */
export interface MediaStatusArgs {
  version?: InputMaybe<Scalars["Int"]["input"]>;
}

/** Anime or Manga */
export interface MediaStudiosArgs {
  isMain?: InputMaybe<Scalars["Boolean"]["input"]>;
  sort?: InputMaybe<Array<InputMaybe<StudioSort>>>;
}

/** Anime or Manga */
export interface MediaTrendsArgs {
  page?: InputMaybe<Scalars["Int"]["input"]>;
  perPage?: InputMaybe<Scalars["Int"]["input"]>;
  releasing?: InputMaybe<Scalars["Boolean"]["input"]>;
  sort?: InputMaybe<Array<InputMaybe<MediaTrendSort>>>;
}

/** Internal - Media characters separated */
export interface MediaCharacter {
  __typename?: "MediaCharacter";
  /** The characters in the media voiced by the parent actor */
  character?: Maybe<Character>;
  /** Media specific character name */
  characterName?: Maybe<Scalars["String"]["output"]>;
  dubGroup?: Maybe<Scalars["String"]["output"]>;
  /** The id of the connection */
  id?: Maybe<Scalars["Int"]["output"]>;
  /** The characters role in the media */
  role?: Maybe<CharacterRole>;
  roleNotes?: Maybe<Scalars["String"]["output"]>;
  /** The voice actor of the character */
  voiceActor?: Maybe<Staff>;
}

export interface MediaConnection {
  __typename?: "MediaConnection";
  edges?: Maybe<Array<Maybe<MediaEdge>>>;
  nodes?: Maybe<Array<Maybe<Media>>>;
  /** The pagination information */
  pageInfo?: Maybe<PageInfo>;
}

export interface MediaCoverImage {
  __typename?: "MediaCoverImage";
  /** Average #hex color of cover image */
  color?: Maybe<Scalars["String"]["output"]>;
  /** The cover image url of the media at its largest size. If this size isn't available, large will be provided instead. */
  extraLarge?: Maybe<Scalars["String"]["output"]>;
  /** The cover image url of the media at a large size */
  large?: Maybe<Scalars["String"]["output"]>;
  /** The cover image url of the media at medium size */
  medium?: Maybe<Scalars["String"]["output"]>;
}

/** Notification for when a media entry's data was changed in a significant way impacting users' list tracking */
export interface MediaDataChangeNotification {
  __typename?: "MediaDataChangeNotification";
  /** The reason for the media data change */
  context?: Maybe<Scalars["String"]["output"]>;
  /** The time the notification was created at */
  createdAt?: Maybe<Scalars["Int"]["output"]>;
  /** The id of the Notification */
  id: Scalars["Int"]["output"];
  /** The media that received data changes */
  media?: Maybe<Media>;
  /** The id of the media that received data changes */
  mediaId: Scalars["Int"]["output"];
  /** The reason for the media data change */
  reason?: Maybe<Scalars["String"]["output"]>;
  /** The type of notification */
  type?: Maybe<NotificationType>;
}

/** Notification for when a media tracked in a user's list is deleted from the site */
export interface MediaDeletionNotification {
  __typename?: "MediaDeletionNotification";
  /** The reason for the media deletion */
  context?: Maybe<Scalars["String"]["output"]>;
  /** The time the notification was created at */
  createdAt?: Maybe<Scalars["Int"]["output"]>;
  /** The title of the deleted media */
  deletedMediaTitle?: Maybe<Scalars["String"]["output"]>;
  /** The id of the Notification */
  id: Scalars["Int"]["output"];
  /** The reason for the media deletion */
  reason?: Maybe<Scalars["String"]["output"]>;
  /** The type of notification */
  type?: Maybe<NotificationType>;
}

/** Media connection edge */
export interface MediaEdge {
  __typename?: "MediaEdge";
  /** Media specific character name */
  characterName?: Maybe<Scalars["String"]["output"]>;
  /** The characters role in the media */
  characterRole?: Maybe<CharacterRole>;
  /** The characters in the media voiced by the parent actor */
  characters?: Maybe<Array<Maybe<Character>>>;
  /** Used for grouping roles where multiple dubs exist for the same language. Either dubbing company name or language variant. */
  dubGroup?: Maybe<Scalars["String"]["output"]>;
  /** The order the media should be displayed from the users favourites */
  favouriteOrder?: Maybe<Scalars["Int"]["output"]>;
  /** The id of the connection */
  id?: Maybe<Scalars["Int"]["output"]>;
  /** If the studio is the main animation studio of the media (For Studio->MediaConnection field only) */
  isMainStudio: Scalars["Boolean"]["output"];
  node?: Maybe<Media>;
  /** The type of relation to the parent model */
  relationType?: Maybe<MediaRelation>;
  /** Notes regarding the VA's role for the character */
  roleNotes?: Maybe<Scalars["String"]["output"]>;
  /** The role of the staff member in the production of the media */
  staffRole?: Maybe<Scalars["String"]["output"]>;
  /** The voice actors of the character with role date */
  voiceActorRoles?: Maybe<Array<Maybe<StaffRoleType>>>;
  /** The voice actors of the character */
  voiceActors?: Maybe<Array<Maybe<Staff>>>;
}

/** Media connection edge */
export interface MediaEdgeRelationTypeArgs {
  version?: InputMaybe<Scalars["Int"]["input"]>;
}

/** Media connection edge */
export interface MediaEdgeVoiceActorRolesArgs {
  language?: InputMaybe<StaffLanguage>;
  sort?: InputMaybe<Array<InputMaybe<StaffSort>>>;
}

/** Media connection edge */
export interface MediaEdgeVoiceActorsArgs {
  language?: InputMaybe<StaffLanguage>;
  sort?: InputMaybe<Array<InputMaybe<StaffSort>>>;
}

/** An external link to another site related to the media or staff member */
export interface MediaExternalLink {
  __typename?: "MediaExternalLink";
  color?: Maybe<Scalars["String"]["output"]>;
  /** The icon image url of the site. Not available for all links. Transparent PNG 64x64 */
  icon?: Maybe<Scalars["String"]["output"]>;
  /** The id of the external link */
  id: Scalars["Int"]["output"];
  isDisabled?: Maybe<Scalars["Boolean"]["output"]>;
  /** Language the site content is in. See Staff language field for values. */
  language?: Maybe<Scalars["String"]["output"]>;
  notes?: Maybe<Scalars["String"]["output"]>;
  /** The links website site name */
  site: Scalars["String"]["output"];
  /** The links website site id */
  siteId?: Maybe<Scalars["Int"]["output"]>;
  type?: Maybe<ExternalLinkType>;
  /** The url of the external link or base url of link source */
  url?: Maybe<Scalars["String"]["output"]>;
}

/** An external link to another site related to the media */
export interface MediaExternalLinkInput {
  /** The id of the external link */
  id: Scalars["Int"]["input"];
  /** The site location of the external link */
  site: Scalars["String"]["input"];
  /** The url of the external link */
  url: Scalars["String"]["input"];
}

/** The format the media was released in */
export enum MediaFormat {
  /** Professionally published manga with more than one chapter */
  Manga = "MANGA",
  /** Anime movies with a theatrical release */
  Movie = "MOVIE",
  /** Short anime released as a music video */
  Music = "MUSIC",
  /** Written books released as a series of light novels */
  Novel = "NOVEL",
  /** (Original Net Animation) Anime that have been originally released online or are only available through streaming services. */
  Ona = "ONA",
  /** Manga with just one chapter */
  OneShot = "ONE_SHOT",
  /** (Original Video Animation) Anime that have been released directly on DVD/Blu-ray without originally going through a theatrical release or television broadcast */
  Ova = "OVA",
  /** Special episodes that have been included in DVD/Blu-ray releases, picture dramas, pilots, etc */
  Special = "SPECIAL",
  /** Anime broadcast on television */
  Tv = "TV",
  /** Anime which are under 15 minutes in length and broadcast on television */
  TvShort = "TV_SHORT",
}

/** List of anime or manga */
export interface MediaList {
  __typename?: "MediaList";
  /** Map of advanced scores with name keys */
  advancedScores?: Maybe<Scalars["Json"]["output"]>;
  /** When the entry was completed by the user */
  completedAt?: Maybe<FuzzyDate>;
  /** When the entry data was created */
  createdAt?: Maybe<Scalars["Int"]["output"]>;
  /** Map of booleans for which custom lists the entry are in */
  customLists?: Maybe<Scalars["Json"]["output"]>;
  /** If the entry shown be hidden from non-custom lists */
  hiddenFromStatusLists?: Maybe<Scalars["Boolean"]["output"]>;
  /** The id of the list entry */
  id: Scalars["Int"]["output"];
  media?: Maybe<Media>;
  /** The id of the media */
  mediaId: Scalars["Int"]["output"];
  /** Text notes */
  notes?: Maybe<Scalars["String"]["output"]>;
  /** Priority of planning */
  priority?: Maybe<Scalars["Int"]["output"]>;
  /** If the entry should only be visible to authenticated user */
  private?: Maybe<Scalars["Boolean"]["output"]>;
  /** The amount of episodes/chapters consumed by the user */
  progress?: Maybe<Scalars["Int"]["output"]>;
  /** The amount of volumes read by the user */
  progressVolumes?: Maybe<Scalars["Int"]["output"]>;
  /** The amount of times the user has rewatched/read the media */
  repeat?: Maybe<Scalars["Int"]["output"]>;
  /** The score of the entry */
  score?: Maybe<Scalars["Float"]["output"]>;
  /** When the entry was started by the user */
  startedAt?: Maybe<FuzzyDate>;
  /** The watching/reading status */
  status?: Maybe<MediaListStatus>;
  /** When the entry data was last updated */
  updatedAt?: Maybe<Scalars["Int"]["output"]>;
  user?: Maybe<User>;
  /** The id of the user owner of the list entry */
  userId: Scalars["Int"]["output"];
}

/** List of anime or manga */
export interface MediaListCustomListsArgs {
  asArray?: InputMaybe<Scalars["Boolean"]["input"]>;
}

/** List of anime or manga */
export interface MediaListScoreArgs {
  format?: InputMaybe<ScoreFormat>;
}

/** List of anime or manga */
export interface MediaListCollection {
  __typename?: "MediaListCollection";
  /**
   * A map of media list entry arrays grouped by custom lists
   * @deprecated Not GraphQL spec compliant, use lists field instead.
   */
  customLists?: Maybe<Array<Maybe<Array<Maybe<MediaList>>>>>;
  /** If there is another chunk */
  hasNextChunk?: Maybe<Scalars["Boolean"]["output"]>;
  /** Grouped media list entries */
  lists?: Maybe<Array<Maybe<MediaListGroup>>>;
  /**
   * A map of media list entry arrays grouped by status
   * @deprecated Not GraphQL spec compliant, use lists field instead.
   */
  statusLists?: Maybe<Array<Maybe<Array<Maybe<MediaList>>>>>;
  /** The owner of the list */
  user?: Maybe<User>;
}

/** List of anime or manga */
export interface MediaListCollectionCustomListsArgs {
  asArray?: InputMaybe<Scalars["Boolean"]["input"]>;
}

/** List of anime or manga */
export interface MediaListCollectionStatusListsArgs {
  asArray?: InputMaybe<Scalars["Boolean"]["input"]>;
}

/** List group of anime or manga entries */
export interface MediaListGroup {
  __typename?: "MediaListGroup";
  /** Media list entries */
  entries?: Maybe<Array<Maybe<MediaList>>>;
  isCustomList?: Maybe<Scalars["Boolean"]["output"]>;
  isSplitCompletedList?: Maybe<Scalars["Boolean"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
  status?: Maybe<MediaListStatus>;
}

/** A user's list options */
export interface MediaListOptions {
  __typename?: "MediaListOptions";
  /** The user's anime list options */
  animeList?: Maybe<MediaListTypeOptions>;
  /** The user's manga list options */
  mangaList?: Maybe<MediaListTypeOptions>;
  /** The default order list rows should be displayed in */
  rowOrder?: Maybe<Scalars["String"]["output"]>;
  /** The score format the user is using for media lists */
  scoreFormat?: Maybe<ScoreFormat>;
  /**
   * The list theme options for both lists
   * @deprecated No longer used
   */
  sharedTheme?: Maybe<Scalars["Json"]["output"]>;
  /**
   * If the shared theme should be used instead of the individual list themes
   * @deprecated No longer used
   */
  sharedThemeEnabled?: Maybe<Scalars["Boolean"]["output"]>;
  /** @deprecated No longer used */
  useLegacyLists?: Maybe<Scalars["Boolean"]["output"]>;
}

/** A user's list options for anime or manga lists */
export interface MediaListOptionsInput {
  /** The names of the user's advanced scoring sections */
  advancedScoring?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  /** If advanced scoring is enabled */
  advancedScoringEnabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** The names of the user's custom lists */
  customLists?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  /** The order each list should be displayed in */
  sectionOrder?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  /** If the completed sections of the list should be separated by format */
  splitCompletedSectionByFormat?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** list theme */
  theme?: InputMaybe<Scalars["String"]["input"]>;
}

/** Media list sort enums */
export enum MediaListSort {
  AddedTime = "ADDED_TIME",
  AddedTimeDesc = "ADDED_TIME_DESC",
  FinishedOn = "FINISHED_ON",
  FinishedOnDesc = "FINISHED_ON_DESC",
  MediaId = "MEDIA_ID",
  MediaIdDesc = "MEDIA_ID_DESC",
  MediaPopularity = "MEDIA_POPULARITY",
  MediaPopularityDesc = "MEDIA_POPULARITY_DESC",
  MediaTitleEnglish = "MEDIA_TITLE_ENGLISH",
  MediaTitleEnglishDesc = "MEDIA_TITLE_ENGLISH_DESC",
  MediaTitleNative = "MEDIA_TITLE_NATIVE",
  MediaTitleNativeDesc = "MEDIA_TITLE_NATIVE_DESC",
  MediaTitleRomaji = "MEDIA_TITLE_ROMAJI",
  MediaTitleRomajiDesc = "MEDIA_TITLE_ROMAJI_DESC",
  Priority = "PRIORITY",
  PriorityDesc = "PRIORITY_DESC",
  Progress = "PROGRESS",
  ProgressDesc = "PROGRESS_DESC",
  ProgressVolumes = "PROGRESS_VOLUMES",
  ProgressVolumesDesc = "PROGRESS_VOLUMES_DESC",
  Repeat = "REPEAT",
  RepeatDesc = "REPEAT_DESC",
  Score = "SCORE",
  ScoreDesc = "SCORE_DESC",
  StartedOn = "STARTED_ON",
  StartedOnDesc = "STARTED_ON_DESC",
  Status = "STATUS",
  StatusDesc = "STATUS_DESC",
  UpdatedTime = "UPDATED_TIME",
  UpdatedTimeDesc = "UPDATED_TIME_DESC",
}

/** Media list watching/reading status enum. */
export enum MediaListStatus {
  /** Finished watching/reading */
  Completed = "COMPLETED",
  /** Currently watching/reading */
  Current = "CURRENT",
  /** Stopped watching/reading before completing */
  Dropped = "DROPPED",
  /** Paused watching/reading */
  Paused = "PAUSED",
  /** Planning to watch/read */
  Planning = "PLANNING",
  /** Re-watching/reading */
  Repeating = "REPEATING",
}

/** A user's list options for anime or manga lists */
export interface MediaListTypeOptions {
  __typename?: "MediaListTypeOptions";
  /** The names of the user's advanced scoring sections */
  advancedScoring?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  /** If advanced scoring is enabled */
  advancedScoringEnabled?: Maybe<Scalars["Boolean"]["output"]>;
  /** The names of the user's custom lists */
  customLists?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  /** The order each list should be displayed in */
  sectionOrder?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  /** If the completed sections of the list should be separated by format */
  splitCompletedSectionByFormat?: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * The list theme options
   * @deprecated This field has not yet been fully implemented and may change without warning
   */
  theme?: Maybe<Scalars["Json"]["output"]>;
}

/** Notification for when a media entry is merged into another for a user who had it on their list */
export interface MediaMergeNotification {
  __typename?: "MediaMergeNotification";
  /** The reason for the media data change */
  context?: Maybe<Scalars["String"]["output"]>;
  /** The time the notification was created at */
  createdAt?: Maybe<Scalars["Int"]["output"]>;
  /** The title of the deleted media */
  deletedMediaTitles?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  /** The id of the Notification */
  id: Scalars["Int"]["output"];
  /** The media that was merged into */
  media?: Maybe<Media>;
  /** The id of the media that was merged into */
  mediaId: Scalars["Int"]["output"];
  /** The reason for the media merge */
  reason?: Maybe<Scalars["String"]["output"]>;
  /** The type of notification */
  type?: Maybe<NotificationType>;
}

/** The ranking of a media in a particular time span and format compared to other media */
export interface MediaRank {
  __typename?: "MediaRank";
  /** If the ranking is based on all time instead of a season/year */
  allTime?: Maybe<Scalars["Boolean"]["output"]>;
  /** String that gives context to the ranking type and time span */
  context: Scalars["String"]["output"];
  /** The format the media is ranked within */
  format: MediaFormat;
  /** The id of the rank */
  id: Scalars["Int"]["output"];
  /** The numerical rank of the media */
  rank: Scalars["Int"]["output"];
  /** The season the media is ranked within */
  season?: Maybe<MediaSeason>;
  /** The type of ranking */
  type: MediaRankType;
  /** The year the media is ranked within */
  year?: Maybe<Scalars["Int"]["output"]>;
}

/** The type of ranking */
export enum MediaRankType {
  /** Ranking is based on the media's popularity */
  Popular = "POPULAR",
  /** Ranking is based on the media's ratings/score */
  Rated = "RATED",
}

/** Type of relation media has to its parent. */
export enum MediaRelation {
  /** An adaption of this media into a different format */
  Adaptation = "ADAPTATION",
  /** An alternative version of the same media */
  Alternative = "ALTERNATIVE",
  /** Shares at least 1 character */
  Character = "CHARACTER",
  /** Version 2 only. */
  Compilation = "COMPILATION",
  /** Version 2 only. */
  Contains = "CONTAINS",
  /** Other */
  Other = "OTHER",
  /** The media a side story is from */
  Parent = "PARENT",
  /** Released before the relation */
  Prequel = "PREQUEL",
  /** Released after the relation */
  Sequel = "SEQUEL",
  /** A side story of the parent media */
  SideStory = "SIDE_STORY",
  /** Version 2 only. The source material the media was adapted from */
  Source = "SOURCE",
  /** An alternative version of the media with a different primary focus */
  SpinOff = "SPIN_OFF",
  /** A shortened and summarized version */
  Summary = "SUMMARY",
}

export enum MediaSeason {
  /** Months September to November */
  Fall = "FALL",
  /** Months March to May */
  Spring = "SPRING",
  /** Months June to August */
  Summer = "SUMMER",
  /** Months December to February */
  Winter = "WINTER",
}

/** Media sort enums */
export enum MediaSort {
  Chapters = "CHAPTERS",
  ChaptersDesc = "CHAPTERS_DESC",
  Duration = "DURATION",
  DurationDesc = "DURATION_DESC",
  EndDate = "END_DATE",
  EndDateDesc = "END_DATE_DESC",
  Episodes = "EPISODES",
  EpisodesDesc = "EPISODES_DESC",
  Favourites = "FAVOURITES",
  FavouritesDesc = "FAVOURITES_DESC",
  Format = "FORMAT",
  FormatDesc = "FORMAT_DESC",
  Id = "ID",
  IdDesc = "ID_DESC",
  Popularity = "POPULARITY",
  PopularityDesc = "POPULARITY_DESC",
  Score = "SCORE",
  ScoreDesc = "SCORE_DESC",
  SearchMatch = "SEARCH_MATCH",
  StartDate = "START_DATE",
  StartDateDesc = "START_DATE_DESC",
  Status = "STATUS",
  StatusDesc = "STATUS_DESC",
  TitleEnglish = "TITLE_ENGLISH",
  TitleEnglishDesc = "TITLE_ENGLISH_DESC",
  TitleNative = "TITLE_NATIVE",
  TitleNativeDesc = "TITLE_NATIVE_DESC",
  TitleRomaji = "TITLE_ROMAJI",
  TitleRomajiDesc = "TITLE_ROMAJI_DESC",
  Trending = "TRENDING",
  TrendingDesc = "TRENDING_DESC",
  Type = "TYPE",
  TypeDesc = "TYPE_DESC",
  UpdatedAt = "UPDATED_AT",
  UpdatedAtDesc = "UPDATED_AT_DESC",
  Volumes = "VOLUMES",
  VolumesDesc = "VOLUMES_DESC",
}

/** Source type the media was adapted from */
export enum MediaSource {
  /** Version 2+ only. Japanese Anime */
  Anime = "ANIME",
  /** Version 3 only. Comics excluding manga */
  Comic = "COMIC",
  /** Version 2+ only. Self-published works */
  Doujinshi = "DOUJINSHI",
  /** Version 3 only. Games excluding video games */
  Game = "GAME",
  /** Written work published in volumes */
  LightNovel = "LIGHT_NOVEL",
  /** Version 3 only. Live action media such as movies or TV show */
  LiveAction = "LIVE_ACTION",
  /** Asian comic book */
  Manga = "MANGA",
  /** Version 3 only. Multimedia project */
  MultimediaProject = "MULTIMEDIA_PROJECT",
  /** Version 2+ only. Written works not published in volumes */
  Novel = "NOVEL",
  /** An original production not based of another work */
  Original = "ORIGINAL",
  /** Other */
  Other = "OTHER",
  /** Version 3 only. Picture book */
  PictureBook = "PICTURE_BOOK",
  /** Video game */
  VideoGame = "VIDEO_GAME",
  /** Video game driven primary by text and narrative */
  VisualNovel = "VISUAL_NOVEL",
  /** Version 3 only. Written works published online */
  WebNovel = "WEB_NOVEL",
}

/** A media's statistics */
export interface MediaStats {
  __typename?: "MediaStats";
  /** @deprecated Replaced by MediaTrends */
  airingProgression?: Maybe<Array<Maybe<AiringProgression>>>;
  scoreDistribution?: Maybe<Array<Maybe<ScoreDistribution>>>;
  statusDistribution?: Maybe<Array<Maybe<StatusDistribution>>>;
}

/** The current releasing status of the media */
export enum MediaStatus {
  /** Ended before the work could be finished */
  Cancelled = "CANCELLED",
  /** Has completed and is no longer being released */
  Finished = "FINISHED",
  /** Version 2 only. Is currently paused from releasing and will resume at a later date */
  Hiatus = "HIATUS",
  /** To be released at a later date */
  NotYetReleased = "NOT_YET_RELEASED",
  /** Currently releasing */
  Releasing = "RELEASING",
}

/** Data and links to legal streaming episodes on external sites */
export interface MediaStreamingEpisode {
  __typename?: "MediaStreamingEpisode";
  /** The site location of the streaming episodes */
  site?: Maybe<Scalars["String"]["output"]>;
  /** Url of episode image thumbnail */
  thumbnail?: Maybe<Scalars["String"]["output"]>;
  /** Title of the episode */
  title?: Maybe<Scalars["String"]["output"]>;
  /** The url of the episode */
  url?: Maybe<Scalars["String"]["output"]>;
}

/** Media submission */
export interface MediaSubmission {
  __typename?: "MediaSubmission";
  /** Data Mod assigned to handle the submission */
  assignee?: Maybe<User>;
  changes?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  characters?: Maybe<Array<Maybe<MediaSubmissionComparison>>>;
  createdAt?: Maybe<Scalars["Int"]["output"]>;
  externalLinks?: Maybe<Array<Maybe<MediaSubmissionComparison>>>;
  /** The id of the submission */
  id: Scalars["Int"]["output"];
  /** Whether the submission is locked */
  locked?: Maybe<Scalars["Boolean"]["output"]>;
  media?: Maybe<Media>;
  notes?: Maybe<Scalars["String"]["output"]>;
  relations?: Maybe<Array<Maybe<MediaEdge>>>;
  source?: Maybe<Scalars["String"]["output"]>;
  staff?: Maybe<Array<Maybe<MediaSubmissionComparison>>>;
  /** Status of the submission */
  status?: Maybe<SubmissionStatus>;
  studios?: Maybe<Array<Maybe<MediaSubmissionComparison>>>;
  submission?: Maybe<Media>;
  /** User submitter of the submission */
  submitter?: Maybe<User>;
  submitterStats?: Maybe<Scalars["Json"]["output"]>;
}

/** Media submission with comparison to current data */
export interface MediaSubmissionComparison {
  __typename?: "MediaSubmissionComparison";
  character?: Maybe<MediaCharacter>;
  externalLink?: Maybe<MediaExternalLink>;
  staff?: Maybe<StaffEdge>;
  studio?: Maybe<StudioEdge>;
  submission?: Maybe<MediaSubmissionEdge>;
}

export interface MediaSubmissionEdge {
  __typename?: "MediaSubmissionEdge";
  character?: Maybe<Character>;
  characterName?: Maybe<Scalars["String"]["output"]>;
  characterRole?: Maybe<CharacterRole>;
  characterSubmission?: Maybe<Character>;
  dubGroup?: Maybe<Scalars["String"]["output"]>;
  externalLink?: Maybe<MediaExternalLink>;
  /** The id of the direct submission */
  id?: Maybe<Scalars["Int"]["output"]>;
  isMain?: Maybe<Scalars["Boolean"]["output"]>;
  media?: Maybe<Media>;
  roleNotes?: Maybe<Scalars["String"]["output"]>;
  staff?: Maybe<Staff>;
  staffRole?: Maybe<Scalars["String"]["output"]>;
  staffSubmission?: Maybe<Staff>;
  studio?: Maybe<Studio>;
  voiceActor?: Maybe<Staff>;
  voiceActorSubmission?: Maybe<Staff>;
}

/** A tag that describes a theme or element of the media */
export interface MediaTag {
  __typename?: "MediaTag";
  /** The categories of tags this tag belongs to */
  category?: Maybe<Scalars["String"]["output"]>;
  /** A general description of the tag */
  description?: Maybe<Scalars["String"]["output"]>;
  /** The id of the tag */
  id: Scalars["Int"]["output"];
  /** If the tag is only for adult 18+ media */
  isAdult?: Maybe<Scalars["Boolean"]["output"]>;
  /** If the tag could be a spoiler for any media */
  isGeneralSpoiler?: Maybe<Scalars["Boolean"]["output"]>;
  /** If the tag is a spoiler for this media */
  isMediaSpoiler?: Maybe<Scalars["Boolean"]["output"]>;
  /** The name of the tag */
  name: Scalars["String"]["output"];
  /** The relevance ranking of the tag out of the 100 for this media */
  rank?: Maybe<Scalars["Int"]["output"]>;
  /** The user who submitted the tag */
  userId?: Maybe<Scalars["Int"]["output"]>;
}

/** The official titles of the media in various languages */
export interface MediaTitle {
  __typename?: "MediaTitle";
  /** The official english title */
  english?: Maybe<Scalars["String"]["output"]>;
  /** Official title in it's native language */
  native?: Maybe<Scalars["String"]["output"]>;
  /** The romanization of the native language title */
  romaji?: Maybe<Scalars["String"]["output"]>;
  /** The currently authenticated users preferred title language. Default romaji for non-authenticated */
  userPreferred?: Maybe<Scalars["String"]["output"]>;
}

/** The official titles of the media in various languages */
export interface MediaTitleEnglishArgs {
  stylised?: InputMaybe<Scalars["Boolean"]["input"]>;
}

/** The official titles of the media in various languages */
export interface MediaTitleNativeArgs {
  stylised?: InputMaybe<Scalars["Boolean"]["input"]>;
}

/** The official titles of the media in various languages */
export interface MediaTitleRomajiArgs {
  stylised?: InputMaybe<Scalars["Boolean"]["input"]>;
}

/** The official titles of the media in various languages */
export interface MediaTitleInput {
  /** The official english title */
  english?: InputMaybe<Scalars["String"]["input"]>;
  /** Official title in it's native language */
  native?: InputMaybe<Scalars["String"]["input"]>;
  /** The romanization of the native language title */
  romaji?: InputMaybe<Scalars["String"]["input"]>;
}

/** Media trailer or advertisement */
export interface MediaTrailer {
  __typename?: "MediaTrailer";
  /** The trailer video id */
  id?: Maybe<Scalars["String"]["output"]>;
  /** The site the video is hosted by (Currently either youtube or dailymotion) */
  site?: Maybe<Scalars["String"]["output"]>;
  /** The url for the thumbnail image of the video */
  thumbnail?: Maybe<Scalars["String"]["output"]>;
}

/** Daily media statistics */
export interface MediaTrend {
  __typename?: "MediaTrend";
  /** A weighted average score of all the user's scores of the media */
  averageScore?: Maybe<Scalars["Int"]["output"]>;
  /** The day the data was recorded (timestamp) */
  date: Scalars["Int"]["output"];
  /** The episode number of the anime released on this day */
  episode?: Maybe<Scalars["Int"]["output"]>;
  /** The number of users with watching/reading the media */
  inProgress?: Maybe<Scalars["Int"]["output"]>;
  /** The related media */
  media?: Maybe<Media>;
  /** The id of the tag */
  mediaId: Scalars["Int"]["output"];
  /** The number of users with the media on their list */
  popularity?: Maybe<Scalars["Int"]["output"]>;
  /** If the media was being released at this time */
  releasing: Scalars["Boolean"]["output"];
  /** The amount of media activity on the day */
  trending: Scalars["Int"]["output"];
}

export interface MediaTrendConnection {
  __typename?: "MediaTrendConnection";
  edges?: Maybe<Array<Maybe<MediaTrendEdge>>>;
  nodes?: Maybe<Array<Maybe<MediaTrend>>>;
  /** The pagination information */
  pageInfo?: Maybe<PageInfo>;
}

/** Media trend connection edge */
export interface MediaTrendEdge {
  __typename?: "MediaTrendEdge";
  node?: Maybe<MediaTrend>;
}

/** Media trend sort enums */
export enum MediaTrendSort {
  Date = "DATE",
  DateDesc = "DATE_DESC",
  Episode = "EPISODE",
  EpisodeDesc = "EPISODE_DESC",
  Id = "ID",
  IdDesc = "ID_DESC",
  MediaId = "MEDIA_ID",
  MediaIdDesc = "MEDIA_ID_DESC",
  Popularity = "POPULARITY",
  PopularityDesc = "POPULARITY_DESC",
  Score = "SCORE",
  ScoreDesc = "SCORE_DESC",
  Trending = "TRENDING",
  TrendingDesc = "TRENDING_DESC",
}

/** Media type enum, anime or manga. */
export enum MediaType {
  /** Japanese Anime */
  Anime = "ANIME",
  /** Asian comic */
  Manga = "MANGA",
}

/** User message activity */
export interface MessageActivity {
  __typename?: "MessageActivity";
  /** The time the activity was created at */
  createdAt: Scalars["Int"]["output"];
  /** The id of the activity */
  id: Scalars["Int"]["output"];
  /** If the currently authenticated user liked the activity */
  isLiked?: Maybe<Scalars["Boolean"]["output"]>;
  /** If the activity is locked and can receive replies */
  isLocked?: Maybe<Scalars["Boolean"]["output"]>;
  /** If the message is private and only viewable to the sender and recipients */
  isPrivate?: Maybe<Scalars["Boolean"]["output"]>;
  /** If the currently authenticated user is subscribed to the activity */
  isSubscribed?: Maybe<Scalars["Boolean"]["output"]>;
  /** The amount of likes the activity has */
  likeCount: Scalars["Int"]["output"];
  /** The users who liked the activity */
  likes?: Maybe<Array<Maybe<User>>>;
  /** The message text (Markdown) */
  message?: Maybe<Scalars["String"]["output"]>;
  /** The user who sent the activity message */
  messenger?: Maybe<User>;
  /** The user id of the activity's sender */
  messengerId?: Maybe<Scalars["Int"]["output"]>;
  /** The user who the activity message was sent to */
  recipient?: Maybe<User>;
  /** The user id of the activity's recipient */
  recipientId?: Maybe<Scalars["Int"]["output"]>;
  /** The written replies to the activity */
  replies?: Maybe<Array<Maybe<ActivityReply>>>;
  /** The number of activity replies */
  replyCount: Scalars["Int"]["output"];
  /** The url for the activity page on the AniList website */
  siteUrl?: Maybe<Scalars["String"]["output"]>;
  /** The type of the activity */
  type?: Maybe<ActivityType>;
}

/** User message activity */
export interface MessageActivityMessageArgs {
  asHtml?: InputMaybe<Scalars["Boolean"]["input"]>;
}

export interface ModAction {
  __typename?: "ModAction";
  createdAt: Scalars["Int"]["output"];
  data?: Maybe<Scalars["String"]["output"]>;
  /** The id of the action */
  id: Scalars["Int"]["output"];
  mod?: Maybe<User>;
  objectId?: Maybe<Scalars["Int"]["output"]>;
  objectType?: Maybe<Scalars["String"]["output"]>;
  type?: Maybe<ModActionType>;
  user?: Maybe<User>;
}

export enum ModActionType {
  Anon = "ANON",
  Ban = "BAN",
  Delete = "DELETE",
  Edit = "EDIT",
  Expire = "EXPIRE",
  Note = "NOTE",
  Report = "REPORT",
  Reset = "RESET",
}

/** Mod role enums */
export enum ModRole {
  /** An AniList administrator */
  Admin = "ADMIN",
  /** An anime data moderator */
  AnimeData = "ANIME_DATA",
  /** A community moderator */
  Community = "COMMUNITY",
  /** An AniList developer */
  Developer = "DEVELOPER",
  /** A discord community moderator */
  DiscordCommunity = "DISCORD_COMMUNITY",
  /** A lead anime data moderator */
  LeadAnimeData = "LEAD_ANIME_DATA",
  /** A lead community moderator */
  LeadCommunity = "LEAD_COMMUNITY",
  /** A head developer of AniList */
  LeadDeveloper = "LEAD_DEVELOPER",
  /** A lead manga data moderator */
  LeadMangaData = "LEAD_MANGA_DATA",
  /** A lead social media moderator */
  LeadSocialMedia = "LEAD_SOCIAL_MEDIA",
  /** A manga data moderator */
  MangaData = "MANGA_DATA",
  /** A retired moderator */
  Retired = "RETIRED",
  /** A social media moderator */
  SocialMedia = "SOCIAL_MEDIA",
}

export interface Mutation {
  __typename?: "Mutation";
  /** Delete an activity item of the authenticated users */
  DeleteActivity?: Maybe<Deleted>;
  /** Delete an activity reply of the authenticated users */
  DeleteActivityReply?: Maybe<Deleted>;
  /** Delete a custom list and remove the list entries from it */
  DeleteCustomList?: Maybe<Deleted>;
  /** Delete a media list entry */
  DeleteMediaListEntry?: Maybe<Deleted>;
  /** Delete a review */
  DeleteReview?: Maybe<Deleted>;
  /** Delete a thread */
  DeleteThread?: Maybe<Deleted>;
  /** Delete a thread comment */
  DeleteThreadComment?: Maybe<Deleted>;
  /** Rate a review */
  RateReview?: Maybe<Review>;
  /** Create or update an activity reply */
  SaveActivityReply?: Maybe<ActivityReply>;
  /** Update list activity (Mod Only) */
  SaveListActivity?: Maybe<ListActivity>;
  /** Create or update a media list entry */
  SaveMediaListEntry?: Maybe<MediaList>;
  /** Create or update message activity for the currently authenticated user */
  SaveMessageActivity?: Maybe<MessageActivity>;
  /** Recommendation a media */
  SaveRecommendation?: Maybe<Recommendation>;
  /** Create or update a review */
  SaveReview?: Maybe<Review>;
  /** Create or update text activity for the currently authenticated user */
  SaveTextActivity?: Maybe<TextActivity>;
  /** Create or update a forum thread */
  SaveThread?: Maybe<Thread>;
  /** Create or update a thread comment */
  SaveThreadComment?: Maybe<ThreadComment>;
  /** Toggle activity to be pinned to the top of the user's activity feed */
  ToggleActivityPin?: Maybe<ActivityUnion>;
  /** Toggle the subscription of an activity item */
  ToggleActivitySubscription?: Maybe<ActivityUnion>;
  /** Favourite or unfavourite an anime, manga, character, staff member, or studio */
  ToggleFavourite?: Maybe<Favourites>;
  /** Toggle the un/following of a user */
  ToggleFollow?: Maybe<User>;
  /**
   * Add or remove a like from a likeable type.
   *                           Returns all the users who liked the same model
   */
  ToggleLike?: Maybe<Array<Maybe<User>>>;
  /** Add or remove a like from a likeable type. */
  ToggleLikeV2?: Maybe<LikeableUnion>;
  /** Toggle the subscription of a forum thread */
  ToggleThreadSubscription?: Maybe<Thread>;
  UpdateAniChartHighlights?: Maybe<Scalars["Json"]["output"]>;
  UpdateAniChartSettings?: Maybe<Scalars["Json"]["output"]>;
  /** Update the order favourites are displayed in */
  UpdateFavouriteOrder?: Maybe<Favourites>;
  /** Update multiple media list entries to the same values */
  UpdateMediaListEntries?: Maybe<Array<Maybe<MediaList>>>;
  UpdateUser?: Maybe<User>;
}

export interface MutationDeleteActivityArgs {
  id?: InputMaybe<Scalars["Int"]["input"]>;
}

export interface MutationDeleteActivityReplyArgs {
  id?: InputMaybe<Scalars["Int"]["input"]>;
}

export interface MutationDeleteCustomListArgs {
  customList?: InputMaybe<Scalars["String"]["input"]>;
  type?: InputMaybe<MediaType>;
}

export interface MutationDeleteMediaListEntryArgs {
  id?: InputMaybe<Scalars["Int"]["input"]>;
}

export interface MutationDeleteReviewArgs {
  id?: InputMaybe<Scalars["Int"]["input"]>;
}

export interface MutationDeleteThreadArgs {
  id?: InputMaybe<Scalars["Int"]["input"]>;
}

export interface MutationDeleteThreadCommentArgs {
  id?: InputMaybe<Scalars["Int"]["input"]>;
}

export interface MutationRateReviewArgs {
  rating?: InputMaybe<ReviewRating>;
  reviewId?: InputMaybe<Scalars["Int"]["input"]>;
}

export interface MutationSaveActivityReplyArgs {
  activityId?: InputMaybe<Scalars["Int"]["input"]>;
  asMod?: InputMaybe<Scalars["Boolean"]["input"]>;
  id?: InputMaybe<Scalars["Int"]["input"]>;
  text?: InputMaybe<Scalars["String"]["input"]>;
}

export interface MutationSaveListActivityArgs {
  id?: InputMaybe<Scalars["Int"]["input"]>;
  locked?: InputMaybe<Scalars["Boolean"]["input"]>;
}

export interface MutationSaveMediaListEntryArgs {
  advancedScores?: InputMaybe<Array<InputMaybe<Scalars["Float"]["input"]>>>;
  completedAt?: InputMaybe<FuzzyDateInput>;
  customLists?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  hiddenFromStatusLists?: InputMaybe<Scalars["Boolean"]["input"]>;
  id?: InputMaybe<Scalars["Int"]["input"]>;
  mediaId?: InputMaybe<Scalars["Int"]["input"]>;
  notes?: InputMaybe<Scalars["String"]["input"]>;
  priority?: InputMaybe<Scalars["Int"]["input"]>;
  private?: InputMaybe<Scalars["Boolean"]["input"]>;
  progress?: InputMaybe<Scalars["Int"]["input"]>;
  progressVolumes?: InputMaybe<Scalars["Int"]["input"]>;
  repeat?: InputMaybe<Scalars["Int"]["input"]>;
  score?: InputMaybe<Scalars["Float"]["input"]>;
  scoreRaw?: InputMaybe<Scalars["Int"]["input"]>;
  startedAt?: InputMaybe<FuzzyDateInput>;
  status?: InputMaybe<MediaListStatus>;
}

export interface MutationSaveMessageActivityArgs {
  asMod?: InputMaybe<Scalars["Boolean"]["input"]>;
  id?: InputMaybe<Scalars["Int"]["input"]>;
  locked?: InputMaybe<Scalars["Boolean"]["input"]>;
  message?: InputMaybe<Scalars["String"]["input"]>;
  private?: InputMaybe<Scalars["Boolean"]["input"]>;
  recipientId?: InputMaybe<Scalars["Int"]["input"]>;
}

export interface MutationSaveRecommendationArgs {
  mediaId?: InputMaybe<Scalars["Int"]["input"]>;
  mediaRecommendationId?: InputMaybe<Scalars["Int"]["input"]>;
  rating?: InputMaybe<RecommendationRating>;
}

export interface MutationSaveReviewArgs {
  body?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["Int"]["input"]>;
  mediaId?: InputMaybe<Scalars["Int"]["input"]>;
  private?: InputMaybe<Scalars["Boolean"]["input"]>;
  score?: InputMaybe<Scalars["Int"]["input"]>;
  summary?: InputMaybe<Scalars["String"]["input"]>;
}

export interface MutationSaveTextActivityArgs {
  id?: InputMaybe<Scalars["Int"]["input"]>;
  locked?: InputMaybe<Scalars["Boolean"]["input"]>;
  text?: InputMaybe<Scalars["String"]["input"]>;
}

export interface MutationSaveThreadArgs {
  body?: InputMaybe<Scalars["String"]["input"]>;
  categories?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  id?: InputMaybe<Scalars["Int"]["input"]>;
  locked?: InputMaybe<Scalars["Boolean"]["input"]>;
  mediaCategories?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  sticky?: InputMaybe<Scalars["Boolean"]["input"]>;
  title?: InputMaybe<Scalars["String"]["input"]>;
}

export interface MutationSaveThreadCommentArgs {
  comment?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["Int"]["input"]>;
  locked?: InputMaybe<Scalars["Boolean"]["input"]>;
  parentCommentId?: InputMaybe<Scalars["Int"]["input"]>;
  threadId?: InputMaybe<Scalars["Int"]["input"]>;
}

export interface MutationToggleActivityPinArgs {
  id?: InputMaybe<Scalars["Int"]["input"]>;
  pinned?: InputMaybe<Scalars["Boolean"]["input"]>;
}

export interface MutationToggleActivitySubscriptionArgs {
  activityId?: InputMaybe<Scalars["Int"]["input"]>;
  subscribe?: InputMaybe<Scalars["Boolean"]["input"]>;
}

export interface MutationToggleFavouriteArgs {
  animeId?: InputMaybe<Scalars["Int"]["input"]>;
  characterId?: InputMaybe<Scalars["Int"]["input"]>;
  mangaId?: InputMaybe<Scalars["Int"]["input"]>;
  staffId?: InputMaybe<Scalars["Int"]["input"]>;
  studioId?: InputMaybe<Scalars["Int"]["input"]>;
}

export interface MutationToggleFollowArgs {
  userId?: InputMaybe<Scalars["Int"]["input"]>;
}

export interface MutationToggleLikeArgs {
  id?: InputMaybe<Scalars["Int"]["input"]>;
  type?: InputMaybe<LikeableType>;
}

export interface MutationToggleLikeV2Args {
  id?: InputMaybe<Scalars["Int"]["input"]>;
  type?: InputMaybe<LikeableType>;
}

export interface MutationToggleThreadSubscriptionArgs {
  subscribe?: InputMaybe<Scalars["Boolean"]["input"]>;
  threadId?: InputMaybe<Scalars["Int"]["input"]>;
}

export interface MutationUpdateAniChartHighlightsArgs {
  highlights?: InputMaybe<Array<InputMaybe<AniChartHighlightInput>>>;
}

export interface MutationUpdateAniChartSettingsArgs {
  outgoingLinkProvider?: InputMaybe<Scalars["String"]["input"]>;
  sort?: InputMaybe<Scalars["String"]["input"]>;
  theme?: InputMaybe<Scalars["String"]["input"]>;
  titleLanguage?: InputMaybe<Scalars["String"]["input"]>;
}

export interface MutationUpdateFavouriteOrderArgs {
  animeIds?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  animeOrder?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  characterIds?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  characterOrder?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  mangaIds?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  mangaOrder?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  staffIds?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  staffOrder?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  studioIds?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  studioOrder?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
}

export interface MutationUpdateMediaListEntriesArgs {
  advancedScores?: InputMaybe<Array<InputMaybe<Scalars["Float"]["input"]>>>;
  completedAt?: InputMaybe<FuzzyDateInput>;
  hiddenFromStatusLists?: InputMaybe<Scalars["Boolean"]["input"]>;
  ids?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  notes?: InputMaybe<Scalars["String"]["input"]>;
  priority?: InputMaybe<Scalars["Int"]["input"]>;
  private?: InputMaybe<Scalars["Boolean"]["input"]>;
  progress?: InputMaybe<Scalars["Int"]["input"]>;
  progressVolumes?: InputMaybe<Scalars["Int"]["input"]>;
  repeat?: InputMaybe<Scalars["Int"]["input"]>;
  score?: InputMaybe<Scalars["Float"]["input"]>;
  scoreRaw?: InputMaybe<Scalars["Int"]["input"]>;
  startedAt?: InputMaybe<FuzzyDateInput>;
  status?: InputMaybe<MediaListStatus>;
}

export interface MutationUpdateUserArgs {
  about?: InputMaybe<Scalars["String"]["input"]>;
  activityMergeTime?: InputMaybe<Scalars["Int"]["input"]>;
  airingNotifications?: InputMaybe<Scalars["Boolean"]["input"]>;
  animeListOptions?: InputMaybe<MediaListOptionsInput>;
  disabledListActivity?: InputMaybe<Array<InputMaybe<ListActivityOptionInput>>>;
  displayAdultContent?: InputMaybe<Scalars["Boolean"]["input"]>;
  donatorBadge?: InputMaybe<Scalars["String"]["input"]>;
  mangaListOptions?: InputMaybe<MediaListOptionsInput>;
  notificationOptions?: InputMaybe<Array<InputMaybe<NotificationOptionInput>>>;
  profileColor?: InputMaybe<Scalars["String"]["input"]>;
  restrictMessagesToFollowing?: InputMaybe<Scalars["Boolean"]["input"]>;
  rowOrder?: InputMaybe<Scalars["String"]["input"]>;
  scoreFormat?: InputMaybe<ScoreFormat>;
  staffNameLanguage?: InputMaybe<UserStaffNameLanguage>;
  timezone?: InputMaybe<Scalars["String"]["input"]>;
  titleLanguage?: InputMaybe<UserTitleLanguage>;
}

/** Notification option */
export interface NotificationOption {
  __typename?: "NotificationOption";
  /** Whether this type of notification is enabled */
  enabled?: Maybe<Scalars["Boolean"]["output"]>;
  /** The type of notification */
  type?: Maybe<NotificationType>;
}

/** Notification option input */
export interface NotificationOptionInput {
  /** Whether this type of notification is enabled */
  enabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** The type of notification */
  type?: InputMaybe<NotificationType>;
}

/** Notification type enum */
export enum NotificationType {
  /** A user has liked your activity */
  ActivityLike = "ACTIVITY_LIKE",
  /** A user has mentioned you in their activity */
  ActivityMention = "ACTIVITY_MENTION",
  /** A user has sent you message */
  ActivityMessage = "ACTIVITY_MESSAGE",
  /** A user has replied to your activity */
  ActivityReply = "ACTIVITY_REPLY",
  /** A user has liked your activity reply */
  ActivityReplyLike = "ACTIVITY_REPLY_LIKE",
  /** A user has replied to activity you have also replied to */
  ActivityReplySubscribed = "ACTIVITY_REPLY_SUBSCRIBED",
  /** An anime you are currently watching has aired */
  Airing = "AIRING",
  /** A user has followed you */
  Following = "FOLLOWING",
  /** An anime or manga has had a data change that affects how a user may track it in their lists */
  MediaDataChange = "MEDIA_DATA_CHANGE",
  /** An anime or manga on the user's list has been deleted from the site */
  MediaDeletion = "MEDIA_DELETION",
  /** Anime or manga entries on the user's list have been merged into a single entry */
  MediaMerge = "MEDIA_MERGE",
  /** A new anime or manga has been added to the site where its related media is on the user's list */
  RelatedMediaAddition = "RELATED_MEDIA_ADDITION",
  /** A user has liked your forum comment */
  ThreadCommentLike = "THREAD_COMMENT_LIKE",
  /** A user has mentioned you in a forum comment */
  ThreadCommentMention = "THREAD_COMMENT_MENTION",
  /** A user has replied to your forum comment */
  ThreadCommentReply = "THREAD_COMMENT_REPLY",
  /** A user has liked your forum thread */
  ThreadLike = "THREAD_LIKE",
  /** A user has commented in one of your subscribed forum threads */
  ThreadSubscribed = "THREAD_SUBSCRIBED",
}

/** Notification union type */
export type NotificationUnion =
  | ActivityLikeNotification
  | ActivityMentionNotification
  | ActivityMessageNotification
  | ActivityReplyLikeNotification
  | ActivityReplyNotification
  | ActivityReplySubscribedNotification
  | AiringNotification
  | FollowingNotification
  | MediaDataChangeNotification
  | MediaDeletionNotification
  | MediaMergeNotification
  | RelatedMediaAdditionNotification
  | ThreadCommentLikeNotification
  | ThreadCommentMentionNotification
  | ThreadCommentReplyNotification
  | ThreadCommentSubscribedNotification
  | ThreadLikeNotification;

/** Page of data */
export interface Page {
  __typename?: "Page";
  activities?: Maybe<Array<Maybe<ActivityUnion>>>;
  activityReplies?: Maybe<Array<Maybe<ActivityReply>>>;
  airingSchedules?: Maybe<Array<Maybe<AiringSchedule>>>;
  characters?: Maybe<Array<Maybe<Character>>>;
  followers?: Maybe<Array<Maybe<User>>>;
  following?: Maybe<Array<Maybe<User>>>;
  likes?: Maybe<Array<Maybe<User>>>;
  media?: Maybe<Array<Maybe<Media>>>;
  mediaList?: Maybe<Array<Maybe<MediaList>>>;
  mediaTrends?: Maybe<Array<Maybe<MediaTrend>>>;
  notifications?: Maybe<Array<Maybe<NotificationUnion>>>;
  /** The pagination information */
  pageInfo?: Maybe<PageInfo>;
  recommendations?: Maybe<Array<Maybe<Recommendation>>>;
  reviews?: Maybe<Array<Maybe<Review>>>;
  staff?: Maybe<Array<Maybe<Staff>>>;
  studios?: Maybe<Array<Maybe<Studio>>>;
  threadComments?: Maybe<Array<Maybe<ThreadComment>>>;
  threads?: Maybe<Array<Maybe<Thread>>>;
  users?: Maybe<Array<Maybe<User>>>;
}

/** Page of data */
export interface PageActivitiesArgs {
  createdAt?: InputMaybe<Scalars["Int"]["input"]>;
  createdAt_greater?: InputMaybe<Scalars["Int"]["input"]>;
  createdAt_lesser?: InputMaybe<Scalars["Int"]["input"]>;
  hasReplies?: InputMaybe<Scalars["Boolean"]["input"]>;
  hasRepliesOrTypeText?: InputMaybe<Scalars["Boolean"]["input"]>;
  id?: InputMaybe<Scalars["Int"]["input"]>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  id_not?: InputMaybe<Scalars["Int"]["input"]>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  isFollowing?: InputMaybe<Scalars["Boolean"]["input"]>;
  mediaId?: InputMaybe<Scalars["Int"]["input"]>;
  mediaId_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  mediaId_not?: InputMaybe<Scalars["Int"]["input"]>;
  mediaId_not_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  messengerId?: InputMaybe<Scalars["Int"]["input"]>;
  messengerId_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  messengerId_not?: InputMaybe<Scalars["Int"]["input"]>;
  messengerId_not_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  sort?: InputMaybe<Array<InputMaybe<ActivitySort>>>;
  type?: InputMaybe<ActivityType>;
  type_in?: InputMaybe<Array<InputMaybe<ActivityType>>>;
  type_not?: InputMaybe<ActivityType>;
  type_not_in?: InputMaybe<Array<InputMaybe<ActivityType>>>;
  userId?: InputMaybe<Scalars["Int"]["input"]>;
  userId_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  userId_not?: InputMaybe<Scalars["Int"]["input"]>;
  userId_not_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
}

/** Page of data */
export interface PageActivityRepliesArgs {
  activityId?: InputMaybe<Scalars["Int"]["input"]>;
  id?: InputMaybe<Scalars["Int"]["input"]>;
}

/** Page of data */
export interface PageAiringSchedulesArgs {
  airingAt?: InputMaybe<Scalars["Int"]["input"]>;
  airingAt_greater?: InputMaybe<Scalars["Int"]["input"]>;
  airingAt_lesser?: InputMaybe<Scalars["Int"]["input"]>;
  episode?: InputMaybe<Scalars["Int"]["input"]>;
  episode_greater?: InputMaybe<Scalars["Int"]["input"]>;
  episode_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  episode_lesser?: InputMaybe<Scalars["Int"]["input"]>;
  episode_not?: InputMaybe<Scalars["Int"]["input"]>;
  episode_not_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  id?: InputMaybe<Scalars["Int"]["input"]>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  id_not?: InputMaybe<Scalars["Int"]["input"]>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  mediaId?: InputMaybe<Scalars["Int"]["input"]>;
  mediaId_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  mediaId_not?: InputMaybe<Scalars["Int"]["input"]>;
  mediaId_not_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  notYetAired?: InputMaybe<Scalars["Boolean"]["input"]>;
  sort?: InputMaybe<Array<InputMaybe<AiringSort>>>;
}

/** Page of data */
export interface PageCharactersArgs {
  id?: InputMaybe<Scalars["Int"]["input"]>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  id_not?: InputMaybe<Scalars["Int"]["input"]>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  isBirthday?: InputMaybe<Scalars["Boolean"]["input"]>;
  search?: InputMaybe<Scalars["String"]["input"]>;
  sort?: InputMaybe<Array<InputMaybe<CharacterSort>>>;
}

/** Page of data */
export interface PageFollowersArgs {
  sort?: InputMaybe<Array<InputMaybe<UserSort>>>;
  userId: Scalars["Int"]["input"];
}

/** Page of data */
export interface PageFollowingArgs {
  sort?: InputMaybe<Array<InputMaybe<UserSort>>>;
  userId: Scalars["Int"]["input"];
}

/** Page of data */
export interface PageLikesArgs {
  likeableId?: InputMaybe<Scalars["Int"]["input"]>;
  type?: InputMaybe<LikeableType>;
}

/** Page of data */
export interface PageMediaArgs {
  averageScore?: InputMaybe<Scalars["Int"]["input"]>;
  averageScore_greater?: InputMaybe<Scalars["Int"]["input"]>;
  averageScore_lesser?: InputMaybe<Scalars["Int"]["input"]>;
  averageScore_not?: InputMaybe<Scalars["Int"]["input"]>;
  chapters?: InputMaybe<Scalars["Int"]["input"]>;
  chapters_greater?: InputMaybe<Scalars["Int"]["input"]>;
  chapters_lesser?: InputMaybe<Scalars["Int"]["input"]>;
  countryOfOrigin?: InputMaybe<Scalars["CountryCode"]["input"]>;
  duration?: InputMaybe<Scalars["Int"]["input"]>;
  duration_greater?: InputMaybe<Scalars["Int"]["input"]>;
  duration_lesser?: InputMaybe<Scalars["Int"]["input"]>;
  endDate?: InputMaybe<Scalars["FuzzyDateInt"]["input"]>;
  endDate_greater?: InputMaybe<Scalars["FuzzyDateInt"]["input"]>;
  endDate_lesser?: InputMaybe<Scalars["FuzzyDateInt"]["input"]>;
  endDate_like?: InputMaybe<Scalars["String"]["input"]>;
  episodes?: InputMaybe<Scalars["Int"]["input"]>;
  episodes_greater?: InputMaybe<Scalars["Int"]["input"]>;
  episodes_lesser?: InputMaybe<Scalars["Int"]["input"]>;
  format?: InputMaybe<MediaFormat>;
  format_in?: InputMaybe<Array<InputMaybe<MediaFormat>>>;
  format_not?: InputMaybe<MediaFormat>;
  format_not_in?: InputMaybe<Array<InputMaybe<MediaFormat>>>;
  genre?: InputMaybe<Scalars["String"]["input"]>;
  genre_in?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  genre_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  id?: InputMaybe<Scalars["Int"]["input"]>;
  idMal?: InputMaybe<Scalars["Int"]["input"]>;
  idMal_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  idMal_not?: InputMaybe<Scalars["Int"]["input"]>;
  idMal_not_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  id_not?: InputMaybe<Scalars["Int"]["input"]>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  isAdult?: InputMaybe<Scalars["Boolean"]["input"]>;
  isLicensed?: InputMaybe<Scalars["Boolean"]["input"]>;
  licensedBy?: InputMaybe<Scalars["String"]["input"]>;
  licensedById?: InputMaybe<Scalars["Int"]["input"]>;
  licensedById_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  licensedBy_in?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  minimumTagRank?: InputMaybe<Scalars["Int"]["input"]>;
  onList?: InputMaybe<Scalars["Boolean"]["input"]>;
  popularity?: InputMaybe<Scalars["Int"]["input"]>;
  popularity_greater?: InputMaybe<Scalars["Int"]["input"]>;
  popularity_lesser?: InputMaybe<Scalars["Int"]["input"]>;
  popularity_not?: InputMaybe<Scalars["Int"]["input"]>;
  search?: InputMaybe<Scalars["String"]["input"]>;
  season?: InputMaybe<MediaSeason>;
  seasonYear?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<Array<InputMaybe<MediaSort>>>;
  source?: InputMaybe<MediaSource>;
  source_in?: InputMaybe<Array<InputMaybe<MediaSource>>>;
  startDate?: InputMaybe<Scalars["FuzzyDateInt"]["input"]>;
  startDate_greater?: InputMaybe<Scalars["FuzzyDateInt"]["input"]>;
  startDate_lesser?: InputMaybe<Scalars["FuzzyDateInt"]["input"]>;
  startDate_like?: InputMaybe<Scalars["String"]["input"]>;
  status?: InputMaybe<MediaStatus>;
  status_in?: InputMaybe<Array<InputMaybe<MediaStatus>>>;
  status_not?: InputMaybe<MediaStatus>;
  status_not_in?: InputMaybe<Array<InputMaybe<MediaStatus>>>;
  tag?: InputMaybe<Scalars["String"]["input"]>;
  tagCategory?: InputMaybe<Scalars["String"]["input"]>;
  tagCategory_in?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  tagCategory_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  tag_in?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  tag_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  type?: InputMaybe<MediaType>;
  volumes?: InputMaybe<Scalars["Int"]["input"]>;
  volumes_greater?: InputMaybe<Scalars["Int"]["input"]>;
  volumes_lesser?: InputMaybe<Scalars["Int"]["input"]>;
}

/** Page of data */
export interface PageMediaListArgs {
  compareWithAuthList?: InputMaybe<Scalars["Boolean"]["input"]>;
  completedAt?: InputMaybe<Scalars["FuzzyDateInt"]["input"]>;
  completedAt_greater?: InputMaybe<Scalars["FuzzyDateInt"]["input"]>;
  completedAt_lesser?: InputMaybe<Scalars["FuzzyDateInt"]["input"]>;
  completedAt_like?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["Int"]["input"]>;
  isFollowing?: InputMaybe<Scalars["Boolean"]["input"]>;
  mediaId?: InputMaybe<Scalars["Int"]["input"]>;
  mediaId_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  mediaId_not_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  notes?: InputMaybe<Scalars["String"]["input"]>;
  notes_like?: InputMaybe<Scalars["String"]["input"]>;
  sort?: InputMaybe<Array<InputMaybe<MediaListSort>>>;
  startedAt?: InputMaybe<Scalars["FuzzyDateInt"]["input"]>;
  startedAt_greater?: InputMaybe<Scalars["FuzzyDateInt"]["input"]>;
  startedAt_lesser?: InputMaybe<Scalars["FuzzyDateInt"]["input"]>;
  startedAt_like?: InputMaybe<Scalars["String"]["input"]>;
  status?: InputMaybe<MediaListStatus>;
  status_in?: InputMaybe<Array<InputMaybe<MediaListStatus>>>;
  status_not?: InputMaybe<MediaListStatus>;
  status_not_in?: InputMaybe<Array<InputMaybe<MediaListStatus>>>;
  type?: InputMaybe<MediaType>;
  userId?: InputMaybe<Scalars["Int"]["input"]>;
  userId_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  userName?: InputMaybe<Scalars["String"]["input"]>;
}

/** Page of data */
export interface PageMediaTrendsArgs {
  averageScore?: InputMaybe<Scalars["Int"]["input"]>;
  averageScore_greater?: InputMaybe<Scalars["Int"]["input"]>;
  averageScore_lesser?: InputMaybe<Scalars["Int"]["input"]>;
  averageScore_not?: InputMaybe<Scalars["Int"]["input"]>;
  date?: InputMaybe<Scalars["Int"]["input"]>;
  date_greater?: InputMaybe<Scalars["Int"]["input"]>;
  date_lesser?: InputMaybe<Scalars["Int"]["input"]>;
  episode?: InputMaybe<Scalars["Int"]["input"]>;
  episode_greater?: InputMaybe<Scalars["Int"]["input"]>;
  episode_lesser?: InputMaybe<Scalars["Int"]["input"]>;
  episode_not?: InputMaybe<Scalars["Int"]["input"]>;
  mediaId?: InputMaybe<Scalars["Int"]["input"]>;
  mediaId_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  mediaId_not?: InputMaybe<Scalars["Int"]["input"]>;
  mediaId_not_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  popularity?: InputMaybe<Scalars["Int"]["input"]>;
  popularity_greater?: InputMaybe<Scalars["Int"]["input"]>;
  popularity_lesser?: InputMaybe<Scalars["Int"]["input"]>;
  popularity_not?: InputMaybe<Scalars["Int"]["input"]>;
  releasing?: InputMaybe<Scalars["Boolean"]["input"]>;
  sort?: InputMaybe<Array<InputMaybe<MediaTrendSort>>>;
  trending?: InputMaybe<Scalars["Int"]["input"]>;
  trending_greater?: InputMaybe<Scalars["Int"]["input"]>;
  trending_lesser?: InputMaybe<Scalars["Int"]["input"]>;
  trending_not?: InputMaybe<Scalars["Int"]["input"]>;
}

/** Page of data */
export interface PageNotificationsArgs {
  resetNotificationCount?: InputMaybe<Scalars["Boolean"]["input"]>;
  type?: InputMaybe<NotificationType>;
  type_in?: InputMaybe<Array<InputMaybe<NotificationType>>>;
}

/** Page of data */
export interface PageRecommendationsArgs {
  id?: InputMaybe<Scalars["Int"]["input"]>;
  mediaId?: InputMaybe<Scalars["Int"]["input"]>;
  mediaRecommendationId?: InputMaybe<Scalars["Int"]["input"]>;
  onList?: InputMaybe<Scalars["Boolean"]["input"]>;
  rating?: InputMaybe<Scalars["Int"]["input"]>;
  rating_greater?: InputMaybe<Scalars["Int"]["input"]>;
  rating_lesser?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<Array<InputMaybe<RecommendationSort>>>;
  userId?: InputMaybe<Scalars["Int"]["input"]>;
}

/** Page of data */
export interface PageReviewsArgs {
  id?: InputMaybe<Scalars["Int"]["input"]>;
  mediaId?: InputMaybe<Scalars["Int"]["input"]>;
  mediaType?: InputMaybe<MediaType>;
  sort?: InputMaybe<Array<InputMaybe<ReviewSort>>>;
  userId?: InputMaybe<Scalars["Int"]["input"]>;
}

/** Page of data */
export interface PageStaffArgs {
  id?: InputMaybe<Scalars["Int"]["input"]>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  id_not?: InputMaybe<Scalars["Int"]["input"]>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  isBirthday?: InputMaybe<Scalars["Boolean"]["input"]>;
  search?: InputMaybe<Scalars["String"]["input"]>;
  sort?: InputMaybe<Array<InputMaybe<StaffSort>>>;
}

/** Page of data */
export interface PageStudiosArgs {
  id?: InputMaybe<Scalars["Int"]["input"]>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  id_not?: InputMaybe<Scalars["Int"]["input"]>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  search?: InputMaybe<Scalars["String"]["input"]>;
  sort?: InputMaybe<Array<InputMaybe<StudioSort>>>;
}

/** Page of data */
export interface PageThreadCommentsArgs {
  id?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<Array<InputMaybe<ThreadCommentSort>>>;
  threadId?: InputMaybe<Scalars["Int"]["input"]>;
  userId?: InputMaybe<Scalars["Int"]["input"]>;
}

/** Page of data */
export interface PageThreadsArgs {
  categoryId?: InputMaybe<Scalars["Int"]["input"]>;
  id?: InputMaybe<Scalars["Int"]["input"]>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  mediaCategoryId?: InputMaybe<Scalars["Int"]["input"]>;
  replyUserId?: InputMaybe<Scalars["Int"]["input"]>;
  search?: InputMaybe<Scalars["String"]["input"]>;
  sort?: InputMaybe<Array<InputMaybe<ThreadSort>>>;
  subscribed?: InputMaybe<Scalars["Boolean"]["input"]>;
  userId?: InputMaybe<Scalars["Int"]["input"]>;
}

/** Page of data */
export interface PageUsersArgs {
  id?: InputMaybe<Scalars["Int"]["input"]>;
  isModerator?: InputMaybe<Scalars["Boolean"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  search?: InputMaybe<Scalars["String"]["input"]>;
  sort?: InputMaybe<Array<InputMaybe<UserSort>>>;
}

export interface PageInfo {
  __typename?: "PageInfo";
  /** The current page */
  currentPage?: Maybe<Scalars["Int"]["output"]>;
  /** If there is another page */
  hasNextPage?: Maybe<Scalars["Boolean"]["output"]>;
  /** The last page */
  lastPage?: Maybe<Scalars["Int"]["output"]>;
  /** The count on a page */
  perPage?: Maybe<Scalars["Int"]["output"]>;
  /** The total number of items. Note: This value is not guaranteed to be accurate, do not rely on this for logic */
  total?: Maybe<Scalars["Int"]["output"]>;
}

/** Provides the parsed markdown as html */
export interface ParsedMarkdown {
  __typename?: "ParsedMarkdown";
  /** The parsed markdown as html */
  html?: Maybe<Scalars["String"]["output"]>;
}

export interface Query {
  __typename?: "Query";
  /** Activity query */
  Activity?: Maybe<ActivityUnion>;
  /** Activity reply query */
  ActivityReply?: Maybe<ActivityReply>;
  /** Airing schedule query */
  AiringSchedule?: Maybe<AiringSchedule>;
  AniChartUser?: Maybe<AniChartUser>;
  /** Character query */
  Character?: Maybe<Character>;
  /** ExternalLinkSource collection query */
  ExternalLinkSourceCollection?: Maybe<Array<Maybe<MediaExternalLink>>>;
  /** Follow query */
  Follower?: Maybe<User>;
  /** Follow query */
  Following?: Maybe<User>;
  /** Collection of all the possible media genres */
  GenreCollection?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  /** Like query */
  Like?: Maybe<User>;
  /** Provide AniList markdown to be converted to html (Requires auth) */
  Markdown?: Maybe<ParsedMarkdown>;
  /** Media query */
  Media?: Maybe<Media>;
  /** Media list query */
  MediaList?: Maybe<MediaList>;
  /** Media list collection query, provides list pre-grouped by status & custom lists. User ID and Media Type arguments required. */
  MediaListCollection?: Maybe<MediaListCollection>;
  /** Collection of all the possible media tags */
  MediaTagCollection?: Maybe<Array<Maybe<MediaTag>>>;
  /** Media Trend query */
  MediaTrend?: Maybe<MediaTrend>;
  /** Notification query */
  Notification?: Maybe<NotificationUnion>;
  Page?: Maybe<Page>;
  /** Recommendation query */
  Recommendation?: Maybe<Recommendation>;
  /** Review query */
  Review?: Maybe<Review>;
  /** Site statistics query */
  SiteStatistics?: Maybe<SiteStatistics>;
  /** Staff query */
  Staff?: Maybe<Staff>;
  /** Studio query */
  Studio?: Maybe<Studio>;
  /** Thread query */
  Thread?: Maybe<Thread>;
  /** Comment query */
  ThreadComment?: Maybe<Array<Maybe<ThreadComment>>>;
  /** User query */
  User?: Maybe<User>;
  /** Get the currently authenticated user */
  Viewer?: Maybe<User>;
}

export interface QueryActivityArgs {
  createdAt?: InputMaybe<Scalars["Int"]["input"]>;
  createdAt_greater?: InputMaybe<Scalars["Int"]["input"]>;
  createdAt_lesser?: InputMaybe<Scalars["Int"]["input"]>;
  hasReplies?: InputMaybe<Scalars["Boolean"]["input"]>;
  hasRepliesOrTypeText?: InputMaybe<Scalars["Boolean"]["input"]>;
  id?: InputMaybe<Scalars["Int"]["input"]>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  id_not?: InputMaybe<Scalars["Int"]["input"]>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  isFollowing?: InputMaybe<Scalars["Boolean"]["input"]>;
  mediaId?: InputMaybe<Scalars["Int"]["input"]>;
  mediaId_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  mediaId_not?: InputMaybe<Scalars["Int"]["input"]>;
  mediaId_not_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  messengerId?: InputMaybe<Scalars["Int"]["input"]>;
  messengerId_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  messengerId_not?: InputMaybe<Scalars["Int"]["input"]>;
  messengerId_not_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  sort?: InputMaybe<Array<InputMaybe<ActivitySort>>>;
  type?: InputMaybe<ActivityType>;
  type_in?: InputMaybe<Array<InputMaybe<ActivityType>>>;
  type_not?: InputMaybe<ActivityType>;
  type_not_in?: InputMaybe<Array<InputMaybe<ActivityType>>>;
  userId?: InputMaybe<Scalars["Int"]["input"]>;
  userId_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  userId_not?: InputMaybe<Scalars["Int"]["input"]>;
  userId_not_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
}

export interface QueryActivityReplyArgs {
  activityId?: InputMaybe<Scalars["Int"]["input"]>;
  id?: InputMaybe<Scalars["Int"]["input"]>;
}

export interface QueryAiringScheduleArgs {
  airingAt?: InputMaybe<Scalars["Int"]["input"]>;
  airingAt_greater?: InputMaybe<Scalars["Int"]["input"]>;
  airingAt_lesser?: InputMaybe<Scalars["Int"]["input"]>;
  episode?: InputMaybe<Scalars["Int"]["input"]>;
  episode_greater?: InputMaybe<Scalars["Int"]["input"]>;
  episode_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  episode_lesser?: InputMaybe<Scalars["Int"]["input"]>;
  episode_not?: InputMaybe<Scalars["Int"]["input"]>;
  episode_not_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  id?: InputMaybe<Scalars["Int"]["input"]>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  id_not?: InputMaybe<Scalars["Int"]["input"]>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  mediaId?: InputMaybe<Scalars["Int"]["input"]>;
  mediaId_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  mediaId_not?: InputMaybe<Scalars["Int"]["input"]>;
  mediaId_not_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  notYetAired?: InputMaybe<Scalars["Boolean"]["input"]>;
  sort?: InputMaybe<Array<InputMaybe<AiringSort>>>;
}

export interface QueryCharacterArgs {
  id?: InputMaybe<Scalars["Int"]["input"]>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  id_not?: InputMaybe<Scalars["Int"]["input"]>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  isBirthday?: InputMaybe<Scalars["Boolean"]["input"]>;
  search?: InputMaybe<Scalars["String"]["input"]>;
  sort?: InputMaybe<Array<InputMaybe<CharacterSort>>>;
}

export interface QueryExternalLinkSourceCollectionArgs {
  id?: InputMaybe<Scalars["Int"]["input"]>;
  mediaType?: InputMaybe<ExternalLinkMediaType>;
  type?: InputMaybe<ExternalLinkType>;
}

export interface QueryFollowerArgs {
  sort?: InputMaybe<Array<InputMaybe<UserSort>>>;
  userId: Scalars["Int"]["input"];
}

export interface QueryFollowingArgs {
  sort?: InputMaybe<Array<InputMaybe<UserSort>>>;
  userId: Scalars["Int"]["input"];
}

export interface QueryLikeArgs {
  likeableId?: InputMaybe<Scalars["Int"]["input"]>;
  type?: InputMaybe<LikeableType>;
}

export interface QueryMarkdownArgs {
  markdown: Scalars["String"]["input"];
}

export interface QueryMediaArgs {
  averageScore?: InputMaybe<Scalars["Int"]["input"]>;
  averageScore_greater?: InputMaybe<Scalars["Int"]["input"]>;
  averageScore_lesser?: InputMaybe<Scalars["Int"]["input"]>;
  averageScore_not?: InputMaybe<Scalars["Int"]["input"]>;
  chapters?: InputMaybe<Scalars["Int"]["input"]>;
  chapters_greater?: InputMaybe<Scalars["Int"]["input"]>;
  chapters_lesser?: InputMaybe<Scalars["Int"]["input"]>;
  countryOfOrigin?: InputMaybe<Scalars["CountryCode"]["input"]>;
  duration?: InputMaybe<Scalars["Int"]["input"]>;
  duration_greater?: InputMaybe<Scalars["Int"]["input"]>;
  duration_lesser?: InputMaybe<Scalars["Int"]["input"]>;
  endDate?: InputMaybe<Scalars["FuzzyDateInt"]["input"]>;
  endDate_greater?: InputMaybe<Scalars["FuzzyDateInt"]["input"]>;
  endDate_lesser?: InputMaybe<Scalars["FuzzyDateInt"]["input"]>;
  endDate_like?: InputMaybe<Scalars["String"]["input"]>;
  episodes?: InputMaybe<Scalars["Int"]["input"]>;
  episodes_greater?: InputMaybe<Scalars["Int"]["input"]>;
  episodes_lesser?: InputMaybe<Scalars["Int"]["input"]>;
  format?: InputMaybe<MediaFormat>;
  format_in?: InputMaybe<Array<InputMaybe<MediaFormat>>>;
  format_not?: InputMaybe<MediaFormat>;
  format_not_in?: InputMaybe<Array<InputMaybe<MediaFormat>>>;
  genre?: InputMaybe<Scalars["String"]["input"]>;
  genre_in?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  genre_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  id?: InputMaybe<Scalars["Int"]["input"]>;
  idMal?: InputMaybe<Scalars["Int"]["input"]>;
  idMal_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  idMal_not?: InputMaybe<Scalars["Int"]["input"]>;
  idMal_not_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  id_not?: InputMaybe<Scalars["Int"]["input"]>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  isAdult?: InputMaybe<Scalars["Boolean"]["input"]>;
  isLicensed?: InputMaybe<Scalars["Boolean"]["input"]>;
  licensedBy?: InputMaybe<Scalars["String"]["input"]>;
  licensedById?: InputMaybe<Scalars["Int"]["input"]>;
  licensedById_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  licensedBy_in?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  minimumTagRank?: InputMaybe<Scalars["Int"]["input"]>;
  onList?: InputMaybe<Scalars["Boolean"]["input"]>;
  popularity?: InputMaybe<Scalars["Int"]["input"]>;
  popularity_greater?: InputMaybe<Scalars["Int"]["input"]>;
  popularity_lesser?: InputMaybe<Scalars["Int"]["input"]>;
  popularity_not?: InputMaybe<Scalars["Int"]["input"]>;
  search?: InputMaybe<Scalars["String"]["input"]>;
  season?: InputMaybe<MediaSeason>;
  seasonYear?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<Array<InputMaybe<MediaSort>>>;
  source?: InputMaybe<MediaSource>;
  source_in?: InputMaybe<Array<InputMaybe<MediaSource>>>;
  startDate?: InputMaybe<Scalars["FuzzyDateInt"]["input"]>;
  startDate_greater?: InputMaybe<Scalars["FuzzyDateInt"]["input"]>;
  startDate_lesser?: InputMaybe<Scalars["FuzzyDateInt"]["input"]>;
  startDate_like?: InputMaybe<Scalars["String"]["input"]>;
  status?: InputMaybe<MediaStatus>;
  status_in?: InputMaybe<Array<InputMaybe<MediaStatus>>>;
  status_not?: InputMaybe<MediaStatus>;
  status_not_in?: InputMaybe<Array<InputMaybe<MediaStatus>>>;
  tag?: InputMaybe<Scalars["String"]["input"]>;
  tagCategory?: InputMaybe<Scalars["String"]["input"]>;
  tagCategory_in?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  tagCategory_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  tag_in?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  tag_not_in?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  type?: InputMaybe<MediaType>;
  volumes?: InputMaybe<Scalars["Int"]["input"]>;
  volumes_greater?: InputMaybe<Scalars["Int"]["input"]>;
  volumes_lesser?: InputMaybe<Scalars["Int"]["input"]>;
}

export interface QueryMediaListArgs {
  compareWithAuthList?: InputMaybe<Scalars["Boolean"]["input"]>;
  completedAt?: InputMaybe<Scalars["FuzzyDateInt"]["input"]>;
  completedAt_greater?: InputMaybe<Scalars["FuzzyDateInt"]["input"]>;
  completedAt_lesser?: InputMaybe<Scalars["FuzzyDateInt"]["input"]>;
  completedAt_like?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["Int"]["input"]>;
  isFollowing?: InputMaybe<Scalars["Boolean"]["input"]>;
  mediaId?: InputMaybe<Scalars["Int"]["input"]>;
  mediaId_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  mediaId_not_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  notes?: InputMaybe<Scalars["String"]["input"]>;
  notes_like?: InputMaybe<Scalars["String"]["input"]>;
  sort?: InputMaybe<Array<InputMaybe<MediaListSort>>>;
  startedAt?: InputMaybe<Scalars["FuzzyDateInt"]["input"]>;
  startedAt_greater?: InputMaybe<Scalars["FuzzyDateInt"]["input"]>;
  startedAt_lesser?: InputMaybe<Scalars["FuzzyDateInt"]["input"]>;
  startedAt_like?: InputMaybe<Scalars["String"]["input"]>;
  status?: InputMaybe<MediaListStatus>;
  status_in?: InputMaybe<Array<InputMaybe<MediaListStatus>>>;
  status_not?: InputMaybe<MediaListStatus>;
  status_not_in?: InputMaybe<Array<InputMaybe<MediaListStatus>>>;
  type?: InputMaybe<MediaType>;
  userId?: InputMaybe<Scalars["Int"]["input"]>;
  userId_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  userName?: InputMaybe<Scalars["String"]["input"]>;
}

export interface QueryMediaListCollectionArgs {
  chunk?: InputMaybe<Scalars["Int"]["input"]>;
  completedAt?: InputMaybe<Scalars["FuzzyDateInt"]["input"]>;
  completedAt_greater?: InputMaybe<Scalars["FuzzyDateInt"]["input"]>;
  completedAt_lesser?: InputMaybe<Scalars["FuzzyDateInt"]["input"]>;
  completedAt_like?: InputMaybe<Scalars["String"]["input"]>;
  forceSingleCompletedList?: InputMaybe<Scalars["Boolean"]["input"]>;
  notes?: InputMaybe<Scalars["String"]["input"]>;
  notes_like?: InputMaybe<Scalars["String"]["input"]>;
  perChunk?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<Array<InputMaybe<MediaListSort>>>;
  startedAt?: InputMaybe<Scalars["FuzzyDateInt"]["input"]>;
  startedAt_greater?: InputMaybe<Scalars["FuzzyDateInt"]["input"]>;
  startedAt_lesser?: InputMaybe<Scalars["FuzzyDateInt"]["input"]>;
  startedAt_like?: InputMaybe<Scalars["String"]["input"]>;
  status?: InputMaybe<MediaListStatus>;
  status_in?: InputMaybe<Array<InputMaybe<MediaListStatus>>>;
  status_not?: InputMaybe<MediaListStatus>;
  status_not_in?: InputMaybe<Array<InputMaybe<MediaListStatus>>>;
  type?: InputMaybe<MediaType>;
  userId?: InputMaybe<Scalars["Int"]["input"]>;
  userName?: InputMaybe<Scalars["String"]["input"]>;
}

export interface QueryMediaTagCollectionArgs {
  status?: InputMaybe<Scalars["Int"]["input"]>;
}

export interface QueryMediaTrendArgs {
  averageScore?: InputMaybe<Scalars["Int"]["input"]>;
  averageScore_greater?: InputMaybe<Scalars["Int"]["input"]>;
  averageScore_lesser?: InputMaybe<Scalars["Int"]["input"]>;
  averageScore_not?: InputMaybe<Scalars["Int"]["input"]>;
  date?: InputMaybe<Scalars["Int"]["input"]>;
  date_greater?: InputMaybe<Scalars["Int"]["input"]>;
  date_lesser?: InputMaybe<Scalars["Int"]["input"]>;
  episode?: InputMaybe<Scalars["Int"]["input"]>;
  episode_greater?: InputMaybe<Scalars["Int"]["input"]>;
  episode_lesser?: InputMaybe<Scalars["Int"]["input"]>;
  episode_not?: InputMaybe<Scalars["Int"]["input"]>;
  mediaId?: InputMaybe<Scalars["Int"]["input"]>;
  mediaId_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  mediaId_not?: InputMaybe<Scalars["Int"]["input"]>;
  mediaId_not_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  popularity?: InputMaybe<Scalars["Int"]["input"]>;
  popularity_greater?: InputMaybe<Scalars["Int"]["input"]>;
  popularity_lesser?: InputMaybe<Scalars["Int"]["input"]>;
  popularity_not?: InputMaybe<Scalars["Int"]["input"]>;
  releasing?: InputMaybe<Scalars["Boolean"]["input"]>;
  sort?: InputMaybe<Array<InputMaybe<MediaTrendSort>>>;
  trending?: InputMaybe<Scalars["Int"]["input"]>;
  trending_greater?: InputMaybe<Scalars["Int"]["input"]>;
  trending_lesser?: InputMaybe<Scalars["Int"]["input"]>;
  trending_not?: InputMaybe<Scalars["Int"]["input"]>;
}

export interface QueryNotificationArgs {
  resetNotificationCount?: InputMaybe<Scalars["Boolean"]["input"]>;
  type?: InputMaybe<NotificationType>;
  type_in?: InputMaybe<Array<InputMaybe<NotificationType>>>;
}

export interface QueryPageArgs {
  page?: InputMaybe<Scalars["Int"]["input"]>;
  perPage?: InputMaybe<Scalars["Int"]["input"]>;
}

export interface QueryRecommendationArgs {
  id?: InputMaybe<Scalars["Int"]["input"]>;
  mediaId?: InputMaybe<Scalars["Int"]["input"]>;
  mediaRecommendationId?: InputMaybe<Scalars["Int"]["input"]>;
  onList?: InputMaybe<Scalars["Boolean"]["input"]>;
  rating?: InputMaybe<Scalars["Int"]["input"]>;
  rating_greater?: InputMaybe<Scalars["Int"]["input"]>;
  rating_lesser?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<Array<InputMaybe<RecommendationSort>>>;
  userId?: InputMaybe<Scalars["Int"]["input"]>;
}

export interface QueryReviewArgs {
  id?: InputMaybe<Scalars["Int"]["input"]>;
  mediaId?: InputMaybe<Scalars["Int"]["input"]>;
  mediaType?: InputMaybe<MediaType>;
  sort?: InputMaybe<Array<InputMaybe<ReviewSort>>>;
  userId?: InputMaybe<Scalars["Int"]["input"]>;
}

export interface QueryStaffArgs {
  id?: InputMaybe<Scalars["Int"]["input"]>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  id_not?: InputMaybe<Scalars["Int"]["input"]>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  isBirthday?: InputMaybe<Scalars["Boolean"]["input"]>;
  search?: InputMaybe<Scalars["String"]["input"]>;
  sort?: InputMaybe<Array<InputMaybe<StaffSort>>>;
}

export interface QueryStudioArgs {
  id?: InputMaybe<Scalars["Int"]["input"]>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  id_not?: InputMaybe<Scalars["Int"]["input"]>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  search?: InputMaybe<Scalars["String"]["input"]>;
  sort?: InputMaybe<Array<InputMaybe<StudioSort>>>;
}

export interface QueryThreadArgs {
  categoryId?: InputMaybe<Scalars["Int"]["input"]>;
  id?: InputMaybe<Scalars["Int"]["input"]>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  mediaCategoryId?: InputMaybe<Scalars["Int"]["input"]>;
  replyUserId?: InputMaybe<Scalars["Int"]["input"]>;
  search?: InputMaybe<Scalars["String"]["input"]>;
  sort?: InputMaybe<Array<InputMaybe<ThreadSort>>>;
  subscribed?: InputMaybe<Scalars["Boolean"]["input"]>;
  userId?: InputMaybe<Scalars["Int"]["input"]>;
}

export interface QueryThreadCommentArgs {
  id?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<Array<InputMaybe<ThreadCommentSort>>>;
  threadId?: InputMaybe<Scalars["Int"]["input"]>;
  userId?: InputMaybe<Scalars["Int"]["input"]>;
}

export interface QueryUserArgs {
  id?: InputMaybe<Scalars["Int"]["input"]>;
  isModerator?: InputMaybe<Scalars["Boolean"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  search?: InputMaybe<Scalars["String"]["input"]>;
  sort?: InputMaybe<Array<InputMaybe<UserSort>>>;
}

/** Media recommendation */
export interface Recommendation {
  __typename?: "Recommendation";
  /** The id of the recommendation */
  id: Scalars["Int"]["output"];
  /** The media the recommendation is from */
  media?: Maybe<Media>;
  /** The recommended media */
  mediaRecommendation?: Maybe<Media>;
  /** Users rating of the recommendation */
  rating?: Maybe<Scalars["Int"]["output"]>;
  /** The user that first created the recommendation */
  user?: Maybe<User>;
  /** The rating of the recommendation by currently authenticated user */
  userRating?: Maybe<RecommendationRating>;
}

export interface RecommendationConnection {
  __typename?: "RecommendationConnection";
  edges?: Maybe<Array<Maybe<RecommendationEdge>>>;
  nodes?: Maybe<Array<Maybe<Recommendation>>>;
  /** The pagination information */
  pageInfo?: Maybe<PageInfo>;
}

/** Recommendation connection edge */
export interface RecommendationEdge {
  __typename?: "RecommendationEdge";
  node?: Maybe<Recommendation>;
}

/** Recommendation rating enums */
export enum RecommendationRating {
  NoRating = "NO_RATING",
  RateDown = "RATE_DOWN",
  RateUp = "RATE_UP",
}

/** Recommendation sort enums */
export enum RecommendationSort {
  Id = "ID",
  IdDesc = "ID_DESC",
  Rating = "RATING",
  RatingDesc = "RATING_DESC",
}

/** Notification for when new media is added to the site */
export interface RelatedMediaAdditionNotification {
  __typename?: "RelatedMediaAdditionNotification";
  /** The notification context text */
  context?: Maybe<Scalars["String"]["output"]>;
  /** The time the notification was created at */
  createdAt?: Maybe<Scalars["Int"]["output"]>;
  /** The id of the Notification */
  id: Scalars["Int"]["output"];
  /** The associated media of the airing schedule */
  media?: Maybe<Media>;
  /** The id of the new media */
  mediaId: Scalars["Int"]["output"];
  /** The type of notification */
  type?: Maybe<NotificationType>;
}

export interface Report {
  __typename?: "Report";
  cleared?: Maybe<Scalars["Boolean"]["output"]>;
  /** When the entry data was created */
  createdAt?: Maybe<Scalars["Int"]["output"]>;
  id: Scalars["Int"]["output"];
  reason?: Maybe<Scalars["String"]["output"]>;
  reported?: Maybe<User>;
  reporter?: Maybe<User>;
}

/** A Review that features in an anime or manga */
export interface Review {
  __typename?: "Review";
  /** The main review body text */
  body?: Maybe<Scalars["String"]["output"]>;
  /** The time of the thread creation */
  createdAt: Scalars["Int"]["output"];
  /** The id of the review */
  id: Scalars["Int"]["output"];
  /** The media the review is of */
  media?: Maybe<Media>;
  /** The id of the review's media */
  mediaId: Scalars["Int"]["output"];
  /** For which type of media the review is for */
  mediaType?: Maybe<MediaType>;
  /** If the review is not yet publicly published and is only viewable by creator */
  private?: Maybe<Scalars["Boolean"]["output"]>;
  /** The total user rating of the review */
  rating?: Maybe<Scalars["Int"]["output"]>;
  /** The amount of user ratings of the review */
  ratingAmount?: Maybe<Scalars["Int"]["output"]>;
  /** The review score of the media */
  score?: Maybe<Scalars["Int"]["output"]>;
  /** The url for the review page on the AniList website */
  siteUrl?: Maybe<Scalars["String"]["output"]>;
  /** A short summary of the review */
  summary?: Maybe<Scalars["String"]["output"]>;
  /** The time of the thread last update */
  updatedAt: Scalars["Int"]["output"];
  /** The creator of the review */
  user?: Maybe<User>;
  /** The id of the review's creator */
  userId: Scalars["Int"]["output"];
  /** The rating of the review by currently authenticated user */
  userRating?: Maybe<ReviewRating>;
}

/** A Review that features in an anime or manga */
export interface ReviewBodyArgs {
  asHtml?: InputMaybe<Scalars["Boolean"]["input"]>;
}

export interface ReviewConnection {
  __typename?: "ReviewConnection";
  edges?: Maybe<Array<Maybe<ReviewEdge>>>;
  nodes?: Maybe<Array<Maybe<Review>>>;
  /** The pagination information */
  pageInfo?: Maybe<PageInfo>;
}

/** Review connection edge */
export interface ReviewEdge {
  __typename?: "ReviewEdge";
  node?: Maybe<Review>;
}

/** Review rating enums */
export enum ReviewRating {
  DownVote = "DOWN_VOTE",
  NoVote = "NO_VOTE",
  UpVote = "UP_VOTE",
}

/** Review sort enums */
export enum ReviewSort {
  CreatedAt = "CREATED_AT",
  CreatedAtDesc = "CREATED_AT_DESC",
  Id = "ID",
  IdDesc = "ID_DESC",
  Rating = "RATING",
  RatingDesc = "RATING_DESC",
  Score = "SCORE",
  ScoreDesc = "SCORE_DESC",
  UpdatedAt = "UPDATED_AT",
  UpdatedAtDesc = "UPDATED_AT_DESC",
}

/** Feed of mod edit activity */
export interface RevisionHistory {
  __typename?: "RevisionHistory";
  /** The action taken on the objects */
  action?: Maybe<RevisionHistoryAction>;
  /** A JSON object of the fields that changed */
  changes?: Maybe<Scalars["Json"]["output"]>;
  /** The character the mod feed entry references */
  character?: Maybe<Character>;
  /** When the mod feed entry was created */
  createdAt?: Maybe<Scalars["Int"]["output"]>;
  /** The external link source the mod feed entry references */
  externalLink?: Maybe<MediaExternalLink>;
  /** The id of the media */
  id: Scalars["Int"]["output"];
  /** The media the mod feed entry references */
  media?: Maybe<Media>;
  /** The staff member the mod feed entry references */
  staff?: Maybe<Staff>;
  /** The studio the mod feed entry references */
  studio?: Maybe<Studio>;
  /** The user who made the edit to the object */
  user?: Maybe<User>;
}

/** Revision history actions */
export enum RevisionHistoryAction {
  Create = "CREATE",
  Edit = "EDIT",
}

/** A user's list score distribution. */
export interface ScoreDistribution {
  __typename?: "ScoreDistribution";
  /** The amount of list entries with this score */
  amount?: Maybe<Scalars["Int"]["output"]>;
  score?: Maybe<Scalars["Int"]["output"]>;
}

/** Media list scoring type */
export enum ScoreFormat {
  /** An integer from 0-3. Should be represented in Smileys. 0 => No Score, 1 => :(, 2 => :|, 3 => :) */
  Point_3 = "POINT_3",
  /** An integer from 0-5. Should be represented in Stars */
  Point_5 = "POINT_5",
  /** An integer from 0-10 */
  Point_10 = "POINT_10",
  /** A float from 0-10 with 1 decimal place */
  Point_10Decimal = "POINT_10_DECIMAL",
  /** An integer from 0-100 */
  Point_100 = "POINT_100",
}

export interface SiteStatistics {
  __typename?: "SiteStatistics";
  anime?: Maybe<SiteTrendConnection>;
  characters?: Maybe<SiteTrendConnection>;
  manga?: Maybe<SiteTrendConnection>;
  reviews?: Maybe<SiteTrendConnection>;
  staff?: Maybe<SiteTrendConnection>;
  studios?: Maybe<SiteTrendConnection>;
  users?: Maybe<SiteTrendConnection>;
}

export interface SiteStatisticsAnimeArgs {
  page?: InputMaybe<Scalars["Int"]["input"]>;
  perPage?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<Array<InputMaybe<SiteTrendSort>>>;
}

export interface SiteStatisticsCharactersArgs {
  page?: InputMaybe<Scalars["Int"]["input"]>;
  perPage?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<Array<InputMaybe<SiteTrendSort>>>;
}

export interface SiteStatisticsMangaArgs {
  page?: InputMaybe<Scalars["Int"]["input"]>;
  perPage?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<Array<InputMaybe<SiteTrendSort>>>;
}

export interface SiteStatisticsReviewsArgs {
  page?: InputMaybe<Scalars["Int"]["input"]>;
  perPage?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<Array<InputMaybe<SiteTrendSort>>>;
}

export interface SiteStatisticsStaffArgs {
  page?: InputMaybe<Scalars["Int"]["input"]>;
  perPage?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<Array<InputMaybe<SiteTrendSort>>>;
}

export interface SiteStatisticsStudiosArgs {
  page?: InputMaybe<Scalars["Int"]["input"]>;
  perPage?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<Array<InputMaybe<SiteTrendSort>>>;
}

export interface SiteStatisticsUsersArgs {
  page?: InputMaybe<Scalars["Int"]["input"]>;
  perPage?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<Array<InputMaybe<SiteTrendSort>>>;
}

/** Daily site statistics */
export interface SiteTrend {
  __typename?: "SiteTrend";
  /** The change from yesterday */
  change: Scalars["Int"]["output"];
  count: Scalars["Int"]["output"];
  /** The day the data was recorded (timestamp) */
  date: Scalars["Int"]["output"];
}

export interface SiteTrendConnection {
  __typename?: "SiteTrendConnection";
  edges?: Maybe<Array<Maybe<SiteTrendEdge>>>;
  nodes?: Maybe<Array<Maybe<SiteTrend>>>;
  /** The pagination information */
  pageInfo?: Maybe<PageInfo>;
}

/** Site trend connection edge */
export interface SiteTrendEdge {
  __typename?: "SiteTrendEdge";
  node?: Maybe<SiteTrend>;
}

/** Site trend sort enums */
export enum SiteTrendSort {
  Change = "CHANGE",
  ChangeDesc = "CHANGE_DESC",
  Count = "COUNT",
  CountDesc = "COUNT_DESC",
  Date = "DATE",
  DateDesc = "DATE_DESC",
}

/** Voice actors or production staff */
export interface Staff {
  __typename?: "Staff";
  /** The person's age in years */
  age?: Maybe<Scalars["Int"]["output"]>;
  /** The persons blood type */
  bloodType?: Maybe<Scalars["String"]["output"]>;
  /** Media the actor voiced characters in. (Same data as characters with media as node instead of characters) */
  characterMedia?: Maybe<MediaConnection>;
  /** Characters voiced by the actor */
  characters?: Maybe<CharacterConnection>;
  dateOfBirth?: Maybe<FuzzyDate>;
  dateOfDeath?: Maybe<FuzzyDate>;
  /** A general description of the staff member */
  description?: Maybe<Scalars["String"]["output"]>;
  /** The amount of user's who have favourited the staff member */
  favourites?: Maybe<Scalars["Int"]["output"]>;
  /** The staff's gender. Usually Male, Female, or Non-binary but can be any string. */
  gender?: Maybe<Scalars["String"]["output"]>;
  /** The persons birthplace or hometown */
  homeTown?: Maybe<Scalars["String"]["output"]>;
  /** The id of the staff member */
  id: Scalars["Int"]["output"];
  /** The staff images */
  image?: Maybe<StaffImage>;
  /** If the staff member is marked as favourite by the currently authenticated user */
  isFavourite: Scalars["Boolean"]["output"];
  /** If the staff member is blocked from being added to favourites */
  isFavouriteBlocked: Scalars["Boolean"]["output"];
  /**
   * The primary language the staff member dub's in
   * @deprecated Replaced with languageV2
   */
  language?: Maybe<StaffLanguage>;
  /** The primary language of the staff member. Current values: Japanese, English, Korean, Italian, Spanish, Portuguese, French, German, Hebrew, Hungarian, Chinese, Arabic, Filipino, Catalan, Finnish, Turkish, Dutch, Swedish, Thai, Tagalog, Malaysian, Indonesian, Vietnamese, Nepali, Hindi, Urdu */
  languageV2?: Maybe<Scalars["String"]["output"]>;
  /** Notes for site moderators */
  modNotes?: Maybe<Scalars["String"]["output"]>;
  /** The names of the staff member */
  name?: Maybe<StaffName>;
  /** The person's primary occupations */
  primaryOccupations?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  /** The url for the staff page on the AniList website */
  siteUrl?: Maybe<Scalars["String"]["output"]>;
  /** Staff member that the submission is referencing */
  staff?: Maybe<Staff>;
  /** Media where the staff member has a production role */
  staffMedia?: Maybe<MediaConnection>;
  /** Inner details of submission status */
  submissionNotes?: Maybe<Scalars["String"]["output"]>;
  /** Status of the submission */
  submissionStatus?: Maybe<Scalars["Int"]["output"]>;
  /** Submitter for the submission */
  submitter?: Maybe<User>;
  /** @deprecated No data available */
  updatedAt?: Maybe<Scalars["Int"]["output"]>;
  /** [startYear, endYear] (If the 2nd value is not present staff is still active) */
  yearsActive?: Maybe<Array<Maybe<Scalars["Int"]["output"]>>>;
}

/** Voice actors or production staff */
export interface StaffCharacterMediaArgs {
  onList?: InputMaybe<Scalars["Boolean"]["input"]>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
  perPage?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<Array<InputMaybe<MediaSort>>>;
}

/** Voice actors or production staff */
export interface StaffCharactersArgs {
  page?: InputMaybe<Scalars["Int"]["input"]>;
  perPage?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<Array<InputMaybe<CharacterSort>>>;
}

/** Voice actors or production staff */
export interface StaffDescriptionArgs {
  asHtml?: InputMaybe<Scalars["Boolean"]["input"]>;
}

/** Voice actors or production staff */
export interface StaffStaffMediaArgs {
  onList?: InputMaybe<Scalars["Boolean"]["input"]>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
  perPage?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<Array<InputMaybe<MediaSort>>>;
  type?: InputMaybe<MediaType>;
}

export interface StaffConnection {
  __typename?: "StaffConnection";
  edges?: Maybe<Array<Maybe<StaffEdge>>>;
  nodes?: Maybe<Array<Maybe<Staff>>>;
  /** The pagination information */
  pageInfo?: Maybe<PageInfo>;
}

/** Staff connection edge */
export interface StaffEdge {
  __typename?: "StaffEdge";
  /** The order the staff should be displayed from the users favourites */
  favouriteOrder?: Maybe<Scalars["Int"]["output"]>;
  /** The id of the connection */
  id?: Maybe<Scalars["Int"]["output"]>;
  node?: Maybe<Staff>;
  /** The role of the staff member in the production of the media */
  role?: Maybe<Scalars["String"]["output"]>;
}

export interface StaffImage {
  __typename?: "StaffImage";
  /** The person's image of media at its largest size */
  large?: Maybe<Scalars["String"]["output"]>;
  /** The person's image of media at medium size */
  medium?: Maybe<Scalars["String"]["output"]>;
}

/** The primary language of the voice actor */
export enum StaffLanguage {
  /** English */
  English = "ENGLISH",
  /** French */
  French = "FRENCH",
  /** German */
  German = "GERMAN",
  /** Hebrew */
  Hebrew = "HEBREW",
  /** Hungarian */
  Hungarian = "HUNGARIAN",
  /** Italian */
  Italian = "ITALIAN",
  /** Japanese */
  Japanese = "JAPANESE",
  /** Korean */
  Korean = "KOREAN",
  /** Portuguese */
  Portuguese = "PORTUGUESE",
  /** Spanish */
  Spanish = "SPANISH",
}

/** The names of the staff member */
export interface StaffName {
  __typename?: "StaffName";
  /** Other names the staff member might be referred to as (pen names) */
  alternative?: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  /** The person's given name */
  first?: Maybe<Scalars["String"]["output"]>;
  /** The person's first and last name */
  full?: Maybe<Scalars["String"]["output"]>;
  /** The person's surname */
  last?: Maybe<Scalars["String"]["output"]>;
  /** The person's middle name */
  middle?: Maybe<Scalars["String"]["output"]>;
  /** The person's full name in their native language */
  native?: Maybe<Scalars["String"]["output"]>;
  /** The currently authenticated users preferred name language. Default romaji for non-authenticated */
  userPreferred?: Maybe<Scalars["String"]["output"]>;
}

/** The names of the staff member */
export interface StaffNameInput {
  /** Other names the character might be referred by */
  alternative?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  /** The person's given name */
  first?: InputMaybe<Scalars["String"]["input"]>;
  /** The person's surname */
  last?: InputMaybe<Scalars["String"]["input"]>;
  /** The person's middle name */
  middle?: InputMaybe<Scalars["String"]["input"]>;
  /** The person's full name in their native language */
  native?: InputMaybe<Scalars["String"]["input"]>;
}

/** Voice actor role for a character */
export interface StaffRoleType {
  __typename?: "StaffRoleType";
  /** Used for grouping roles where multiple dubs exist for the same language. Either dubbing company name or language variant. */
  dubGroup?: Maybe<Scalars["String"]["output"]>;
  /** Notes regarding the VA's role for the character */
  roleNotes?: Maybe<Scalars["String"]["output"]>;
  /** The voice actors of the character */
  voiceActor?: Maybe<Staff>;
}

/** Staff sort enums */
export enum StaffSort {
  Favourites = "FAVOURITES",
  FavouritesDesc = "FAVOURITES_DESC",
  Id = "ID",
  IdDesc = "ID_DESC",
  Language = "LANGUAGE",
  LanguageDesc = "LANGUAGE_DESC",
  /** Order manually decided by moderators */
  Relevance = "RELEVANCE",
  Role = "ROLE",
  RoleDesc = "ROLE_DESC",
  SearchMatch = "SEARCH_MATCH",
}

/** User's staff statistics */
export interface StaffStats {
  __typename?: "StaffStats";
  amount?: Maybe<Scalars["Int"]["output"]>;
  meanScore?: Maybe<Scalars["Int"]["output"]>;
  staff?: Maybe<Staff>;
  /** The amount of time in minutes the staff member has been watched by the user */
  timeWatched?: Maybe<Scalars["Int"]["output"]>;
}

/** A submission for a staff that features in an anime or manga */
export interface StaffSubmission {
  __typename?: "StaffSubmission";
  /** Data Mod assigned to handle the submission */
  assignee?: Maybe<User>;
  createdAt?: Maybe<Scalars["Int"]["output"]>;
  /** The id of the submission */
  id: Scalars["Int"]["output"];
  /** Whether the submission is locked */
  locked?: Maybe<Scalars["Boolean"]["output"]>;
  /** Inner details of submission status */
  notes?: Maybe<Scalars["String"]["output"]>;
  source?: Maybe<Scalars["String"]["output"]>;
  /** Staff that the submission is referencing */
  staff?: Maybe<Staff>;
  /** Status of the submission */
  status?: Maybe<SubmissionStatus>;
  /** The staff submission changes */
  submission?: Maybe<Staff>;
  /** Submitter for the submission */
  submitter?: Maybe<User>;
}

/** The distribution of the watching/reading status of media or a user's list */
export interface StatusDistribution {
  __typename?: "StatusDistribution";
  /** The amount of entries with this status */
  amount?: Maybe<Scalars["Int"]["output"]>;
  /** The day the activity took place (Unix timestamp) */
  status?: Maybe<MediaListStatus>;
}

/** Animation or production company */
export interface Studio {
  __typename?: "Studio";
  /** The amount of user's who have favourited the studio */
  favourites?: Maybe<Scalars["Int"]["output"]>;
  /** The id of the studio */
  id: Scalars["Int"]["output"];
  /** If the studio is an animation studio or a different kind of company */
  isAnimationStudio: Scalars["Boolean"]["output"];
  /** If the studio is marked as favourite by the currently authenticated user */
  isFavourite: Scalars["Boolean"]["output"];
  /** The media the studio has worked on */
  media?: Maybe<MediaConnection>;
  /** The name of the studio */
  name: Scalars["String"]["output"];
  /** The url for the studio page on the AniList website */
  siteUrl?: Maybe<Scalars["String"]["output"]>;
}

/** Animation or production company */
export interface StudioMediaArgs {
  isMain?: InputMaybe<Scalars["Boolean"]["input"]>;
  onList?: InputMaybe<Scalars["Boolean"]["input"]>;
  page?: InputMaybe<Scalars["Int"]["input"]>;
  perPage?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<Array<InputMaybe<MediaSort>>>;
}

export interface StudioConnection {
  __typename?: "StudioConnection";
  edges?: Maybe<Array<Maybe<StudioEdge>>>;
  nodes?: Maybe<Array<Maybe<Studio>>>;
  /** The pagination information */
  pageInfo?: Maybe<PageInfo>;
}

/** Studio connection edge */
export interface StudioEdge {
  __typename?: "StudioEdge";
  /** The order the character should be displayed from the users favourites */
  favouriteOrder?: Maybe<Scalars["Int"]["output"]>;
  /** The id of the connection */
  id?: Maybe<Scalars["Int"]["output"]>;
  /** If the studio is the main animation studio of the anime */
  isMain: Scalars["Boolean"]["output"];
  node?: Maybe<Studio>;
}

/** Studio sort enums */
export enum StudioSort {
  Favourites = "FAVOURITES",
  FavouritesDesc = "FAVOURITES_DESC",
  Id = "ID",
  IdDesc = "ID_DESC",
  Name = "NAME",
  NameDesc = "NAME_DESC",
  SearchMatch = "SEARCH_MATCH",
}

/** User's studio statistics */
export interface StudioStats {
  __typename?: "StudioStats";
  amount?: Maybe<Scalars["Int"]["output"]>;
  meanScore?: Maybe<Scalars["Int"]["output"]>;
  studio?: Maybe<Studio>;
  /** The amount of time in minutes the studio's works have been watched by the user */
  timeWatched?: Maybe<Scalars["Int"]["output"]>;
}

/** Submission sort enums */
export enum SubmissionSort {
  Id = "ID",
  IdDesc = "ID_DESC",
}

/** Submission status */
export enum SubmissionStatus {
  Accepted = "ACCEPTED",
  PartiallyAccepted = "PARTIALLY_ACCEPTED",
  Pending = "PENDING",
  Rejected = "REJECTED",
}

/** User's tag statistics */
export interface TagStats {
  __typename?: "TagStats";
  amount?: Maybe<Scalars["Int"]["output"]>;
  meanScore?: Maybe<Scalars["Int"]["output"]>;
  tag?: Maybe<MediaTag>;
  /** The amount of time in minutes the tag has been watched by the user */
  timeWatched?: Maybe<Scalars["Int"]["output"]>;
}

/** User text activity */
export interface TextActivity {
  __typename?: "TextActivity";
  /** The time the activity was created at */
  createdAt: Scalars["Int"]["output"];
  /** The id of the activity */
  id: Scalars["Int"]["output"];
  /** If the currently authenticated user liked the activity */
  isLiked?: Maybe<Scalars["Boolean"]["output"]>;
  /** If the activity is locked and can receive replies */
  isLocked?: Maybe<Scalars["Boolean"]["output"]>;
  /** If the activity is pinned to the top of the users activity feed */
  isPinned?: Maybe<Scalars["Boolean"]["output"]>;
  /** If the currently authenticated user is subscribed to the activity */
  isSubscribed?: Maybe<Scalars["Boolean"]["output"]>;
  /** The amount of likes the activity has */
  likeCount: Scalars["Int"]["output"];
  /** The users who liked the activity */
  likes?: Maybe<Array<Maybe<User>>>;
  /** The written replies to the activity */
  replies?: Maybe<Array<Maybe<ActivityReply>>>;
  /** The number of activity replies */
  replyCount: Scalars["Int"]["output"];
  /** The url for the activity page on the AniList website */
  siteUrl?: Maybe<Scalars["String"]["output"]>;
  /** The status text (Markdown) */
  text?: Maybe<Scalars["String"]["output"]>;
  /** The type of activity */
  type?: Maybe<ActivityType>;
  /** The user who created the activity */
  user?: Maybe<User>;
  /** The user id of the activity's creator */
  userId?: Maybe<Scalars["Int"]["output"]>;
}

/** User text activity */
export interface TextActivityTextArgs {
  asHtml?: InputMaybe<Scalars["Boolean"]["input"]>;
}

/** Forum Thread */
export interface Thread {
  __typename?: "Thread";
  /** The text body of the thread (Markdown) */
  body?: Maybe<Scalars["String"]["output"]>;
  /** The categories of the thread */
  categories?: Maybe<Array<Maybe<ThreadCategory>>>;
  /** The time of the thread creation */
  createdAt: Scalars["Int"]["output"];
  /** The id of the thread */
  id: Scalars["Int"]["output"];
  /** If the currently authenticated user liked the thread */
  isLiked?: Maybe<Scalars["Boolean"]["output"]>;
  /** If the thread is locked and can receive comments */
  isLocked?: Maybe<Scalars["Boolean"]["output"]>;
  /** If the thread is stickied and should be displayed at the top of the page */
  isSticky?: Maybe<Scalars["Boolean"]["output"]>;
  /** If the currently authenticated user is subscribed to the thread */
  isSubscribed?: Maybe<Scalars["Boolean"]["output"]>;
  /** The amount of likes the thread has */
  likeCount: Scalars["Int"]["output"];
  /** The users who liked the thread */
  likes?: Maybe<Array<Maybe<User>>>;
  /** The media categories of the thread */
  mediaCategories?: Maybe<Array<Maybe<Media>>>;
  /** The time of the last reply */
  repliedAt?: Maybe<Scalars["Int"]["output"]>;
  /** The id of the most recent comment on the thread */
  replyCommentId?: Maybe<Scalars["Int"]["output"]>;
  /** The number of comments on the thread */
  replyCount?: Maybe<Scalars["Int"]["output"]>;
  /** The user to last reply to the thread */
  replyUser?: Maybe<User>;
  /** The id of the user who most recently commented on the thread */
  replyUserId?: Maybe<Scalars["Int"]["output"]>;
  /** The url for the thread page on the AniList website */
  siteUrl?: Maybe<Scalars["String"]["output"]>;
  /** The title of the thread */
  title?: Maybe<Scalars["String"]["output"]>;
  /** The time of the thread last update */
  updatedAt: Scalars["Int"]["output"];
  /** The owner of the thread */
  user?: Maybe<User>;
  /** The id of the thread owner user */
  userId: Scalars["Int"]["output"];
  /** The number of times users have viewed the thread */
  viewCount?: Maybe<Scalars["Int"]["output"]>;
}

/** Forum Thread */
export interface ThreadBodyArgs {
  asHtml?: InputMaybe<Scalars["Boolean"]["input"]>;
}

/** A forum thread category */
export interface ThreadCategory {
  __typename?: "ThreadCategory";
  /** The id of the category */
  id: Scalars["Int"]["output"];
  /** The name of the category */
  name: Scalars["String"]["output"];
}

/** Forum Thread Comment */
export interface ThreadComment {
  __typename?: "ThreadComment";
  /** The comment's child reply comments */
  childComments?: Maybe<Scalars["Json"]["output"]>;
  /** The text content of the comment (Markdown) */
  comment?: Maybe<Scalars["String"]["output"]>;
  /** The time of the comments creation */
  createdAt: Scalars["Int"]["output"];
  /** The id of the comment */
  id: Scalars["Int"]["output"];
  /** If the currently authenticated user liked the comment */
  isLiked?: Maybe<Scalars["Boolean"]["output"]>;
  /** If the comment tree is locked and may not receive replies or edits */
  isLocked?: Maybe<Scalars["Boolean"]["output"]>;
  /** The amount of likes the comment has */
  likeCount: Scalars["Int"]["output"];
  /** The users who liked the comment */
  likes?: Maybe<Array<Maybe<User>>>;
  /** The url for the comment page on the AniList website */
  siteUrl?: Maybe<Scalars["String"]["output"]>;
  /** The thread the comment belongs to */
  thread?: Maybe<Thread>;
  /** The id of thread the comment belongs to */
  threadId?: Maybe<Scalars["Int"]["output"]>;
  /** The time of the comments last update */
  updatedAt: Scalars["Int"]["output"];
  /** The user who created the comment */
  user?: Maybe<User>;
  /** The user id of the comment's owner */
  userId?: Maybe<Scalars["Int"]["output"]>;
}

/** Forum Thread Comment */
export interface ThreadCommentCommentArgs {
  asHtml?: InputMaybe<Scalars["Boolean"]["input"]>;
}

/** Notification for when a thread comment is liked */
export interface ThreadCommentLikeNotification {
  __typename?: "ThreadCommentLikeNotification";
  /** The thread comment that was liked */
  comment?: Maybe<ThreadComment>;
  /** The id of the activity which was liked */
  commentId: Scalars["Int"]["output"];
  /** The notification context text */
  context?: Maybe<Scalars["String"]["output"]>;
  /** The time the notification was created at */
  createdAt?: Maybe<Scalars["Int"]["output"]>;
  /** The id of the Notification */
  id: Scalars["Int"]["output"];
  /** The thread that the relevant comment belongs to */
  thread?: Maybe<Thread>;
  /** The type of notification */
  type?: Maybe<NotificationType>;
  /** The user who liked the activity */
  user?: Maybe<User>;
  /** The id of the user who liked to the activity */
  userId: Scalars["Int"]["output"];
}

/** Notification for when authenticated user is @ mentioned in a forum thread comment */
export interface ThreadCommentMentionNotification {
  __typename?: "ThreadCommentMentionNotification";
  /** The thread comment that included the @ mention */
  comment?: Maybe<ThreadComment>;
  /** The id of the comment where mentioned */
  commentId: Scalars["Int"]["output"];
  /** The notification context text */
  context?: Maybe<Scalars["String"]["output"]>;
  /** The time the notification was created at */
  createdAt?: Maybe<Scalars["Int"]["output"]>;
  /** The id of the Notification */
  id: Scalars["Int"]["output"];
  /** The thread that the relevant comment belongs to */
  thread?: Maybe<Thread>;
  /** The type of notification */
  type?: Maybe<NotificationType>;
  /** The user who mentioned the authenticated user */
  user?: Maybe<User>;
  /** The id of the user who mentioned the authenticated user */
  userId: Scalars["Int"]["output"];
}

/** Notification for when a user replies to your forum thread comment */
export interface ThreadCommentReplyNotification {
  __typename?: "ThreadCommentReplyNotification";
  /** The reply thread comment */
  comment?: Maybe<ThreadComment>;
  /** The id of the reply comment */
  commentId: Scalars["Int"]["output"];
  /** The notification context text */
  context?: Maybe<Scalars["String"]["output"]>;
  /** The time the notification was created at */
  createdAt?: Maybe<Scalars["Int"]["output"]>;
  /** The id of the Notification */
  id: Scalars["Int"]["output"];
  /** The thread that the relevant comment belongs to */
  thread?: Maybe<Thread>;
  /** The type of notification */
  type?: Maybe<NotificationType>;
  /** The user who replied to the activity */
  user?: Maybe<User>;
  /** The id of the user who create the comment reply */
  userId: Scalars["Int"]["output"];
}

/** Thread comments sort enums */
export enum ThreadCommentSort {
  Id = "ID",
  IdDesc = "ID_DESC",
}

/** Notification for when a user replies to a subscribed forum thread */
export interface ThreadCommentSubscribedNotification {
  __typename?: "ThreadCommentSubscribedNotification";
  /** The reply thread comment */
  comment?: Maybe<ThreadComment>;
  /** The id of the new comment in the subscribed thread */
  commentId: Scalars["Int"]["output"];
  /** The notification context text */
  context?: Maybe<Scalars["String"]["output"]>;
  /** The time the notification was created at */
  createdAt?: Maybe<Scalars["Int"]["output"]>;
  /** The id of the Notification */
  id: Scalars["Int"]["output"];
  /** The thread that the relevant comment belongs to */
  thread?: Maybe<Thread>;
  /** The type of notification */
  type?: Maybe<NotificationType>;
  /** The user who replied to the subscribed thread */
  user?: Maybe<User>;
  /** The id of the user who commented on the thread */
  userId: Scalars["Int"]["output"];
}

/** Notification for when a thread is liked */
export interface ThreadLikeNotification {
  __typename?: "ThreadLikeNotification";
  /** The liked thread comment */
  comment?: Maybe<ThreadComment>;
  /** The notification context text */
  context?: Maybe<Scalars["String"]["output"]>;
  /** The time the notification was created at */
  createdAt?: Maybe<Scalars["Int"]["output"]>;
  /** The id of the Notification */
  id: Scalars["Int"]["output"];
  /** The thread that the relevant comment belongs to */
  thread?: Maybe<Thread>;
  /** The id of the thread which was liked */
  threadId: Scalars["Int"]["output"];
  /** The type of notification */
  type?: Maybe<NotificationType>;
  /** The user who liked the activity */
  user?: Maybe<User>;
  /** The id of the user who liked to the activity */
  userId: Scalars["Int"]["output"];
}

/** Thread sort enums */
export enum ThreadSort {
  CreatedAt = "CREATED_AT",
  CreatedAtDesc = "CREATED_AT_DESC",
  Id = "ID",
  IdDesc = "ID_DESC",
  IsSticky = "IS_STICKY",
  RepliedAt = "REPLIED_AT",
  RepliedAtDesc = "REPLIED_AT_DESC",
  ReplyCount = "REPLY_COUNT",
  ReplyCountDesc = "REPLY_COUNT_DESC",
  SearchMatch = "SEARCH_MATCH",
  Title = "TITLE",
  TitleDesc = "TITLE_DESC",
  UpdatedAt = "UPDATED_AT",
  UpdatedAtDesc = "UPDATED_AT_DESC",
  ViewCount = "VIEW_COUNT",
  ViewCountDesc = "VIEW_COUNT_DESC",
}

/** A user */
export interface User {
  __typename?: "User";
  /** The bio written by user (Markdown) */
  about?: Maybe<Scalars["String"]["output"]>;
  /** The user's avatar images */
  avatar?: Maybe<UserAvatar>;
  /** The user's banner images */
  bannerImage?: Maybe<Scalars["String"]["output"]>;
  bans?: Maybe<Scalars["Json"]["output"]>;
  /** When the user's account was created. (Does not exist for accounts created before 2020) */
  createdAt?: Maybe<Scalars["Int"]["output"]>;
  /** Custom donation badge text */
  donatorBadge?: Maybe<Scalars["String"]["output"]>;
  /** The donation tier of the user */
  donatorTier?: Maybe<Scalars["Int"]["output"]>;
  /** The users favourites */
  favourites?: Maybe<Favourites>;
  /** The id of the user */
  id: Scalars["Int"]["output"];
  /** If the user is blocked by the authenticated user */
  isBlocked?: Maybe<Scalars["Boolean"]["output"]>;
  /** If this user if following the authenticated user */
  isFollower?: Maybe<Scalars["Boolean"]["output"]>;
  /** If the authenticated user if following this user */
  isFollowing?: Maybe<Scalars["Boolean"]["output"]>;
  /** The user's media list options */
  mediaListOptions?: Maybe<MediaListOptions>;
  /** The user's moderator roles if they are a site moderator */
  moderatorRoles?: Maybe<Array<Maybe<ModRole>>>;
  /**
   * If the user is a moderator or data moderator
   * @deprecated Deprecated. Replaced with moderatorRoles field.
   */
  moderatorStatus?: Maybe<Scalars["String"]["output"]>;
  /** The name of the user */
  name: Scalars["String"]["output"];
  /** The user's general options */
  options?: Maybe<UserOptions>;
  /** The user's previously used names. */
  previousNames?: Maybe<Array<Maybe<UserPreviousName>>>;
  /** The url for the user page on the AniList website */
  siteUrl?: Maybe<Scalars["String"]["output"]>;
  /** The users anime & manga list statistics */
  statistics?: Maybe<UserStatisticTypes>;
  /**
   * The user's statistics
   * @deprecated Deprecated. Replaced with statistics field.
   */
  stats?: Maybe<UserStats>;
  /** The number of unread notifications the user has */
  unreadNotificationCount?: Maybe<Scalars["Int"]["output"]>;
  /** When the user's data was last updated */
  updatedAt?: Maybe<Scalars["Int"]["output"]>;
}

/** A user */
export interface UserAboutArgs {
  asHtml?: InputMaybe<Scalars["Boolean"]["input"]>;
}

/** A user */
export interface UserFavouritesArgs {
  page?: InputMaybe<Scalars["Int"]["input"]>;
}

/** A user's activity history stats. */
export interface UserActivityHistory {
  __typename?: "UserActivityHistory";
  /** The amount of activity on the day */
  amount?: Maybe<Scalars["Int"]["output"]>;
  /** The day the activity took place (Unix timestamp) */
  date?: Maybe<Scalars["Int"]["output"]>;
  /** The level of activity represented on a 1-10 scale */
  level?: Maybe<Scalars["Int"]["output"]>;
}

/** A user's avatars */
export interface UserAvatar {
  __typename?: "UserAvatar";
  /** The avatar of user at its largest size */
  large?: Maybe<Scalars["String"]["output"]>;
  /** The avatar of user at medium size */
  medium?: Maybe<Scalars["String"]["output"]>;
}

export interface UserCountryStatistic {
  __typename?: "UserCountryStatistic";
  chaptersRead: Scalars["Int"]["output"];
  count: Scalars["Int"]["output"];
  country?: Maybe<Scalars["CountryCode"]["output"]>;
  meanScore: Scalars["Float"]["output"];
  mediaIds: Array<Maybe<Scalars["Int"]["output"]>>;
  minutesWatched: Scalars["Int"]["output"];
}

export interface UserFormatStatistic {
  __typename?: "UserFormatStatistic";
  chaptersRead: Scalars["Int"]["output"];
  count: Scalars["Int"]["output"];
  format?: Maybe<MediaFormat>;
  meanScore: Scalars["Float"]["output"];
  mediaIds: Array<Maybe<Scalars["Int"]["output"]>>;
  minutesWatched: Scalars["Int"]["output"];
}

export interface UserGenreStatistic {
  __typename?: "UserGenreStatistic";
  chaptersRead: Scalars["Int"]["output"];
  count: Scalars["Int"]["output"];
  genre?: Maybe<Scalars["String"]["output"]>;
  meanScore: Scalars["Float"]["output"];
  mediaIds: Array<Maybe<Scalars["Int"]["output"]>>;
  minutesWatched: Scalars["Int"]["output"];
}

export interface UserLengthStatistic {
  __typename?: "UserLengthStatistic";
  chaptersRead: Scalars["Int"]["output"];
  count: Scalars["Int"]["output"];
  length?: Maybe<Scalars["String"]["output"]>;
  meanScore: Scalars["Float"]["output"];
  mediaIds: Array<Maybe<Scalars["Int"]["output"]>>;
  minutesWatched: Scalars["Int"]["output"];
}

/** User data for moderators */
export interface UserModData {
  __typename?: "UserModData";
  alts?: Maybe<Array<Maybe<User>>>;
  bans?: Maybe<Scalars["Json"]["output"]>;
  counts?: Maybe<Scalars["Json"]["output"]>;
  email?: Maybe<Scalars["String"]["output"]>;
  ip?: Maybe<Scalars["Json"]["output"]>;
  privacy?: Maybe<Scalars["Int"]["output"]>;
}

/** A user's general options */
export interface UserOptions {
  __typename?: "UserOptions";
  /** Minutes between activity for them to be merged together. 0 is Never, Above 2 weeks (20160 mins) is Always. */
  activityMergeTime?: Maybe<Scalars["Int"]["output"]>;
  /** Whether the user receives notifications when a show they are watching aires */
  airingNotifications?: Maybe<Scalars["Boolean"]["output"]>;
  /** The list activity types the user has disabled from being created from list updates */
  disabledListActivity?: Maybe<Array<Maybe<ListActivityOption>>>;
  /** Whether the user has enabled viewing of 18+ content */
  displayAdultContent?: Maybe<Scalars["Boolean"]["output"]>;
  /** Notification options */
  notificationOptions?: Maybe<Array<Maybe<NotificationOption>>>;
  /** Profile highlight color (blue, purple, pink, orange, red, green, gray) */
  profileColor?: Maybe<Scalars["String"]["output"]>;
  /** Whether the user only allow messages from users they follow */
  restrictMessagesToFollowing?: Maybe<Scalars["Boolean"]["output"]>;
  /** The language the user wants to see staff and character names in */
  staffNameLanguage?: Maybe<UserStaffNameLanguage>;
  /** The user's timezone offset (Auth user only) */
  timezone?: Maybe<Scalars["String"]["output"]>;
  /** The language the user wants to see media titles in */
  titleLanguage?: Maybe<UserTitleLanguage>;
}

/** A user's previous name */
export interface UserPreviousName {
  __typename?: "UserPreviousName";
  /** When the user first changed from this name. */
  createdAt?: Maybe<Scalars["Int"]["output"]>;
  /** A previous name of the user. */
  name?: Maybe<Scalars["String"]["output"]>;
  /** When the user most recently changed from this name. */
  updatedAt?: Maybe<Scalars["Int"]["output"]>;
}

export interface UserReleaseYearStatistic {
  __typename?: "UserReleaseYearStatistic";
  chaptersRead: Scalars["Int"]["output"];
  count: Scalars["Int"]["output"];
  meanScore: Scalars["Float"]["output"];
  mediaIds: Array<Maybe<Scalars["Int"]["output"]>>;
  minutesWatched: Scalars["Int"]["output"];
  releaseYear?: Maybe<Scalars["Int"]["output"]>;
}

export interface UserScoreStatistic {
  __typename?: "UserScoreStatistic";
  chaptersRead: Scalars["Int"]["output"];
  count: Scalars["Int"]["output"];
  meanScore: Scalars["Float"]["output"];
  mediaIds: Array<Maybe<Scalars["Int"]["output"]>>;
  minutesWatched: Scalars["Int"]["output"];
  score?: Maybe<Scalars["Int"]["output"]>;
}

/** User sort enums */
export enum UserSort {
  ChaptersRead = "CHAPTERS_READ",
  ChaptersReadDesc = "CHAPTERS_READ_DESC",
  Id = "ID",
  IdDesc = "ID_DESC",
  SearchMatch = "SEARCH_MATCH",
  Username = "USERNAME",
  UsernameDesc = "USERNAME_DESC",
  WatchedTime = "WATCHED_TIME",
  WatchedTimeDesc = "WATCHED_TIME_DESC",
}

/** The language the user wants to see staff and character names in */
export enum UserStaffNameLanguage {
  /** The staff or character's name in their native language */
  Native = "NATIVE",
  /** The romanization of the staff or character's native name */
  Romaji = "ROMAJI",
  /** The romanization of the staff or character's native name, with western name ordering */
  RomajiWestern = "ROMAJI_WESTERN",
}

export interface UserStaffStatistic {
  __typename?: "UserStaffStatistic";
  chaptersRead: Scalars["Int"]["output"];
  count: Scalars["Int"]["output"];
  meanScore: Scalars["Float"]["output"];
  mediaIds: Array<Maybe<Scalars["Int"]["output"]>>;
  minutesWatched: Scalars["Int"]["output"];
  staff?: Maybe<Staff>;
}

export interface UserStartYearStatistic {
  __typename?: "UserStartYearStatistic";
  chaptersRead: Scalars["Int"]["output"];
  count: Scalars["Int"]["output"];
  meanScore: Scalars["Float"]["output"];
  mediaIds: Array<Maybe<Scalars["Int"]["output"]>>;
  minutesWatched: Scalars["Int"]["output"];
  startYear?: Maybe<Scalars["Int"]["output"]>;
}

export interface UserStatisticTypes {
  __typename?: "UserStatisticTypes";
  anime?: Maybe<UserStatistics>;
  manga?: Maybe<UserStatistics>;
}

export interface UserStatistics {
  __typename?: "UserStatistics";
  chaptersRead: Scalars["Int"]["output"];
  count: Scalars["Int"]["output"];
  countries?: Maybe<Array<Maybe<UserCountryStatistic>>>;
  episodesWatched: Scalars["Int"]["output"];
  formats?: Maybe<Array<Maybe<UserFormatStatistic>>>;
  genres?: Maybe<Array<Maybe<UserGenreStatistic>>>;
  lengths?: Maybe<Array<Maybe<UserLengthStatistic>>>;
  meanScore: Scalars["Float"]["output"];
  minutesWatched: Scalars["Int"]["output"];
  releaseYears?: Maybe<Array<Maybe<UserReleaseYearStatistic>>>;
  scores?: Maybe<Array<Maybe<UserScoreStatistic>>>;
  staff?: Maybe<Array<Maybe<UserStaffStatistic>>>;
  standardDeviation: Scalars["Float"]["output"];
  startYears?: Maybe<Array<Maybe<UserStartYearStatistic>>>;
  statuses?: Maybe<Array<Maybe<UserStatusStatistic>>>;
  studios?: Maybe<Array<Maybe<UserStudioStatistic>>>;
  tags?: Maybe<Array<Maybe<UserTagStatistic>>>;
  voiceActors?: Maybe<Array<Maybe<UserVoiceActorStatistic>>>;
  volumesRead: Scalars["Int"]["output"];
}

export interface UserStatisticsCountriesArgs {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<Array<InputMaybe<UserStatisticsSort>>>;
}

export interface UserStatisticsFormatsArgs {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<Array<InputMaybe<UserStatisticsSort>>>;
}

export interface UserStatisticsGenresArgs {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<Array<InputMaybe<UserStatisticsSort>>>;
}

export interface UserStatisticsLengthsArgs {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<Array<InputMaybe<UserStatisticsSort>>>;
}

export interface UserStatisticsReleaseYearsArgs {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<Array<InputMaybe<UserStatisticsSort>>>;
}

export interface UserStatisticsScoresArgs {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<Array<InputMaybe<UserStatisticsSort>>>;
}

export interface UserStatisticsStaffArgs {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<Array<InputMaybe<UserStatisticsSort>>>;
}

export interface UserStatisticsStartYearsArgs {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<Array<InputMaybe<UserStatisticsSort>>>;
}

export interface UserStatisticsStatusesArgs {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<Array<InputMaybe<UserStatisticsSort>>>;
}

export interface UserStatisticsStudiosArgs {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<Array<InputMaybe<UserStatisticsSort>>>;
}

export interface UserStatisticsTagsArgs {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<Array<InputMaybe<UserStatisticsSort>>>;
}

export interface UserStatisticsVoiceActorsArgs {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<Array<InputMaybe<UserStatisticsSort>>>;
}

/** User statistics sort enum */
export enum UserStatisticsSort {
  Count = "COUNT",
  CountDesc = "COUNT_DESC",
  Id = "ID",
  IdDesc = "ID_DESC",
  MeanScore = "MEAN_SCORE",
  MeanScoreDesc = "MEAN_SCORE_DESC",
  Progress = "PROGRESS",
  ProgressDesc = "PROGRESS_DESC",
}

/** A user's statistics */
export interface UserStats {
  __typename?: "UserStats";
  activityHistory?: Maybe<Array<Maybe<UserActivityHistory>>>;
  animeListScores?: Maybe<ListScoreStats>;
  animeScoreDistribution?: Maybe<Array<Maybe<ScoreDistribution>>>;
  animeStatusDistribution?: Maybe<Array<Maybe<StatusDistribution>>>;
  /** The amount of manga chapters the user has read */
  chaptersRead?: Maybe<Scalars["Int"]["output"]>;
  favouredActors?: Maybe<Array<Maybe<StaffStats>>>;
  favouredFormats?: Maybe<Array<Maybe<FormatStats>>>;
  favouredGenres?: Maybe<Array<Maybe<GenreStats>>>;
  favouredGenresOverview?: Maybe<Array<Maybe<GenreStats>>>;
  favouredStaff?: Maybe<Array<Maybe<StaffStats>>>;
  favouredStudios?: Maybe<Array<Maybe<StudioStats>>>;
  favouredTags?: Maybe<Array<Maybe<TagStats>>>;
  favouredYears?: Maybe<Array<Maybe<YearStats>>>;
  mangaListScores?: Maybe<ListScoreStats>;
  mangaScoreDistribution?: Maybe<Array<Maybe<ScoreDistribution>>>;
  mangaStatusDistribution?: Maybe<Array<Maybe<StatusDistribution>>>;
  /** The amount of anime the user has watched in minutes */
  watchedTime?: Maybe<Scalars["Int"]["output"]>;
}

export interface UserStatusStatistic {
  __typename?: "UserStatusStatistic";
  chaptersRead: Scalars["Int"]["output"];
  count: Scalars["Int"]["output"];
  meanScore: Scalars["Float"]["output"];
  mediaIds: Array<Maybe<Scalars["Int"]["output"]>>;
  minutesWatched: Scalars["Int"]["output"];
  status?: Maybe<MediaListStatus>;
}

export interface UserStudioStatistic {
  __typename?: "UserStudioStatistic";
  chaptersRead: Scalars["Int"]["output"];
  count: Scalars["Int"]["output"];
  meanScore: Scalars["Float"]["output"];
  mediaIds: Array<Maybe<Scalars["Int"]["output"]>>;
  minutesWatched: Scalars["Int"]["output"];
  studio?: Maybe<Studio>;
}

export interface UserTagStatistic {
  __typename?: "UserTagStatistic";
  chaptersRead: Scalars["Int"]["output"];
  count: Scalars["Int"]["output"];
  meanScore: Scalars["Float"]["output"];
  mediaIds: Array<Maybe<Scalars["Int"]["output"]>>;
  minutesWatched: Scalars["Int"]["output"];
  tag?: Maybe<MediaTag>;
}

/** The language the user wants to see media titles in */
export enum UserTitleLanguage {
  /** The official english title */
  English = "ENGLISH",
  /** The official english title, stylised by media creator */
  EnglishStylised = "ENGLISH_STYLISED",
  /** Official title in it's native language */
  Native = "NATIVE",
  /** Official title in it's native language, stylised by media creator */
  NativeStylised = "NATIVE_STYLISED",
  /** The romanization of the native language title */
  Romaji = "ROMAJI",
  /** The romanization of the native language title, stylised by media creator */
  RomajiStylised = "ROMAJI_STYLISED",
}

export interface UserVoiceActorStatistic {
  __typename?: "UserVoiceActorStatistic";
  chaptersRead: Scalars["Int"]["output"];
  characterIds: Array<Maybe<Scalars["Int"]["output"]>>;
  count: Scalars["Int"]["output"];
  meanScore: Scalars["Float"]["output"];
  mediaIds: Array<Maybe<Scalars["Int"]["output"]>>;
  minutesWatched: Scalars["Int"]["output"];
  voiceActor?: Maybe<Staff>;
}

/** User's year statistics */
export interface YearStats {
  __typename?: "YearStats";
  amount?: Maybe<Scalars["Int"]["output"]>;
  meanScore?: Maybe<Scalars["Int"]["output"]>;
  year?: Maybe<Scalars["Int"]["output"]>;
}

export type ActivityQueryVariables = Exact<{
  userid?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export interface ActivityQuery {
  __typename?: "Query";
  Activity?:
    | {
        __typename: "ListActivity";
        likeCount: number;
        replyCount: number;
        status?: string | null;
        progress?: string | null;
        createdAt: number;
        siteUrl?: string | null;
        user?: { __typename?: "User"; name: string; avatar?: { __typename?: "UserAvatar"; large?: string | null } | null } | null;
        media?: {
          __typename?: "Media";
          siteUrl?: string | null;
          bannerImage?: string | null;
          title?: { __typename?: "MediaTitle"; romaji?: string | null; native?: string | null; english?: string | null } | null;
          coverImage?: { __typename?: "MediaCoverImage"; extraLarge?: string | null; large?: string | null; medium?: string | null } | null;
        } | null;
        likes?: Array<{ __typename?: "User"; name: string } | null> | null;
      }
    | { __typename: "MessageActivity"; createdAt: number }
    | {
        __typename: "TextActivity";
        text?: string | null;
        siteUrl?: string | null;
        createdAt: number;
        likeCount: number;
        replyCount: number;
        user?: { __typename?: "User"; name: string; avatar?: { __typename?: "UserAvatar"; large?: string | null } | null } | null;
        likes?: Array<{ __typename?: "User"; name: string } | null> | null;
      }
    | null;
}

export type AiringQueryVariables = Exact<{
  dateStart?: InputMaybe<Scalars["Int"]["input"]>;
  nextDay: Scalars["Int"]["input"];
  getID?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>> | InputMaybe<Scalars["Int"]["input"]>>;
}>;

export interface AiringQuery {
  __typename?: "Query";
  Page?: {
    __typename?: "Page";
    airingSchedules?: Array<{
      __typename?: "AiringSchedule";
      id: number;
      episode: number;
      airingAt: number;
      timeUntilAiring: number;
      media?: {
        __typename?: "Media";
        siteUrl?: string | null;
        format?: MediaFormat | null;
        duration?: number | null;
        episodes?: number | null;
        title?: { __typename?: "MediaTitle"; english?: string | null; romaji?: string | null; native?: string | null } | null;
      } | null;
    } | null> | null;
  } | null;
}

export type AnimeQueryVariables = Exact<{
  query?: InputMaybe<Scalars["String"]["input"]>;
  aID?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export interface AnimeQuery {
  __typename?: "Query";
  Media?: {
    __typename?: "Media";
    id: number;
    description?: string | null;
    format?: MediaFormat | null;
    siteUrl?: string | null;
    source?: MediaSource | null;
    genres?: Array<string | null> | null;
    duration?: number | null;
    synonyms?: Array<string | null> | null;
    episodes?: number | null;
    meanScore?: number | null;
    bannerImage?: string | null;
    nextAiringEpisode?: { __typename?: "AiringSchedule"; timeUntilAiring: number; airingAt: number; episode: number } | null;
    coverImage?: { __typename?: "MediaCoverImage"; large?: string | null; medium?: string | null } | null;
    title?: { __typename?: "MediaTitle"; romaji?: string | null; english?: string | null; native?: string | null } | null;
    startDate?: { __typename?: "FuzzyDate"; year?: number | null; month?: number | null; day?: number | null } | null;
    endDate?: { __typename?: "FuzzyDate"; year?: number | null; month?: number | null; day?: number | null } | null;
    mediaListEntry?: {
      __typename?: "MediaList";
      status?: MediaListStatus | null;
      progress?: number | null;
      score?: number | null;
      notes?: string | null;
      user?: { __typename?: "User"; name: string; mediaListOptions?: { __typename?: "MediaListOptions"; scoreFormat?: ScoreFormat | null } | null } | null;
    } | null;
  } | null;
}

export type CharacterQueryVariables = Exact<{
  charName?: InputMaybe<Scalars["String"]["input"]>;
}>;

export interface CharacterQuery {
  __typename?: "Query";
  Character?: {
    __typename?: "Character";
    age?: string | null;
    description?: string | null;
    siteUrl?: string | null;
    bloodType?: string | null;
    gender?: string | null;
    favourites?: number | null;
    name?: { __typename?: "CharacterName"; full?: string | null } | null;
    image?: { __typename?: "CharacterImage"; large?: string | null } | null;
    dateOfBirth?: { __typename?: "FuzzyDate"; year?: number | null; month?: number | null; day?: number | null } | null;
    media?: { __typename?: "MediaConnection"; nodes?: Array<{ __typename?: "Media"; siteUrl?: string | null; title?: { __typename?: "MediaTitle"; romaji?: string | null; native?: string | null; english?: string | null } | null } | null> | null } | null;
  } | null;
}

export type GetMediaCollectiobQueryVariables = Exact<{
  type?: InputMaybe<MediaType>;
  userName?: InputMaybe<Scalars["String"]["input"]>;
}>;

export interface GetMediaCollectiobQuery {
  __typename?: "Query";
  MediaListCollection?: {
    __typename?: "MediaListCollection";
    lists?: Array<{
      __typename?: "MediaListGroup";
      name?: string | null;
      entries?: Array<{ __typename?: "MediaList"; score?: number | null; media?: { __typename?: "Media"; id: number; genres?: Array<string | null> | null; title?: { __typename?: "MediaTitle"; english?: string | null } | null } | null } | null> | null;
    } | null> | null;
  } | null;
}

export type MangaQueryVariables = Exact<{
  query?: InputMaybe<Scalars["String"]["input"]>;
}>;

export interface MangaQuery {
  __typename?: "Query";
  Media?: {
    __typename?: "Media";
    id: number;
    description?: string | null;
    format?: MediaFormat | null;
    chapters?: number | null;
    source?: MediaSource | null;
    synonyms?: Array<string | null> | null;
    volumes?: number | null;
    genres?: Array<string | null> | null;
    siteUrl?: string | null;
    meanScore?: number | null;
    bannerImage?: string | null;
    coverImage?: { __typename?: "MediaCoverImage"; large?: string | null; medium?: string | null } | null;
    title?: { __typename?: "MediaTitle"; romaji?: string | null; english?: string | null; native?: string | null } | null;
    startDate?: { __typename?: "FuzzyDate"; year?: number | null; month?: number | null; day?: number | null } | null;
    endDate?: { __typename?: "FuzzyDate"; year?: number | null; month?: number | null; day?: number | null } | null;
    mediaListEntry?: {
      __typename?: "MediaList";
      status?: MediaListStatus | null;
      progress?: number | null;
      score?: number | null;
      notes?: string | null;
      user?: { __typename?: "User"; name: string; mediaListOptions?: { __typename?: "MediaListOptions"; scoreFormat?: ScoreFormat | null } | null } | null;
    } | null;
  } | null;
}

export type SaveMediaListEntryMutationVariables = Exact<{
  mediaid?: InputMaybe<Scalars["Int"]["input"]>;
  status?: InputMaybe<MediaListStatus>;
  score?: InputMaybe<Scalars["Float"]["input"]>;
  progress?: InputMaybe<Scalars["Int"]["input"]>;
  hide?: InputMaybe<Scalars["Boolean"]["input"]>;
  lists?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>> | InputMaybe<Scalars["String"]["input"]>>;
  private?: InputMaybe<Scalars["Boolean"]["input"]>;
}>;

export interface SaveMediaListEntryMutation {
  __typename?: "Mutation";
  SaveMediaListEntry?: {
    __typename?: "MediaList";
    mediaId: number;
    status?: MediaListStatus | null;
    media?: { __typename?: "Media"; bannerImage?: string | null; type?: MediaType | null; title?: { __typename?: "MediaTitle"; userPreferred?: string | null } | null } | null;
    user?: { __typename?: "User"; name: string } | null;
  } | null;
}

export type RecentChartQueryVariables = Exact<{
  user?: InputMaybe<Scalars["String"]["input"]>;
  perPage?: InputMaybe<Scalars["Int"]["input"]>;
  type?: InputMaybe<MediaType>;
  userId?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export interface RecentChartQuery {
  __typename?: "Query";
  Page?: {
    __typename?: "Page";
    mediaList?: Array<{
      __typename?: "MediaList";
      status?: MediaListStatus | null;
      progress?: number | null;
      media?: { __typename?: "Media"; title?: { __typename?: "MediaTitle"; english?: string | null; romaji?: string | null } | null; coverImage?: { __typename?: "MediaCoverImage"; extraLarge?: string | null } | null } | null;
    } | null> | null;
  } | null;
}

export type RecommendationsQueryVariables = Exact<{
  type?: InputMaybe<MediaType>;
  exclude_ids?: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>> | InputMaybe<Scalars["Int"]["input"]>>;
  genres?: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>> | InputMaybe<Scalars["String"]["input"]>>;
}>;

export interface RecommendationsQuery {
  __typename?: "Query";
  Page?: { __typename?: "Page"; media?: Array<{ __typename?: "Media"; genres?: Array<string | null> | null; title?: { __typename?: "MediaTitle"; english?: string | null } | null } | null> | null } | null;
}

export type StaffQueryVariables = Exact<{
  staffName?: InputMaybe<Scalars["String"]["input"]>;
}>;

export interface StaffQuery {
  __typename?: "Query";
  Staff?: {
    __typename?: "Staff";
    age?: number | null;
    description?: string | null;
    gender?: string | null;
    homeTown?: string | null;
    siteUrl?: string | null;
    name?: { __typename?: "StaffName"; full?: string | null } | null;
    image?: { __typename?: "StaffImage"; large?: string | null } | null;
    staffMedia?: {
      __typename?: "MediaConnection";
      edges?: Array<{
        __typename?: "MediaEdge";
        staffRole?: string | null;
        node?: { __typename?: "Media"; siteUrl?: string | null; title?: { __typename?: "MediaTitle"; romaji?: string | null; english?: string | null; native?: string | null; userPreferred?: string | null } | null } | null;
      } | null> | null;
    } | null;
    characterMedia?: {
      __typename?: "MediaConnection";
      edges?: Array<{
        __typename?: "MediaEdge";
        node?: { __typename?: "Media"; siteUrl?: string | null; title?: { __typename?: "MediaTitle"; romaji?: string | null; english?: string | null; native?: string | null; userPreferred?: string | null } | null } | null;
        characters?: Array<{ __typename?: "Character"; name?: { __typename?: "CharacterName"; full?: string | null } | null } | null> | null;
      } | null> | null;
    } | null;
  } | null;
}

export type StudioQueryVariables = Exact<{
  query?: InputMaybe<Scalars["String"]["input"]>;
}>;

export interface StudioQuery {
  __typename?: "Query";
  Studio?: {
    __typename?: "Studio";
    isAnimationStudio: boolean;
    siteUrl?: string | null;
    name: string;
    favourites?: number | null;
    media?: { __typename?: "MediaConnection"; nodes?: Array<{ __typename?: "Media"; id: number; title?: { __typename?: "MediaTitle"; romaji?: string | null; english?: string | null } | null } | null> | null } | null;
  } | null;
}

export type SaveTextActivityMutationVariables = Exact<{
  text?: InputMaybe<Scalars["String"]["input"]>;
}>;

export interface SaveTextActivityMutation {
  __typename?: "Mutation";
  SaveTextActivity?: { __typename?: "TextActivity"; siteUrl?: string | null; text?: string | null; user?: { __typename?: "User"; name: string } | null } | null;
}

export type UserQueryVariables = Exact<{
  username?: InputMaybe<Scalars["String"]["input"]>;
  userid?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export interface UserQuery {
  __typename?: "Query";
  User?: {
    __typename?: "User";
    id: number;
    name: string;
    bannerImage?: string | null;
    siteUrl?: string | null;
    createdAt?: number | null;
    avatar?: { __typename?: "UserAvatar"; large?: string | null; medium?: string | null } | null;
    options?: { __typename?: "UserOptions"; profileColor?: string | null } | null;
    statistics?: { __typename?: "UserStatisticTypes"; anime?: { __typename?: "UserStatistics"; count: number; meanScore: number } | null; manga?: { __typename?: "UserStatistics"; count: number; meanScore: number } | null } | null;
  } | null;
}

export type UserCardQueryVariables = Exact<{
  username?: InputMaybe<Scalars["String"]["input"]>;
}>;

export interface UserCardQuery {
  __typename?: "Query";
  User?: {
    __typename?: "User";
    id: number;
    name: string;
    bannerImage?: string | null;
    siteUrl?: string | null;
    createdAt?: number | null;
    avatar?: { __typename?: "UserAvatar"; large?: string | null; medium?: string | null } | null;
    statistics?: { __typename?: "UserStatisticTypes"; anime?: { __typename?: "UserStatistics"; count: number; meanScore: number } | null; manga?: { __typename?: "UserStatistics"; count: number; meanScore: number } | null } | null;
  } | null;
}
