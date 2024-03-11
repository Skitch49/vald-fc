export interface Clip {
  _id: string;
  name: string;
  date: string;
  description: string;
  url: string;
  artiste: string;
  featuring: string[];
  likers:string[];
  isLiked: boolean
  }