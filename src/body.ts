import { User } from './addition';

export default interface Body {
  action: string;
  membership: {
    user: User;
  };
}
