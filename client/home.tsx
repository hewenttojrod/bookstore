/**
 * Bookstore module home/landing page.
 * Currently displays a simple welcome message.
 * Can be expanded with module overview, statistics, or quick actions.
 */
import FormBody from "@templates/form-body";

export default function BookstoreHome() {
  return (
    <FormBody title="Bookstore">
      <p className="text-sm text-slate-600 dark:text-slate-300">
        You are in Bookstore Home!
      </p>
    </FormBody>
  );
}
