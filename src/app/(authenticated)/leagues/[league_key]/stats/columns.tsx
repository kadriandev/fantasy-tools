import { YahooSettingsStatCategory } from "@/lib/yahoo/league/schemas";
import { FantasyStats } from "@/lib/yahoo/schemas";
import { ColumnDef } from "@tanstack/react-table";

export const createStatTableColumns = (
  categories: YahooSettingsStatCategory[],
) => {
  const columns: ColumnDef<FantasyStats>[] = [
    {
      header: "Team ID",
      accessorKey: "team_id",
      enableSorting: false,
      enableHiding: true,
    },
    { header: "Team", accessorKey: "team_name", enableSorting: false },
  ];

  columns.push(
    ...categories.map(
      (cat): ColumnDef<FantasyStats> => ({
        header: cat.abbr,
        accessorKey: cat.stat_id + "",
        sortingFn: "alphanumeric",
        enableSorting: true,
        sortDescFirst: cat.sort_order === "1",
      }),
    ),
  );

  return columns;
};
