/**
 * Bookstore add book page.
 * Provides a form to create new books via REST API POST request.
 * 
 * Features:
 * - Dynamically loads genre options from backend
 * - Form fields: Title, Author, Genre (select), Description (textarea)
 * - Displays POST response payload in JSON format after successful creation
 * - Supports EntryForm's create mode (initial mode is always "create")
 * 
 * Component State:
 * - apiResponse: Stores the POST response from successful book creation
 * - genreOptions: Genre options for the genre select field
 */
import { useEffect, useMemo, useState } from "react";
import FormBody from "@templates/form-body";
import EntryForm from "@templates/entry-form";
import type { FieldDef } from "@app-types/api";
import { BOOK_ENTRY_ENDPOINT, fetchBookGenreOptions } from "./book-api";

type BookPayload = {
  title: string;
  description: string;
  genre: string | null;
  author: string;
  sbn_code: string;
  book_id?: number;
};

export default function BookstoreCatalogAdd() {
  const [apiResponse, setApiResponse] = useState<BookPayload | null>(null);
  const [genreOptions, setGenreOptions] = useState<Array<{ label: string; value: string }>>([]);

  useEffect(() => {
    const controller = new AbortController();

    const run = async () => {
      try {
        const options = await fetchBookGenreOptions(controller.signal);
        setGenreOptions(options);
      } catch {
        setGenreOptions([]);
      }
    };

    void run();

    return () => controller.abort();
  }, []);

  const fields: FieldDef<BookPayload>[] = useMemo(
    () => [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "author", label: "Author", type: "text", required: true },
      {
        key: "genre",
        label: "Genre",
        type: "select",
        options: genreOptions,
      },
      // { key: "sbn_code", label: "SBN Code", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
    ],
    [genreOptions]
  );

  return (
    <FormBody
      title="Add Book"
      subtitle="Create a new book entry via REST API POST /book/ and inspect the returned payload."
    >
      <EntryForm<BookPayload>
        fields={fields}
        endpoint={BOOK_ENTRY_ENDPOINT}
        initialMode="create"
        onSuccess={(result) => {
          if (result.mode === "saved") {
            setApiResponse(result.data as BookPayload);
          }
        }}
      />

      {apiResponse && (
        <section className="rounded-md border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
          <h2 className="mb-2 text-sm font-semibold">POST Response</h2>
          <pre className="overflow-x-auto text-xs text-slate-700 dark:text-slate-300">
            {JSON.stringify(apiResponse, null, 2)}
          </pre>
        </section>
      )}
    </FormBody>
  );
}
