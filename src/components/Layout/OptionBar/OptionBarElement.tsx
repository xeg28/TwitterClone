import { useEffect, useState } from "react";

interface OptionBarElementProps {
  children:React.ReactNode;
  render: boolean;
  className: string;
}
const OptionBarElement:React.FC<OptionBarElementProps> = ({children, render, className}) => {
  const [hasRendered, setHasRendered] = useState<boolean>(false);

  useEffect(() =>{
    if(render) setHasRendered(true);
  }, [render, setHasRendered])
  return (
    <div className={className}>
      {hasRendered && children}
    </div>
  )
}

export default OptionBarElement;