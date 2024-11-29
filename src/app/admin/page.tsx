"use client";

import { useState, useEffect } from "react";
import activeDoctors from "@/data/activeDoctors"; // Adjust path based on your structure

export default function AdminDashboard() {
	const [selectedDoctor, setSelectedDoctor] = useState("");
	const [patients, setPatients] = useState([]);

	// Fetch all appointments when a doctor is selected
	useEffect(() => {
		const fetchPatients = async () => {
			if (selectedDoctor) {
				try {
					const response = await fetch("/api/appointments");
					if (!response.ok) {
						throw new Error("Failed to fetch appointments");
					}

					const data = await response.json();
					const doctorPatients = data.filter(
						(appointment) => appointment.doctor === selectedDoctor
					);
					setPatients(doctorPatients);
				} catch (error) {
					console.error("Error fetching appointments:", error);
				}
			} else {
				setPatients([]);
			}
		};

		fetchPatients();
	}, [selectedDoctor]);

	// Remove a patient
	const handleRemovePatient = async (id) => {
		try {
			const response = await fetch(`/api/appointments/${id}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				throw new Error("Failed to remove patient");
			}

			// Remove patient from the UI
			setPatients((prevPatients) =>
				prevPatients.filter((patient) => patient.id !== id)
			);
			alert("Patient removed successfully!");
		} catch (error) {
			console.error("Error removing patient:", error);
		}
	};

	return (
		<div className="min-h-screen bg-gray-100">
			<header className="bg-indigo-600 text-white p-4 flex justify-between items-center">
				<h1 className="text-2xl font-bold">Hospital Management System</h1>
				<div>
					<select
						onChange={(e) => setSelectedDoctor(e.target.value)}
						value={selectedDoctor}
						className="bg-white text-gray-700 border border-gray-300 rounded px-4 py-2"
					>
						<option value="" disabled>
							Select Doctor
						</option>
						{activeDoctors.map((doctor) => (
							<option key={doctor.id} value={doctor.name}>
								{doctor.name}
							</option>
						))}
					</select>
				</div>
			</header>

			{/* Content */}
			<main className="p-6">
				{!selectedDoctor ? (
					<p className="text-center text-gray-600 text-lg">
						Please select a doctor to view patients.
					</p>
				) : (
					<div>
						<h2 className="text-xl font-semibold mb-4 text-gray-600">
							Patients for{" "}
							<span className="text-indigo-600">{selectedDoctor}</span>
						</h2>
						{patients.length === 0 ? (
							<p className="text-gray-600">
								No patients found for this doctor.
							</p>
						) : (
							<div className="overflow-x-auto">
								<table className="min-w-full bg-white shadow-md rounded">
									<thead className="bg-gray-100">
										<tr>
											<th className="text-left py-3 px-4 text-gray-700">
												Name
											</th>
											<th className="text-left py-3 px-4 text-gray-700">
												Email
											</th>
											<th className="text-left py-3 px-4 text-gray-700">
												Actions
											</th>
										</tr>
									</thead>
									<tbody>
										{patients.map((patient) => (
											<tr key={patient.id} className="border-b text-black">
												<td className="py-3 px-4">{patient.name}</td>
												<td className="py-3 px-4">{patient.email}</td>
												<td className="py-3 px-4">
													<button
														onClick={() => handleRemovePatient(patient.id)}
														className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
													>
														Remove
													</button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}
					</div>
				)}
			</main>
		</div>
	);
}
