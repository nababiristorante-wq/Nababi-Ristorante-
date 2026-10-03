import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(
  supabaseUrl,
  serviceRoleKey
);

async function checkAdmin() {
  const session = await auth();

  if (!session?.user?.email) {
    return false;
  }

  const adminEmail = process.env.ADMIN_EMAIL;

  return (
    !!adminEmail &&
    session.user.email.trim().toLowerCase() ===
      adminEmail.trim().toLowerCase()
  );
}

export async function GET() {
  try {
    if (!(await checkAdmin())) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const [itemsResult, categoriesResult, settingsResult] =
      await Promise.all([
        supabaseAdmin
          .from("menu_items")
          .select("*")
          .order("id", { ascending: true }),

        supabaseAdmin
          .from("menu_categories")
          .select("*")
          .order("display_order", { ascending: true }),

        supabaseAdmin
          .from("menu_settings")
          .select("*")
          .eq("id", 1)
          .maybeSingle(),
      ]);

    if (itemsResult.error) throw itemsResult.error;
    if (categoriesResult.error) throw categoriesResult.error;
    if (settingsResult.error) throw settingsResult.error;

    return NextResponse.json({
      items: itemsResult.data || [],
      categories: categoriesResult.data || [],
      settings: settingsResult.data || {
        id: 1,
        background_image: "",
      },
    });
  } catch (error: any) {
    console.error("MENU GET ERROR:", error);

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Could not load menu data.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!(await checkAdmin())) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const items = Array.isArray(body.items)
      ? body.items
      : [];

    const categories = Array.isArray(body.categories)
      ? body.categories
      : [];

    const backgroundImage =
      typeof body.backgroundImage === "string"
        ? body.backgroundImage
        : "";

    /*
     * CATEGORIES
     */

    for (let index = 0; index < categories.length; index++) {
      const category = categories[index];

      const categoryId = String(
        category.id || `category-${Date.now()}-${index}`
      );

      const { error } = await supabaseAdmin
        .from("menu_categories")
        .upsert(
          {
            id: categoryId,
            name: String(category.name || ""),
            image_url:
              typeof category.image === "string" &&
              category.image.trim()
                ? category.image.trim()
                : null,
            display_order: Number.isFinite(
              Number(category.order)
            )
              ? Number(category.order)
              : index,
            visible: category.visible !== false,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "id",
          }
        );

      if (error) {
        console.error(
          "CATEGORY SAVE ERROR:",
          error
        );

        throw new Error(
          `Category save failed: ${error.message}`
        );
      }
    }

    /*
     * MENU ITEMS
     */

    for (let index = 0; index < items.length; index++) {
      const item = items[index];

      const itemId = Number(item.id);

      if (!Number.isFinite(itemId)) {
        throw new Error(
          `Invalid menu item ID at item ${index + 1}`
        );
      }

      let price: number | null = null;

      if (
        item.price !== "" &&
        item.price !== null &&
        item.price !== undefined
      ) {
        const parsedPrice = Number(item.price);

        if (!Number.isFinite(parsedPrice)) {
          throw new Error(
            `Invalid price for "${item.name}"`
          );
        }

        price = parsedPrice;
      }

      const { error } = await supabaseAdmin
        .from("menu_items")
        .upsert(
          {
            id: itemId,
            name: String(item.name || ""),
            description: String(
              item.description || ""
            ),
            price,
            category: String(item.category || ""),
            image_url:
              typeof item.image === "string" &&
              item.image.trim()
                ? item.image.trim()
                : null,
            is_available:
              item.available !== false,
          },
          {
            onConflict: "id",
          }
        );

      if (error) {
        console.error(
          "MENU ITEM SAVE ERROR:",
          error
        );

        throw new Error(
          `Menu item "${item.name}" save failed: ${error.message}`
        );
      }
    }

    /*
     * BACKGROUND
     */

    const { error: settingsError } =
      await supabaseAdmin
        .from("menu_settings")
        .upsert(
          {
            id: 1,
            background_image:
              backgroundImage.trim() || null,
            updated_at:
              new Date().toISOString(),
          },
          {
            onConflict: "id",
          }
        );

    if (settingsError) {
      console.error(
        "MENU SETTINGS SAVE ERROR:",
        settingsError
      );

      throw new Error(
        `Background save failed: ${settingsError.message}`
      );
    }

    return NextResponse.json({
      success: true,
      message: "Menu saved successfully.",
    });
  } catch (error: any) {
    console.error(
      "ADMIN MENU POST ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error?.message ||
          "Could not save menu data.",
      },
      { status: 500 }
    );
  }
}
