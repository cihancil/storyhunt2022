export interface IUser {
  pk: string,
  // byline: string,
  // follower_count: number,
  has_anonymous_profile_picture: boolean,
  is_private: boolean,
  is_verified: boolean,
  // mutual_follower_count: number,
  profile_pic_id: string,
  profile_pic_url: string,
  unseen_count: number,
  username: string,
  full_name: string,
}

export interface IUserDetailed extends IUser {
  account_type: 1,
  biography: string,
  follower_count: number,
  following_count: number,
  geo_media_count: number,
  has_highlight_reels: boolean,
  hd_profile_pic_url_info: IImageCandidate,
  hd_profile_pic_versions: IImageCandidate[],
  media_count: number,
  mutual_followers_count: number,
  profile_context: string, // Followed by ...
  profile_context_mutual_follow_ids: string[],
}

export interface IStoryTray {
  id: number,
  items: IStoryPerUser[],
  muted: boolean,
  user: IUser,
  seen: number,
}

export interface IStoryPerUser {
  id: string,
  pk: number,
  has_audio: boolean,
  user: IUser,
  image_versions2: { candidates: IImageCandidate[] },
}

export interface IImageCandidate {
  width: number,
  height: number,
  url: string,
}

export interface IPost {
  caption: ICaption,
  comment_count: number,
  carousel_media_count: number,
  carousel_media: {
    image_versions2: {
      candidates: IImageCandidate[],
    }
    original_height: number,
    original_width: number,
  }[],
  facepile_top_likers: IUser[],
  has_liked: boolean,
  has_more_comments: boolean,
  id: string,
  image_versions2: { candidates: IImageCandidate[] },
  like_count: number,
  media_type: 1 | 2 | 8, // 1:photo 2:video 8:multiple
  photo_of_you: boolean,
  pk: number,
  preview_comments: any[],
  top_likers: string[],
  user: IUser,
  usertags: { in: IUser[] },
  end_of_feed_demarcator?: any,
  type?: 2, // 2: suggested for you
  ad_metadata?: any[], // ads
  ad_action?: string,
}

export interface ICaption {
  content_type: "comment",
  created_at: number,
  created_at_utc: number,
  media_id: number,
  pk: number,
  status: "Active",
  text: string,
  type: 1,
  user: IUser,
  user_id: number,
}