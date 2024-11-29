"use client";

import { useState, useEffect } from "react";
import activeDoctors from "@/data/activeDoctors"; // Adjust path based on your structure

export default function AppointmentPage() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		doctor: "",
	});
	const [appointments, setAppointments] = useState<
		{ id: number; name: String; email: string; doctor: string }[]
	>([]);
	const [doctorSummary, setDoctorSummary] = useState<{
		[doctorName: string]: number;
	}>({});
	const [appointmentNumber, setAppointmentNumber] = useState(0);
	const [appointmentDoctor, setAppointmentDoctor] = useState<string | null>(
		null
	);
	useEffect(() => {
		fetchAppointments();
	}, []);

	const fetchAppointments = async () => {
		try {
			const res = await fetch("/api/appointments", { method: "GET" });
			const data = await res.json();
			setAppointments(data);
			updateDoctorSummary(data);
		} catch (error) {
			console.error("Error fetching appointments:", error);
		}
	};

	const handleChange = (e: any) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: any) => {
		e.preventDefault();

		if (!formData.doctor) {
			alert("Please select a doctor.");
			return;
		}

		try {
			const res = await fetch("/api/appointments", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});

			if (!res.ok) {
				const error = await res.json();
				alert(error.error || "Failed to book appointment.");
				return;
			}

			const newAppointment = await res.json();
			const updatedAppointments = [...appointments, newAppointment];
			setAppointments(updatedAppointments);
			updateDoctorSummary(updatedAppointments);
			setAppointmentDoctor(formData.doctor);
			setAppointmentNumber(
				updatedAppointments.filter(
					(appointment) => appointment.doctor === formData.doctor
				).length
			);

			setFormData({ name: "", email: "", doctor: "" });
		} catch (error) {
			console.error("Error booking appointment:", error);
		}
	};

	const updateDoctorSummary = (appointmentsList: any[]) => {
		const summary = activeDoctors.reduce(
			(acc: { [doctorName: string]: number }, doctor) => {
				acc[doctor.name] = appointmentsList.filter(
					(appt) => appt.doctor === doctor.name
				).length;
				return acc;
			},
			{}
		);
		setDoctorSummary(summary);
	};

	return (
		<div className="min-h-screen bg-slate-800 flex flex-col">
			{/* Header */}
			<header className="bg-white text-black flex justify-center items-center px-8 py-2 shadow-md">
				<h1 className="text-xl font-bold">BC Roy Aspatal</h1>
			</header>
			{Boolean(appointmentNumber) && appointmentDoctor && (
				<div className="bg-green-500 text-black flex justify-center items-center px-8 py-2 shadow-md">
					<span className="text-xl font-bold">
						Your Appointment Token is {appointmentNumber} for{" "}
						{appointmentDoctor}
					</span>
				</div>
			)}

			{/* Main Content */}
			<div className=" items-start justify-between h-full p-6">
				{/* Appointment Form */}
				<div className="min-h-screen flex justify-center items-center">
					<div className="bg-slate-600 shadow-md rounded px-8 py-6 w-full md:w-1/2 lg:w-1/3">
						<h2 className="text-white text-2xl font-bold text-center mb-4">
							Book a Doctor's Appointment
						</h2>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div>
								<label
									htmlFor="name"
									className="block text-sm font-medium text-gray-300"
								>
									Full Name
								</label>
								<input
									type="text"
									name="name"
									id="name"
									value={formData.name}
									onChange={handleChange}
									required
									className="mt-1 block w-full px-3 py-2 bg-slate-500 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
								/>
							</div>
							<div>
								<label
									htmlFor="email"
									className="block text-sm font-medium text-gray-300"
								>
									Email Address
								</label>
								<input
									type="email"
									name="email"
									id="email"
									value={formData.email}
									onChange={handleChange}
									required
									className="mt-1 block w-full px-3 py-2 bg-slate-500 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
								/>
							</div>
							<div>
								<label
									htmlFor="doctor"
									className="block text-sm font-medium text-gray-300"
								>
									Select Doctor
								</label>
								<select
									name="doctor"
									id="doctor"
									value={formData.doctor}
									onChange={handleChange}
									required
									className="mt-1 block w-full px-3 py-2 bg-slate-500 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
								>
									<option value="" disabled>
										Choose a doctor
									</option>
									{activeDoctors.map((doctor) => (
										<option key={doctor.id} value={doctor.name}>
											{doctor.name}
										</option>
									))}
								</select>
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
				{/* Doctor Summary */}
				<div className="w-full md:w-1/2 lg:w-1/3 mt-8 md:mt-0 m-auto">
					<h2 className="text-white text-2xl font-bold mb-4 text-center">
						Doctor's Appointment Summary
					</h2>
					<div className="bg-slate-600 p-4 rounded shadow-md">
						{activeDoctors.map((doctor) => (
							<div
								key={doctor.id}
								className="flex items-center justify-between text-white mb-2"
							>
								<span className="font-semibold">{doctor.name}</span>
								<span className="text-indigo-400">
									{doctorSummary[doctor.name] || 0} Appointments
								</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
