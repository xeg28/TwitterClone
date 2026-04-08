import { getCurrent, getHistory} from "./utils/NavigationHistory";


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
  {
    match:/^\/compose\/post$/,
    getBackground: (pathname:any) => {
      return pathname.replace(/\/compose\/post$/, getCurrent() ?? '/')
    }
  },
 
]