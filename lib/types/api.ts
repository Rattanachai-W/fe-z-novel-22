export type UUID = string;

export interface UserBase {
  id: UUID;
  username: string;
  email?: string;
  role: "reader" | "author" | "admin";
}

export interface Category {
  id: UUID;
  name: string;
}

export interface Tag {
  id: UUID;
  name: string;
}

export interface Chapter {
  id: UUID;
  novel_id: UUID;
  chapter_number: number;
  title: string;
  is_free: boolean;
  coin_price: number;
  content?: string | null;
  reader_note?: string | null;
  locked?: boolean;
  created_at: string;
  novel?: { id: UUID; title: string; author_id: UUID };
}

export interface Novel {
  id: UUID;
  author_id: UUID;
  category_id?: UUID;
  title: string;
  description: string;
  cover_image_url: string;
  status: "ongoing" | "completed" | "on_hold";
  view_count: number;
  rating: number;
  rating_count: number;
  author?: { id: UUID; username: string };
  Category?: Category;
  Tags?: Tag[];
  chapters?: Chapter[];
}

export interface NovelMetadata {
  categories: Category[];
  tags: Tag[];
}

export interface ChapterComment {
  id: UUID;
  content: string;
  parent_id: UUID | null;
  created_at: string;
  User: { id: UUID; username: string };
}

export interface ReadingHistoryItem {
  user_id: UUID;
  novel_id: UUID;
  updated_at: string;
  novel: {
    id: UUID;
    title: string;
    cover_image_url: string;
    author?: { username: string };
  };
  lastChapter?: {
    id: UUID;
    chapter_number: number;
    title: string;
  };
}

export interface AuthorProfile {
  id: UUID;
  username: string;
  created_at: string;
  follower_count: number;
  following_count: number;
  novels: Novel[];
}

export interface HomeMetric {
  label: string;
  value: string;
  description: string;
}

export interface AuthPayload {
  message: string;
  token: string;
  user: UserBase;
}

export interface Wallet {
  gold: number;
  egg: number;
  ticket: number;
}

export interface Banner {
  id: UUID;
  title?: string;
  subtitle?: string;
  description?: string;
  image_url?: string;
  mobile_image_url?: string;
  image_alt?: string;
  link_url?: string;
  is_active?: boolean;
  zone?: string;
  start_at?: string;
  end_at?: string;
  novel_id?: UUID;
  Novel?: Novel;
}
