import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AppNavbar } from "./navbar";
import { DatePicker } from "@/components/ui/datepicker";
import { useHome } from "../home.hook";
import FormProvider from "@/components/form/formProvider";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { TimePicker } from "@/components/ui/timePicker";
import { Skeleton } from "@/components/ui/skeleton";

export default function MainTable() {
  const {
    isMobile,
    startDate,
    endDate,
    onFilter,
    methods,
    TABLE_COLUMNS,
    tableData,
    onSelectAllRows,
    onSelectSingleRow,
    selectedIds,
    onPaginationChange,
    filters,
    maxPage,
    startTime,
    endTime,
    loading,
  } = useHome();

  const hasDataToShow = !!tableData.length;

  return (
    <>
      <AppNavbar />
      <div className="w-full min-h-screen py-28 bg-background">
        <div className="max-w-6xl mx-auto px-4 flex flex-col lg:flex-row gap-4">
          <div className="w-full lg:flex-[2]">
            <p className="my-2">Filtros de busca</p>
            <div className="w-full rounded-md border border-muted mb-12 py-6 px-4">
              <FormProvider methods={methods} onSubmit={onFilter}>
                <div className="w-full flex flex-col gap-4">
                  <div className="w-full flex flex-row gap-4">
                    <DatePicker
                      error={methods.formState.errors.startDate?.message}
                      name="startDate"
                      date={startDate}
                      defaultPlaceHolder="Escolha uma data de início"
                      className={!isMobile ? "flex-1" : ""}
                    />
                    {!isMobile && (
                      <>
                        <TimePicker
                          name="startTime"
                          className="flex-1"
                          defaultPlaceHolder="Horário de início"
                          time={startTime}
                        />
                      </>
                    )}
                    {!isMobile && (
                      <>
                        {"<>"}
                        <DatePicker
                          error={methods.formState.errors.endDate?.message}
                          name="endDate"
                          date={endDate}
                          defaultPlaceHolder="Escolha uma data de fim"
                          className="flex-1"
                        />

                        <TimePicker
                          name="endTime"
                          className="flex-1"
                          defaultPlaceHolder="Horário de fim"
                          time={endTime}
                        />
                      </>
                    )}
                  </div>

                  {isMobile && (
                    <div className="w-full flex flex-row gap-4 items-center">
                      {" "}
                      <DatePicker
                        error={methods.formState.errors.endDate?.message}
                        name="endDate"
                        date={endDate}
                        defaultPlaceHolder="Escolha uma data de fim"
                      />
                    </div>
                  )}

                  <div className="flex flex-row justify-end">
                    <Button
                      type="submit"
                      onClick={onFilter}
                      className="font-bold z-40 cursor-pointer"
                    >
                      Aplicar filtros
                    </Button>
                  </div>
                </div>
              </FormProvider>
            </div>

            {isMobile && (
              <div className="flex justify-between mb-4">
                <Button variant="secondary" className="font-bold">
                  Visualizar imagens no Google Drive
                </Button>
              </div>
            )}

            <div className="flex justify-between mb-4">
              <p className="my-2">Logs das fotos</p>
            </div>

            <div className="rounded-md border border-secondary overflow-x-auto">
              {loading ? (
                Array.from({ length: 10 }).map((_, index) => (
                  <Skeleton
                    key={index}
                    className="h-[35px] w-full rounded-xs mt-1"
                  />
                ))
              ) : !hasDataToShow ? (
                <div className="flex flex-col gap-y-2 items-center">
                  <img
                    src="/plantex-logo.png"
                    alt="logo"
                    width={140}
                    height={140}
                  />
                  <span className="font-medium text-black dark:text-white mb-4">
                    Ops! Não encontramos nenhuma foto com os filtros aplicados.
                  </span>
                </div>
              ) : (
                <Table className="min-w-full">
                  <TableHeader className="bg-secondary">
                    <TableRow>
                      <TableHead>
                        <Checkbox
                          checked={selectedIds.length === tableData.length}
                          onCheckedChange={() => {
                            onSelectAllRows();
                          }}
                        />
                      </TableHead>
                      {TABLE_COLUMNS.map((column) => (
                        <TableHead key={column.id} className="font-bold">
                          {column.label}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tableData.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedIds.includes(row.id)}
                            onCheckedChange={() => {
                              console.log("onChange");
                              console.log(row.id);
                              console.log(selectedIds);
                              onSelectSingleRow(row.id);
                            }}
                          />
                        </TableCell>
                        {TABLE_COLUMNS.map((column) => {
                          const cellValue =
                            row[column.id as keyof typeof row]?.toString();
                          const type = column.type;
                          if (type === "link") {
                            return (
                              <TableCell key={column.id}>
                                <a
                                  href={cellValue}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 hover:underline block max-w-[600px] truncate"
                                  title={cellValue}
                                >
                                  {cellValue}
                                </a>
                              </TableCell>
                            );
                          }

                          if (type === "download") {
                            return (
                              <TableCell key={column.id}>
                                <Button
                                  variant="secondary"
                                  onClick={() => {
                                    window.open(cellValue, "_blank");
                                  }}
                                >
                                  Download
                                </Button>
                              </TableCell>
                            );
                          }

                          if (type === "datetime") {
                            const date = new Date(cellValue);
                            const formattedDate = date.toLocaleString("pt-BR", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                              timeZone: "UTC",
                            });
                            return (
                              <TableCell key={column.id}>
                                {formattedDate}
                              </TableCell>
                            );
                          }

                          return (
                            <TableCell key={column.id} className="font-medium">
                              {cellValue}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              {hasDataToShow && (
                <>
                  <div className="border-1 mt-1 border-dashed" />
                  <Pagination className="flex justify-end px-2 mt-1">
                    <PaginationContent>
                      <PaginationItem>
                        {filters.page > 0 ? (
                          <PaginationPrevious
                            href="#"
                            onClick={() => {
                              onPaginationChange("prev");
                            }}
                          />
                        ) : (
                          <div className="gap-1 px-2.5 sm:pr-2.5">
                            <span className="hidden sm:block text-secondary">
                              Anterior
                            </span>
                          </div>
                        )}
                      </PaginationItem>
                      <PaginationItem>
                        <span className="text-sm text-muted-foreground">
                          {filters.page + 1} de {maxPage}
                        </span>
                      </PaginationItem>
                      <PaginationItem>
                        {filters.page + 1 < maxPage ? (
                          <PaginationNext
                            href="#"
                            onClick={() => {
                              onPaginationChange("next");
                            }}
                          />
                        ) : (
                          <div className="gap-1 px-2.5 sm:pr-2.5">
                            <span className="hidden sm:block text-secondary">
                              Próximo
                            </span>
                          </div>
                        )}
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
