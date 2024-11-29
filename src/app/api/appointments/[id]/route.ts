import db from "@/lib/db";
import { NextRequest } from "next/server";

export async function DELETE(
	request: NextRequest,
	{
		params,
	}: {
		params: Promise<{
			id: string;
		}>;
	}
) {
	try {
		const id = (await params).id;
		if (!id) {
			return new Response(JSON.stringify({ error: "Missing appointment ID" }), {
				status: 400,
			});
		}

		const [result] = await db.query("DELETE FROM appointments WHERE id = ?", [
			id,
		]);
		console.log("result", result);

		if (result.affectedRows === 0) {
			return new Response(JSON.stringify({ error: "Appointment not found" }), {
				status: 404,
			});
		}

		return new Response(
			JSON.stringify({ message: "Appointment deleted successfully" }),
			{
				status: 200,
			}
		);
	} catch (error) {
		console.error("Error deleting appointment:", error);
		return new Response(JSON.stringify({ error: "Database error" }), {
			status: 500,
		});
	}
}
