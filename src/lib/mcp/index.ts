import { auth, defineMcp } from "@lovable.dev/mcp-js";
import getMyProfile from "./tools/get-my-profile";
import listMyOrders from "./tools/list-my-orders";
import listProducts from "./tools/list-products";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "jasebku-store-mcp",
  title: "JasebKu Store MCP",
  version: "0.1.0",
  instructions:
    "Tools for JasebKu Store. Use `list_products` to browse the catalog, `get_my_profile` and `list_my_orders` to inspect the signed-in user's account.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [getMyProfile, listMyOrders, listProducts],
});
