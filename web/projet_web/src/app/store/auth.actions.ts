export class InitAuth {
  static readonly type = '[Auth] Init From Cookies';
}

export class SetToken {
  static readonly type = '[Auth] Set Token';
  constructor(public token: string) {}
}

export class ClearToken {
  static readonly type = '[Auth] Clear Token';
}

export class SetUser {
  static readonly type = '[Auth] Set User';
  constructor(public user: any) {}
}

export class ClearUser {
  static readonly type = '[Auth] Clear User';
}
