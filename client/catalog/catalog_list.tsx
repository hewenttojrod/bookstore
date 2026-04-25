import { useEffect, useMemo, useState } from "react";
import FormBody from "@templates/form-body";
import DataGrid from "@templates/data-grid";
import type { ColumnDef, GridContextAction } from "@app-types/api";
import { BOOK_LIST_ENDPOINT, deleteBookById, fetchBookGenreOptions } from "./book-api";

type BookRow = {
  book_id: number;
  title: string;
  description: string;
  genre: string | null;
  author: string;
  sbn_code: string;
};

export default function BookstoreCatalog() {
  const [genreMap, setGenreMap] = useState<Record<string, string>>({});
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const run = async () => {
      try {
        const options = await fetchBookGenreOptions(controller.signal);
        setGenreMap(Object.fromEntries(options.map((opt) => [opt.value, opt.label])));
      } catch {
        setGenreMap({});
      }
    };

    void run();

    return () => controller.abort();
  }, []);

  
  const columns: ColumnDef<BookRow>[] = useMemo(
    () => [
      { key: "book_id", label: "ID", width: "90px", sortable: true },
      { key: "title", label: "Title", sortable: true },
      { key: "author", label: "Author", sortable: true },
      {
        key: "genre",
        label: "Genre",
        sortable: true,
        render: (_value, row) => {
          const code = String(row.genre ?? "");
          return genreMap[code] ?? code;
        },
      },
      { key: "sbn_code", label: "SBN Code", sortable: true },
      {
        key: "description",
        label: "Description",
        render: (_value, row) => {
          const text = String(row.description ?? "");
          return text.length > 80 ? `${text.slice(0, 80)}...` : text;
        },
      },
    ],
    [genreMap]
  );

  const contextMenuActions: GridContextAction<BookRow>[] = useMemo(
    () => [
      {
        id: "delete-book",
        label: "Delete Book",
        isVisible: (context: { hasRow: boolean }) => context.hasRow,
        onClick: (context: { row: BookRow | null }) => {
          const row = context.row;
          if (!row) return;

          const confirmed = window.confirm(
            `Delete \"${row.title}\" by ${row.author}? This action cannot be undone.`
          );
          if (!confirmed) return;

          void deleteBookById(row.book_id)
            .then(() => {
              setRefreshTick((prev: number) => prev + 1);
            })
            .catch((err: unknown) => {
              const message = err instanceof Error ? err.message : "Delete failed.";
              window.alert(message);
            });
        },
      },
    ],
    []
  );

  const gridParams = useMemo(() => ({ _r: String(refreshTick) }), [refreshTick]);

  return (
    <FormBody title="Bookstore Catalog" subtitle="Books loaded asynchronously from the REST API.">
      <DataGrid<BookRow>
        columns={columns}
        endpoint={BOOK_LIST_ENDPOINT}
        params={gridParams}
        contextMenuActions={contextMenuActions}
      />
    </FormBody>
  );
}