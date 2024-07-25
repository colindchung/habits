import { NextResponse } from "next/server";
import { formatDate } from "@/lib/date";
import supabase from "@/lib/supabase/client";
import { parseUrlQueryParams } from "@/lib/utils";

export async function GET(request: Request) {
  let date =
    parseUrlQueryParams(request.url)["date"] ||
    formatDate(new Date(), "YYYY-MM-DD");

  try {
    const { data, error } = await supabase
      .from("daily_notes")
      .select(
        `
          pushups,
          pullups,
          run_meters,
          bike_meters,
          stretch_html,
          strength_html,
          smoke,
          alcohol,
          edibles,
          pornography,
          youtube,
          pages_read
      `
      )
      .eq("date", date)
      .limit(1);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data.length > 0 ? data[0] : {}, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: "Error fetching data" }, { status: 500 });
  }
}

// export async function GET(request: Request) {
//   const requestData = await request.formData();

//   let date = requestData.get("date")?.toString();

//   if (!date) {
//     date = formatDate(new Date(), "YYYY-MM-DD");
//   }

//   try {
//     const { data, error } = await supabase
//       .from("daily_notes")
//       .select(
//         `
//           pushups,
//           pullups,
//           run_meters,
//           bike_meters,
//           stretch_html,
//           strength_html,
//           smoke,
//           alcohol,
//           edibles,
//           pornography,
//           youtube,
//           pages_read
//       `
//       )
//       .eq("date", date);

//     if (error) {
//       return NextResponse.json({ error: error.message }, { status: 500 });
//     }

//     return NextResponse.json(data, { status: 200 });
//   } catch (e) {
//     return NextResponse.json(
//       { error: "Error inserting email" },
//       { status: 500 }
//     );
//   }
// }
