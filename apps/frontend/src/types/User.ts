export interface UserDataProps {
  avatarUrl: string;
  name: string;
  parent?: UserDataProps;
}
