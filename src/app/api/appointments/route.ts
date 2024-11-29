import db from "@/lib/db";
import { ResultSetHeader } from "mysql2";

export async function GET(request: Request) {
	try {
		const [rows] = await db.query("SELECT * FROM appointments");
		console.log("rows", rows);
		return new Response(JSON.stringify(rows), { status: 200 });
	} catch (error) {
		console.error("Error fetching appointments:", error);
		return new Response(JSON.stringify({ error: "Database error" }), {
			status: 500,
		});
	}
}

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { name, email, doctor } = body;

		if (!name || !email || !doctor) {
			return new Response(JSON.stringify({ error: "Missing fields" }), {
				status: 400,
			});
		}

		const [result] = await db.query<ResultSetHeader>(
			"INSERT INTO appointments (name, email, doctor) VALUES (?, ?, ?)",
			[name, email, doctor]
		);
		return new Response(
			JSON.stringify({ id: result.insertId, name, email, doctor }),
			{ status: 201 }
		);
	} catch (error) {
		console.error("Error creating appointment:", error);
		return new Response(JSON.stringify({ error: "Database error" }), {
			status: 500,
		});
	}
}
