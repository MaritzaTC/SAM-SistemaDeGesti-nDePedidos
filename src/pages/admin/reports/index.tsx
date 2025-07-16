// pages/admin/dashboard.tsx

import { DashboardLayout } from "@/components/admin/DashboardLayout";
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, AwaitedReactNode } from "react";


const index = () => {
  return <div>Empleado</div>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
index.getLayout = (page: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined) => <DashboardLayout>{page}</DashboardLayout>;

export default index;
