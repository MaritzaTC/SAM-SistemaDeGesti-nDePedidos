import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const statuses = [
  { label: "Todos", value: "ALL" },
  { label: "Pendiente", value: "PENDING" },
  { label: "Completado", value: "COMPLETED" },
  { label: "Cancelado", value: "CANCELED" },
];

type Props = {
  status: string;
  setStatus: (status: string) => void;
  search: string;
  setSearch: (search: string) => void;
};

const OrderFilters: React.FC<Props> = ({
  status,
  setStatus,
  search,
  setSearch,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center mb-2">
      <div className="flex gap-2">
        {statuses.map((s) => (
          <Button
            key={s.value}
            variant={status === s.value ? "default" : "outline"}
            onClick={() => setStatus(s.value)}
          >
            {s.label}
          </Button>
        ))}
      </div>
      <Input
        className="max-w-xs"
        placeholder="Buscar por ID, usuario o email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
};

export default OrderFilters;
