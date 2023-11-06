interface BasePost {
  postContent: string,
  title: string,
  metaDescription: string,
}
interface ICreatePostBody {
  topic: string,
  keywords: string,
}
type IPostContent = BasePost & ICreatePostBody

interface IFormattedPost extends IPostContent {
  _id: string;
  created: string;
}
