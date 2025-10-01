export class AuthResponseDto {
  access_token: string;
  user: {
    id: string;
    email: string;
    role: string;
  };

  constructor(
    access_token: string,
    user: { id: string; email: string; role: string },
  ) {
    this.access_token = access_token;
    this.user = user;
  }
}
