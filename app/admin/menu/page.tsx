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
    session.user.email.toLowerCase() ===
      adminEmail.toLowerCase()
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
          .order("display_order", {
            ascending: true,
          }),

        supabaseAdmin
          .from("menu_settings")
          .select("*")
          .eq("id", 1)
          .maybeSingle(),
      ]);

    if (itemsResult.error) {
      throw itemsResult.error;
    }

    if (categoriesResult.error) {
      throw categoriesResult.error;
    }

    if (settingsResult.error) {
      throw settingsResult.error;
    }

    return NextResponse.json({
      items: itemsResult.data || [],
      categories: categoriesResult.data || [],
      settings: settingsResult.data || {
        id: 1,
        background_image: "",
      },
    });
  } catch (error) {
    console.error("Admin menu GET error:", error);

    return NextResponse.json(
      {
        error: "Could not load menu data.",
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
     * Save categories
     */
    const categoryRows = categories.map(
      (category: any, index: number) => ({
        id: String(category.id),
        name: String(category.name || ""),
        image_url:
          typeof category.image === "string"
            ? category.image
            : null,
        display_order:
          Number.isFinite(Number(category.order))
            ? Number(category.order)
            : index,
        visible:
          category.visible !== false,
      })
    );

    const { error: categoryError } =
      await supabaseAdmin
        .from("menu_categories")
        .upsert(categoryRows, {
          onConflict: "id",
        });

    if (categoryError) {
      throw categoryError;
    }

    /*
     * Remove old categories that no longer exist
     */
    const categoryIds = categoryRows.map(
      (category: any) => category.id
    );

    if (categoryIds.length > 0) {
      const { error: deleteCategoryError } =
        await supabaseAdmin
          .from("menu_categories")
          .delete()
          .not("id", "in", `(${categoryIds.join(",")})`);

      if (deleteCategoryError) {
        console.warn(
          "Category cleanup warning:",
          deleteCategoryError
        );
      }
    }

    /*
     * Save menu items
     */
    const itemRows = items.map((item: any) => ({
      id: Number(item.id),
      name: String(item.name || ""),
      description: String(item.description || ""),
      price:
        item.price === "" ||
        item.price === null ||
        item.price === undefined
          ? null
          : Number(item.price),
      category: String(item.category || ""),
      image_url:
        typeof item.image === "string"
          ? item.image
          : null,
      is_available:
        item.available !== false,
    }));

    if (itemRows.length > 0) {
      const { error: itemError } =
        await supabaseAdmin
          .from("menu_items")
          .upsert(itemRows, {
            onConflict: "id",
          });

      if (itemError) {
        throw itemError;
      }

      const itemIds = itemRows.map(
        (item: any) => item.id
      );

      const { error: deleteItemError } =
        await supabaseAdmin
          .from("menu_items")
          .delete()
          .not("id", "in", `(${itemIds.join(",")})`);

      if (deleteItemError) {
        console.warn(
          "Menu item cleanup warning:",
          deleteItemError
        );
      }
    } else {
      const { error: deleteAllItemsError } =
        await supabaseAdmin
          .from("menu_items")
          .delete()
          .neq("id", 0);

      if (deleteAllItemsError) {
        console.warn(
          "Menu item cleanup warning:",
          deleteAllItemsError
        );
      }
    }

    /*
     * Save menu background
     */
    const { error: settingsError } =
      await supabaseAdmin
        .from("menu_settings")
        .upsert(
          {
            id: 1,
            background_image: backgroundImage,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "id",
          }
        );

    if (settingsError) {
      throw settingsError;
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Admin menu POST error:", error);

    return NextResponse.json(
      {
        error: "Could not save menu data.",
      },
      { status: 500 }
    );
  }
}
