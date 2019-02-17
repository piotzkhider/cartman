<p align="center">
  <a href="https://github.com/piotzkhider/cartman">
    <img alt="cartman" src="https://camo.githubusercontent.com/97d609a82c43bdb514934348dbaa6a1f3400cdb8/68747470733a2f2f342e62702e626c6f6773706f742e636f6d2f2d473266556756455f6244492f55374f38526f43343535492f41414141414141416964492f3479505645472d386f33512f733830302f746169686f2e706e67" width="365px">
  </a>
</p>

<h2 align="center">
  cartman - A cartman who carts newcomer off to jails.
</h2>

## Usage

serverless.yml

```yml
provider:
  ...
  environment:
    GITHUB_ACCESS_TOKEN: your_access_token123
    GITHUB_WEBHOOK_SECRET: your_webhook_secret456
```

handler.ts

```ts
const organization: string = 'YourOrganization';
const defaultTeams: string[] = ['jail1', 'jail2'];
```
