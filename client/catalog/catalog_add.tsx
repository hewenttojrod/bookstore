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
import ErrorBanner from "@templates/error-banner";
import FormBuilder from "@templates/form-builder";
import FormBody from "@templates/form-body";
import SectionPanel from "@templates/section-panel";
import SuccessBanner from "@templates/success-banner";
import { useFormEngine } from "@/hooks/use-form-engine";
import { fetchWithRetry } from "@/utils/api-fetch";
import { parseJsonResponse } from "@/utils/api-json";
import { BOOK_ENTRY_ENDPOINT, fetchBookGenreOptions, type BookGenreOption } from "./book-api";
import { createBookFormSchema } from "./book-form.schema";

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
  const [genreOptions, setGenreOptions] = useState<BookGenreOption[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  const formSchema = useMemo(() => createBookFormSchema(genreOptions), [genreOptions]);
  const {
    values,
    errors,
    setFieldValue,
    reset,
    validate,
    buildPayload,
    clearErrors,
  } = useFormEngine(formSchema);

  const onCreateBook = async () => {
    if (!validate()) {
      setError("Please correct highlighted form fields.");
      return;
    }

    setSaving(true);
    setMessage(null);
    setError(null);
    clearErrors();

    try {
      const payload = buildPayload();
      const response = await fetchWithRetry(BOOK_ENTRY_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await parseJsonResponse<BookPayload>(response);
      setApiResponse(data);
      setMessage("Book created.");
      reset();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <FormBody
      title="Add Book"
      subtitle="Create a new book entry via REST API POST /book/ and inspect the returned payload."
    >
      {message && <SuccessBanner message={message} />}
      {error && <ErrorBanner message={error} />}

      <SectionPanel title="New Book">
        <FormBuilder
          schema={formSchema}
          values={values}
          errors={errors}
          disabled={saving}
          onChange={setFieldValue}
        />

        <div className="action-row">
          <button type="button" className="btn-primary" disabled={saving} onClick={() => void onCreateBook()}>
            {saving ? "Saving..." : "Create Book"}
          </button>
        </div>
      </SectionPanel>

      {apiResponse && (
        <SectionPanel title="POST Response">
          <pre className="overflow-x-auto text-xs text-slate-700 dark:text-slate-300">
            {JSON.stringify(apiResponse, null, 2)}
          </pre>
        </SectionPanel>
      )}
    </FormBody>
  );
}
