import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listEvents from "./tools/list-events";
import getEvent from "./tools/get-event";
import createEvent from "./tools/create-event";
import listNotices from "./tools/list-notices";
import createNotice from "./tools/create-notice";
import listNews from "./tools/list-news";
import listFaculty from "./tools/list-faculty";
import listAchievements from "./tools/list-achievements";

// The OAuth issuer must be the direct Supabase host; the project ref is the only
// Supabase value that survives publish unchanged.
const projectRef = import.meta.env['VITE_SUPABASE_PROJECT_ID'] ?? "project-ref-unset";

export default defineMcp({
  name: "department-hub",
  title: "Department Hub",
  version: "0.1.0",
  instructions:
    "Tools for the AI & ML Department Activity Portal. Read events, notices, news, faculty and achievements, and (as an admin) create events and notices. All calls run as the signed-in portal user, so admin-only writes fail for non-admins.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [
    listEvents,
    getEvent,
    createEvent,
    listNotices,
    createNotice,
    listNews,
    listFaculty,
    listAchievements,
  ],
});
