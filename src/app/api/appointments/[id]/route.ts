import db from "@/lib/db";

export async function DELETE(
	request: Request,
	{
		params,
	}: {
		params: {
			id: string;
		};
	}
) {
	try {
		const { id } = params;

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
