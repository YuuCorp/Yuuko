export default {
  "GetMediaCollection": "query GetMediaCollection($type: MediaType, $userName: String, $userId: Int, $sort: [MediaListSort]) {\n  MediaListCollection(type: $type, userName: $userName, userId: $userId, sort: $sort) {\n    lists {\n      entries {\n        media {\n          id\n          title {\n            english\n            romaji\n            native\n          }\n          genres\n          nextAiringEpisode {\n            airingAt\n            timeUntilAiring\n            episode\n          }\n          description\n          coverImage {\n            large\n            medium\n          }\n          format\n          siteUrl\n          source\n          duration\n          synonyms\n          episodes\n          chapters\n          meanScore\n          volumes\n          isAdult\n          startDate {\n            day\n            month\n            year\n          }\n          endDate {\n            day\n            month\n            year\n          }\n          bannerImage\n          tags {\n            rank\n            name\n          }\n        }\n        score(format: POINT_10_DECIMAL)\n        status\n        notes\n        progress\n        updatedAt\n      }\n      name\n    }\n    user {\n      name\n      mediaListOptions {\n        scoreFormat\n      }\n      id\n    }\n  }\n}",
  "Airing": "query Airing($dateStart: Int, $nextDay: Int!, $getID: [Int]) {\n  Page {\n    airingSchedules(sort: TIME, airingAt_greater: $dateStart, airingAt_lesser: $nextDay, mediaId_in: $getID) {\n      media {\n        siteUrl\n        format\n        duration\n        episodes\n        title {\n          english\n          romaji\n          native\n        }\n      }\n      id\n      episode\n      airingAt\n      timeUntilAiring\n    }\n  }\n}\n",
  "Viewer": "query Viewer {\n  Viewer {\n    name\n    id\n  }\n}\n",
  "Character": "query Character($charName: String) {\n  Character(search: $charName) {\n    name {\n      full\n    }\n    age\n    description\n    siteUrl\n    image {\n      large\n    }\n    bloodType\n    dateOfBirth {\n      year\n      month\n      day\n    }\n    gender\n    favourites\n    media {\n      nodes {\n        siteUrl\n        title {\n          romaji\n          native\n          english\n        }\n      }\n    }\n  }\n}\n",
  "GetUserList": "query GetUserList($type: MediaType, $userId: Int) {\n    MediaListCollection(type: $type, userId: $userId) {\n        lists {\n            entries {\n                media {\n                    id\n                }\n                status\n                progress\n                score(format: POINT_10_DECIMAL)\n                notes\n            }\n        }\n        user {\n            name\n            mediaListOptions {\n                scoreFormat\n            }\n            id\n        }\n    }\n}\n",
  "UserCard": "query UserCard($username: String) {\n  User(name: $username) {\n    id\n    name\n    avatar {\n      large\n      medium\n    }\n    bannerImage\n    siteUrl\n    createdAt\n    statistics {\n      anime {\n        count\n        meanScore\n      }\n      manga {\n        count\n        meanScore\n      }\n    }\n  }\n}\n",
  "SaveMediaList": "mutation SaveMediaListEntry($mediaid: Int, $status: MediaListStatus, $score: Float, $progress: Int, $hide: Boolean, $lists: [String], $private: Boolean) {\n  SaveMediaListEntry(mediaId: $mediaid, status: $status, score: $score, progress: $progress, hiddenFromStatusLists: $hide, customLists: $lists, private: $private) {\n    mediaId\n    media {\n      bannerImage\n      type\n      title {\n        userPreferred\n      }\n    }\n    user {\n      name\n    }\n    status\n  }\n}\n",
  "SaveTextActivity": "mutation SaveTextActivity($text: String) {\n  SaveTextActivity(text: $text) {\n    siteUrl\n    user {\n      name\n    }\n    text\n  }\n}\n",
  "RecentChart": "query RecentChart($user: String, $perPage: Int, $type: MediaType, $userId: Int) {\n  Page(perPage: $perPage) {\n    mediaList(userName: $user, sort: UPDATED_TIME_DESC, type: $type, userId: $userId) {\n      media {\n        title {\n          english\n          romaji\n        }\n        coverImage {\n          extraLarge\n        }\n      }\n      status\n      progress\n    }\n  }\n}\n",
  "Recommendations": "query Recommendations($type: MediaType, $exclude_ids: [Int], $genres: [String]) {\n  Page(perPage: 50) {\n    media(genre_in: $genres, id_not_in: $exclude_ids, type: $type, sort: SCORE_DESC, averageScore_greater: 6) {\n      title {\n        romaji\n        english\n        native\n      }\n      genres\n    }\n  }\n}\n",
  "Anime": "query Anime($query: String, $aID: Int) {\n  Media(search: $query, id: $aID, type: ANIME, sort: SEARCH_MATCH) {\n    id\n    nextAiringEpisode {\n      timeUntilAiring\n      airingAt\n      episode\n    }\n    description\n    coverImage {\n      large\n      medium\n    }\n    title {\n      romaji\n      english\n      native\n    }\n    format\n    siteUrl\n    source\n    genres\n    id\n    duration\n    synonyms\n    episodes\n    meanScore\n    startDate {\n      year\n      month\n      day\n    }\n    endDate {\n      year\n      month\n      day\n    }\n    bannerImage\n    mediaListEntry {\n      status\n      progress\n      score(format: POINT_10_DECIMAL)\n      notes\n      user {\n        name\n        id\n        mediaListOptions {\n          scoreFormat\n        }\n      }\n    }\n  }\n}\n",
  "Activity": "query Activity($userid: Int) {\n  Activity(userId: $userid, sort: ID_DESC, type_not: MESSAGE) {\n    __typename\n    ... on TextActivity {\n      text\n      siteUrl\n      createdAt\n      user {\n        name\n        avatar {\n          large\n        }\n      }\n      likeCount\n      replyCount\n      replies {\n        text\n        user {\n          name\n        }\n      }\n    }\n    ... on ListActivity {\n      user {\n        name\n        avatar {\n          large\n        }\n      }\n      likeCount\n      replies {\n        text\n        user {\n          name\n        }\n      }\n      replyCount\n      status\n      progress\n      media {\n        siteUrl\n        bannerImage\n        title {\n          romaji\n          native\n          english\n        }\n        coverImage {\n          extraLarge\n          large\n          medium\n        }\n      }\n      createdAt\n      siteUrl\n    }\n    ... on MessageActivity {\n      createdAt\n    }\n  }\n}",
  "ListQuery": "query ListQuery($userId: Int) {\n    User(id: $userId) {\n      mediaListOptions {\n        animeList {\n          customLists\n        }\n        mangaList {\n          customLists\n        }\n      }\n    }\n}",
  "Studio": "query Studio($query: String) {\n  Studio(search: $query) {\n    isAnimationStudio\n    siteUrl\n    name\n    favourites\n    media {\n      nodes {\n        id\n        title {\n          romaji\n          english\n        }\n      }\n    }\n  }\n}\n",
  "User": "query User($username: String, $userid: Int) {\n  User(name: $username, id: $userid) {\n    id\n    name\n    avatar {\n      large\n      medium\n    }\n    bannerImage\n    siteUrl\n    createdAt\n    options {\n      profileColor\n    }\n    statistics {\n      anime {\n        count\n        meanScore\n      }\n      manga {\n        count\n        meanScore\n      }\n    }\n  }\n}\n",
  "Staff": "query Staff($staffName: String) {\n  Staff(search: $staffName) {\n    name {\n      full\n    }\n    age\n    image {\n      large\n    }\n    description\n    gender\n    homeTown\n    siteUrl\n    staffMedia {\n      edges {\n        staffRole\n        node {\n          title {\n            romaji\n            english\n            native\n            userPreferred\n          }\n          siteUrl\n        }\n      }\n    }\n    characterMedia {\n      edges {\n        node {\n          title {\n            romaji\n            english\n            native\n            userPreferred\n          }\n          siteUrl\n        }\n        characters {\n          name {\n            full\n          }\n        }\n      }\n    }\n  }\n}\n",
  "Manga": "query Manga($query: String) {\n  Media(search: $query, type: MANGA, sort: SEARCH_MATCH) {\n    id\n    description\n    coverImage {\n      large\n      medium\n    }\n    title {\n      romaji\n      english\n      native\n    }\n    format\n    chapters\n    source\n    synonyms\n    volumes\n    genres\n    id\n    siteUrl\n    meanScore\n    startDate {\n      year\n      month\n      day\n    }\n    endDate {\n      year\n      month\n      day\n    }\n    bannerImage\n    mediaListEntry {\n      status\n      progress\n      score(format: POINT_10_DECIMAL)\n      notes\n      user {\n        name\n        mediaListOptions {\n          scoreFormat\n        }\n      }\n    }\n  }\n}\n"
} as const