import { useScreenDimensions } from "@/hooks/useDimensions";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import HomeRepository, {
  ITableDataResponse,
} from "@/repositories/home.repository";
import { IPhoto } from "@/types/home";

const defaultValues = {
  startDate: undefined,
  endDate: undefined,
  startTime: undefined,
  endTime: undefined,
};

const TABLE_COLUMNS = [
  { id: "id", label: "ID" },
  { id: "date", label: "Data", type: "datetime" },
  { id: "googledrivelink", label: "Link Google Drive", type: "link" },
  { id: "googledrivedownloadlink", label: "Link Download", type: "download" },
];

type IFilters = {
  startDate?: Date | string;
  endDate?: Date | string;
  page: number;
  limit: number;
};

export const useHome = () => {
  const { width } = useScreenDimensions();
  const isMobile = width < 1024;
  const [tableData, setTableData] = useState<IPhoto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [previousMinId, setPreviousMinId] = useState<number>(1);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [filters, setFilters] = useState<IFilters>({
    startDate: undefined,
    endDate: undefined,
    page: 0,
    limit: 10,
  });

  const schema = z
    .object({
      startDate: z
        .date()
        .optional()
        .refine((date) => !date || date <= new Date(), {
          message: "A data de início não pode ser no futuro.",
        }),
      endDate: z.date().optional(),
      startTime: z.string().optional(),
      endTime: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      const { startDate, endDate } = data;
      if (startDate && endDate && startDate.getTime() > endDate.getTime()) {
        ctx.addIssue({
          path: ["endDate"],
          message:
            "A data de fim deve ser posterior ou igual à data de início.",
          code: z.ZodIssueCode.custom,
        });
      }
    });

  const methods = useForm({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const {
    watch,
    formState: { errors },
    handleSubmit,
    setValue,
  } = methods;

  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const startTime = watch("startTime");
  const endTime = watch("endTime");

  const onFilter = handleSubmit(async (data) => {
    const { startDate, endDate } = data;
    const startTime = data.startTime || "00:00";
    const endTime = data.endTime || "23:59";

    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    const startDateTime = startDate
      ? new Date(startDate.setHours(startHour, startMinute))
      : undefined;

    const endDateTime = endDate
      ? new Date(endDate.setHours(endHour, endMinute))
      : undefined;

    if (startDateTime) {
      startDateTime.setHours(startDateTime.getHours() - 3);
    }
    if (endDateTime) {
      endDateTime.setHours(endDateTime.getHours() - 3);
    }

    setFilters({
      startDate: startDateTime?.toISOString(),
      endDate: endDateTime?.toISOString(),
      page: 0,
      limit: 10,
    });
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    const response: ITableDataResponse = await HomeRepository.getTableData(
      filters
    );

    setLoading(false);
    setTotal(response.total);
    setTableData(response.photos);
    setPreviousMinId(response.minId);
  }, [filters]);

  const onSelectSingleRow = (id: string | number) => {
    const isSelected = selectedIds.includes(Number(id));
    if (isSelected) {
      setSelectedIds(
        selectedIds.filter((selectedId) => selectedId !== Number(id))
      );
      return;
    }

    const selectedRow = tableData.find((row) => row.id === Number(id));
    if (!selectedRow) return;

    setSelectedIds([...new Set([...selectedIds, selectedRow.id])]);
  };

  const onSelectAllRows = () => {
    if (selectedIds.length === tableData.length) {
      setSelectedIds([]);
      return;
    }

    const newSelectedIds = tableData.map((row) => row.id);
    const allSelected = selectedIds.length === tableData.length;

    setSelectedIds(allSelected ? [] : newSelectedIds);
  };

  const maxPage = Math.ceil(total / filters.limit);

  const onPaginationChange = (step: "next" | "prev") => {
    const newPage =
      step === "next"
        ? Math.min(maxPage, filters.page + 1)
        : Math.max(0, filters.page - 1);

    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  useEffect(() => {
    fetchData();
    console.log("Fetching data with filters:", filters);
  }, [filters]);

  return {
    isMobile,
    startDate,
    endDate,
    startTime,
    endTime,
    errors,
    onFilter,
    setValue,
    methods,
    tableData,
    TABLE_COLUMNS,
    onSelectSingleRow,
    onSelectAllRows,
    selectedIds,
    previousMinId,
    setFilters,
    filters,
    onPaginationChange,
    maxPage,
    loading,
  };
};
