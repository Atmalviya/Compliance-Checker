import { supabaseAdmin } from "../lib/supabaseClient.js";

export async function checkRLS() {
  try {
    const { data, error } = await supabaseAdmin.rpc("get_rls_status");

    if (error) throw error;

    try {
      await supabaseAdmin.from("compliance_logs").insert([
        {
          check_type: "RLS_CHECK",
          status: data.every((table) => table.rls_enabled),
          details: {
            total_tables: data.length,
            tables_with_rls: data.filter((t) => t.rls_enabled).length,
            tables_without_rls: data.filter((t) => !t.rls_enabled).length,
            table_details: data,
          },
        },
      ]);
    } catch (logError) {
      console.error("Failed to log RLS check:", logError);
    }

    return data || [];
  } catch (error) {
    console.error("RLS Check Error:", error);
    throw error;
  }
}
