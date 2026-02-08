
export const MODAL_ROUTES = [
  {
    match: /^\/profile\/[^/]+\/photo$/,
    getBackground: (pathname: any) =>
      pathname.replace(/\/photo$/, ""),
  },
  {
    match: /^\/profile\/[^/]+\/header_photo$/,
    getBackground: (pathname: any) =>
      pathname.replace(/\/header_photo$/, ""),
  },
]