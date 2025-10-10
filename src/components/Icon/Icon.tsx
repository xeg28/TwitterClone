import {Icons} from './Icons';

interface IconProps {
  name: keyof typeof Icons,
  className?:string
}

const Icon:React.FC<IconProps> = ({name, className}) => {
  const SvgIcon = Icons[name];
  return SvgIcon ? <SvgIcon className={className} /> : null;
}

export default Icon;