{ pkgs }: {
  deps = [
    pkgs.nodejs
    pkgs.nodePackages.typescript
    pkgs.nodePackages.jest
  ];
}
