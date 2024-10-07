"use client";

import React from "react";
import { Flame, Sparkles, TrendingUp } from "lucide-react";

type FilterOption = "hot" | "new" | "top";

interface FilterBarProps {
  onFilterChange: (filter: FilterOption) => void;
  activeFilter: FilterOption;
}

export default function FilterBar({
  onFilterChange,
  activeFilter,
}: FilterBarProps) {
  return (
    <div className="flex justify-center mb-8">
      <div className="inline-flex bg-[#0F0D0E] dark:bg-[#231F20] rounded-full p-1 space-x-2">
        <FilterButton
          icon={<Flame size={18} />}
          label="Hot"
          active={activeFilter === "hot"}
          onClick={() => onFilterChange("hot")}
        />
        <FilterButton
          icon={<Sparkles size={18} />}
          label="New"
          active={activeFilter === "new"}
          onClick={() => onFilterChange("new")}
        />
        <FilterButton
          icon={<TrendingUp size={18} />}
          label="Top"
          active={activeFilter === "top"}
          onClick={() => onFilterChange("top")}
        />
      </div>
    </div>
  );
}

interface FilterButtonProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

function FilterButton({ icon, label, active, onClick }: FilterButtonProps) {
  return (
    <button
      className={`flex items-center px-4 py-2 rounded-full transition-colors duration-200 ${
        active
          ? "bg-[#FCBA28] text-[#0F0D0E] dark:text-[#231F20]"
          : "text-gray-300 hover:bg-[#231F20] dark:hover:bg-[#0F0D0E]"
      }`}
      onClick={onClick}
    >
      {icon}
      <span className="ml-2 text-sm font-medium">{label}</span>
    </button>
  );
}
