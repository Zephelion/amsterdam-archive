import { ReactNode } from "react";
interface BaseLayoutProps {
  children: ReactNode;
}

export const BaseLayout = ({ children }: BaseLayoutProps) => {
  return <main>{children}</main>;
};
