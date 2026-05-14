import type { SelectOption } from "@app-types/api";
import type { FormSchema } from "@/schemas/form-schema.types";

type BookRequestPayload = {
  title: string;
  description: string;
  genre: string | null;
  author: string;
};

export type BookFormValues = {
  title: string;
  author: string;
  genre: string;
  description: string;
};

/**
 * Factory that produces the bookstore add-book `FormSchema`.
 *
 * Accepts `genreOptions` at runtime (loaded asynchronously from the API) so that the
 * genre select field is populated. Call this inside a `useMemo` that depends on the
 * loaded options to avoid re-creating the schema on every render.
 *
 * `payloadTransform` trims whitespace from title/author and converts an empty genre
 * string to `null` before sending to the API.
 */
export function createBookFormSchema(
  genreOptions: SelectOption[]
): FormSchema<BookFormValues, BookRequestPayload> {
  return {
    name: "BookstoreCatalogAdd",
    sections: [
      {
        id: "book",
        label: "Book Details",
        fields: ["title", "author", "genre", "description"],
      },
    ],
    fields: [
      {
        key: "title",
        label: "Title",
        type: "text",
        section: "book",
        required: true,
        defaultValue: "",
      },
      {
        key: "author",
        label: "Author",
        type: "text",
        section: "book",
        required: true,
        defaultValue: "",
      },
      {
        key: "genre",
        label: "Genre",
        type: "select",
        section: "book",
        options: [{ value: "", label: "- Select -" }, ...genreOptions],
        defaultValue: "",
      },
      {
        key: "description",
        label: "Description",
        type: "textarea",
        section: "book",
        wide: true,
        defaultValue: "",
      },
    ],
    payloadTransform: (values) => ({
      title: values.title.trim(),
      author: values.author.trim(),
      genre: values.genre ? values.genre : null,
      description: values.description,
    }),
  };
}
