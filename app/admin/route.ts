import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function isAdmin() {
  const session = await auth();
  const email = session?.user?.email;
  const adminEmail = process.env.ADMIN_EMAIL;
  return !!email && !!adminEmail && email.trim().toLowerCase() === adminEmail.trim().toLowerCase();
}

export async function GET() {
  try {
    if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const [items, categories, settings] = await Promise.all([
      supabaseAdmin.from("menu_items").select("*").order("id", { ascending: true }),
      supabaseAdmin.from("menu_categories").select("*").order("display_order", { ascending: true }),
      supabaseAdmin.from("menu_settings").select("*").eq("id", 1).maybeSingle(),
    ]);

    if (items.error) throw items.error;
    if (categories.error) throw categories.error;
    if (settings.error) throw settings.error;

    return NextResponse.json({ items: items.data || [], categories: categories.data || [], settings: settings.data || { id: 1, background_image: "" } });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Could not load menu." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const items = Array.isArray(body.items) ? body.items : [];
    const categories = Array.isArray(body.categories) ? body.categories : [];
    const backgroundImage = typeof body.backgroundImage === "string" ? body.backgroundImage : "";

    for (let i = 0; i < categories.length; i++) {
      const c = categories[i];
      const id = String(c.id || `cat-${Date.now()}-${i}`);
      const result = await supabaseAdmin.from("menu_categories").upsert({
        id,
        name: String(c.name || ""),
        image_url: c.image ? String(c.image) : null,
        display_order: Number.isFinite(Number(c.order)) ? Number(c.order) : i,
        visible: c.visible !== false,
        updated_at: new Date().toISOString(),
      }, { onConflict: "id" });
      if (result.error) throw new Error(`Category "${c.name}" failed: ${result.error.message}`);
    }

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const id = Number(item.id);
      if (!Number.isFinite(id)) throw new Error(`Invalid menu item ID at item ${i + 1}.`);
      const price = item.price === "" || item.price == null ? null : Number(item.price);
      if (price !== null && !Number.isFinite(price)) throw new Error(`Invalid price for "${item.name}".`);

      const result = await supabaseAdmin.from("menu_items").upsert({
        id,
        name: String(item.name || ""),
        description: String(item.description || ""),
        price,
        category: String(item.category || ""),
        image_url: item.image ? String(item.image) : null,
        is_available: item.available !== false,
      }, { onConflict: "id" });
      if (result.error) throw new Error(`Item "${item.name}" failed: ${result.error.message}`);
    }

    const settingsResult = await supabaseAdmin.from("menu_settings").upsert({
      id: 1,
      background_image: backgroundImage || null,
      updated_at: new Date().toISOString(),
    }, { onConflict: "id" });
    if (settingsResult.error) throw new Error(`Settings failed: ${settingsResult.error.message}`);

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("ADMIN MENU SAVE ERROR", e);
    return NextResponse.json({ error: e?.message || "Could not save menu." }, { status: 500 });
  }
}
