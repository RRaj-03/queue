"use client";

import { useState, useEffect } from "react";
import activeDoctors from "@/data/activeDoctors"; // Adjust path based on your structure
import Image from "next/image";
import Link from "next/link";

export default function AdminDashboard() {
	const [selectedDoctor, setSelectedDoctor] = useState("");
	const [patients, setPatients] = useState([]);
	const [isLoggedin, setIsloggedIn] = useState(false);
	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});
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
						(appointment: { doctor: string }) =>
							appointment.doctor === selectedDoctor
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
	const handleRemovePatient = async (id: string) => {
		try {
			const response = await fetch(`/api/appointments/${id}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				throw new Error("Failed to remove patient");
			}

			// Remove patient from the UI
			setPatients((prevPatients) =>
				prevPatients.filter((patient: { id: string }) => patient.id !== id)
			);
			alert("Patient removed successfully!");
		} catch (error) {
			console.error("Error removing patient:", error);
		}
	};
	const handleChange = (e: any) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};
	const handleSubmit = async (e: any) => {
		e.preventDefault();
		if (!formData.username || !formData.password) {
			alert("Please fill username and password both");
			return;
		}
		if (formData.username === "admin" && formData.password === "admin") {
			setIsloggedIn(true);
			alert("Logged In Successfully");
		} else {
			alert("Incorrect Credentials!");
		}
	};
	return (
		<div className="min-h-screen bg-gray-100">
			<header className="bg-indigo-600 text-white p-4 flex justify-between items-center">
				<Link href={"/"} className="flex gap-x-2">
					<Image src={"/image.png"} width={50} height={50} alt="" />{" "}
					<h1 className="text-2xl font-bold">BC Roy Hospital | Imedix</h1>
				</Link>
				{isLoggedin && (
					<>
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
					</>
				)}
			</header>
			{!isLoggedin && (
				<main>
					<div className="min-h-screen flex justify-center items-center">
						<div className="bg-slate-600 shadow-md rounded px-8 py-6 w-full md:w-1/2 lg:w-1/3">
							<h2 className="text-white text-2xl font-bold text-center mb-4">
								Login
							</h2>
							<form onSubmit={handleSubmit} className="space-y-4">
								<div>
									<label
										htmlFor="username"
										className="block text-sm font-medium text-gray-300"
									>
										User Name
									</label>
									<input
										type="text"
										name="username"
										id="username"
										value={formData.username}
										onChange={handleChange}
										required
										className="mt-1 block w-full px-3 py-2 bg-slate-500 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
									/>
								</div>
								<div>
									<label
										htmlFor="password"
										className="block text-sm font-medium text-gray-300"
									>
										Password
									</label>
									<input
										type="password"
										name="password"
										id="password"
										value={formData.password}
										onChange={handleChange}
										required
										className="mt-1 block w-full px-3 py-2 bg-slate-500 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
									/>
								</div>
								<button
									type="submit"
									className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded hover:bg-indigo-700"
								>
									Book Appointment
								</button>
							</form>
						</div>
					</div>
				</main>
			)}
			{/* Content */}
			{isLoggedin && (
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
											{patients.map(
												(patient: {
													id: string;
													name: string;
													email: string;
												}) => (
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
												)
											)}
										</tbody>
									</table>
								</div>
							)}
						</div>
					)}
				</main>
			)}
		</div>
	);
}
